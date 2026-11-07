import initSqlJs, { Database, SqlJsStatic } from 'sql.js';
import {
  ColumnInfo,
  ForeignKeyInfo,
  QueryExecutionResult,
  TableSchemaInfo,
} from '../types/database';
import { INITIAL_SCHEMA_AND_SEED_SQL, TABLE_DESCRIPTIONS } from './schemaAndSeed';
import { diagnoseSqlError } from './errorAdvisor';
import { SQL_ENGINE_MESSAGES, SupportedLanguage } from '../services/i18n';

const CORE_PROTECTED_TABLES = [
  'organizations',
  'locations',
  'citizens',
  'transactions',
  'securitylogs',
  'missions',
  'evidence',
];

export class SqlEngine {
  private SQL: SqlJsStatic | null = null;
  private db: Database | null = null;

  async init(wasmUrl?: string): Promise<void> {
    if (!this.SQL) {
      this.SQL = await initSqlJs({
        locateFile: (file: string) => wasmUrl || `/${file}`,
      });
    }
    this.resetDatabase();
  }

  isReady(): boolean {
    return this.db !== null;
  }

  resetDatabase(): void {
    if (!this.SQL) {
      throw new Error('SQLite WASM engine is not initialized yet.');
    }
    if (this.db) {
      this.db.close();
    }
    this.db = new this.SQL.Database();
    this.db.run(INITIAL_SCHEMA_AND_SEED_SQL);
  }

  private detectStatementType(
    trimmedSql: string
  ): QueryExecutionResult['statementType'] {
    const clean = trimmedSql
      .replace(/--.*$/gm, '')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .trim()
      .toUpperCase();
    if (clean.startsWith('SELECT') || clean.startsWith('WITH')) return 'SELECT';
    if (clean.startsWith('INSERT')) return 'INSERT';
    if (clean.startsWith('UPDATE')) return 'UPDATE';
    if (clean.startsWith('DELETE')) return 'DELETE';
    if (clean.startsWith('CREATE')) return 'CREATE';
    if (clean.startsWith('PRAGMA')) return 'PRAGMA';
    return 'OTHER';
  }

  private checkSafetyPolicy(sql: string, lang: SupportedLanguage = 'de'): { allowed: boolean; reason?: string } {
    const clean = sql
      .replace(/--.*$/gm, '')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .trim();

    if (!clean) {
      return { allowed: false, reason: 'EMPTY' };
    }

    const t = SQL_ENGINE_MESSAGES[lang] || SQL_ENGINE_MESSAGES.de;

    // Prevent dropping core investigation tables
    const dropMatch = clean.match(/\bDROP\s+TABLE\s+(?:IF\s+EXISTS\s+)?([a-zA-Z0-9_]+)/i);
    if (dropMatch) {
      const targetTable = dropMatch[1].toLowerCase();
      if (CORE_PROTECTED_TABLES.includes(targetTable)) {
        return {
          allowed: false,
          reason: t.dropProtectedTable(dropMatch[1]),
        };
      }
    }

    if (/\bATTACH\s+DATABASE\b/i.test(clean)) {
      return {
        allowed: false,
        reason: t.attachBlocked,
      };
    }

    return { allowed: true };
  }

  executeQuery(query: string, lang: SupportedLanguage = 'de'): QueryExecutionResult {
    const startTime = performance.now();
    const t = SQL_ENGINE_MESSAGES[lang] || SQL_ENGINE_MESSAGES.de;

    if (!this.db) {
      return {
        success: false,
        query,
        columns: [],
        rows: [],
        rowsModified: 0,
        executionTimeMs: 0,
        statementType: 'OTHER',
        diagnosis: {
          rawError: 'Database not initialized',
          errorCode: 'UNKNOWN',
          friendlyTitle: t.dbNotInitTitle,
          explanation: t.dbNotInitExp,
          suggestion: t.dbNotInitSug,
        },
      };
    }

    const safety = this.checkSafetyPolicy(query, lang);
    if (!safety.allowed) {
      if (safety.reason === 'EMPTY') {
        return {
          success: false,
          query,
          columns: [],
          rows: [],
          rowsModified: 0,
          executionTimeMs: 0,
          statementType: 'OTHER',
          diagnosis: {
            rawError: 'Empty SQL query',
            errorCode: 'EMPTY_QUERY',
            friendlyTitle: t.emptyQueryTitle,
            explanation: t.emptyQueryExp,
            suggestion: t.emptyQuerySug,
          },
        };
      }
      return {
        success: false,
        query,
        columns: [],
        rows: [],
        rowsModified: 0,
        executionTimeMs: 0,
        statementType: 'OTHER',
        diagnosis: {
          rawError: safety.reason || 'Blocked by safety policy',
          errorCode: 'SECURITY_BLOCKED',
          friendlyTitle: t.securityBlockedTitle,
          explanation: safety.reason || 'Blocked by security policy',
          suggestion: t.securityBlockedSug,
        },
      };
    }

    const statementType = this.detectStatementType(query);

    try {
      this.db.run('PRAGMA foreign_keys = ON;');
      const results = this.db.exec(query);
      const rowsModified = this.db.getRowsModified();
      const executionTimeMs = Number((performance.now() - startTime).toFixed(2));

      if (results.length > 0) {
        const lastResult = results[results.length - 1];
        return {
          success: true,
          query,
          columns: lastResult.columns,
          rows: lastResult.values as (string | number | null)[][],
          rowsModified,
          executionTimeMs,
          statementType,
        };
      }

      // DML or DDL statements that return no rows
      let notice = t.dmlNotice(statementType, rowsModified);
      if (statementType === 'INSERT') {
        notice = t.dmlInsert(rowsModified);
      } else if (statementType === 'UPDATE') {
        notice = t.dmlUpdate(rowsModified);
      } else if (statementType === 'DELETE') {
        notice = t.dmlDelete(rowsModified);
      } else if (statementType === 'CREATE') {
        notice = t.dmlCreate;
      }

      return {
        success: true,
        query,
        columns: [t.statusCol, t.rowsAffectedCol],
        rows: [[notice, rowsModified]],
        rowsModified,
        executionTimeMs,
        statementType,
        notice,
      };
    } catch (err: unknown) {
      const executionTimeMs = Number((performance.now() - startTime).toFixed(2));
      const rawMessage = err instanceof Error ? err.message : String(err);
      return {
        success: false,
        query,
        columns: [],
        rows: [],
        rowsModified: 0,
        executionTimeMs,
        statementType,
        diagnosis: diagnoseSqlError(rawMessage, query, lang),
      };
    }
  }

  getAllTableSchemas(): TableSchemaInfo[] {
    if (!this.db) return [];

    const tablesRes = this.db.exec(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY rowid ASC;"
    );
    if (tablesRes.length === 0) return [];

    const tableNames = tablesRes[0].values.map((row) => String(row[0]));

    return tableNames.map((tableName) => {
      const colRes = this.db!.exec(`PRAGMA table_info("${tableName}");`);
      const columns: ColumnInfo[] =
        colRes.length > 0
          ? colRes[0].values.map((r) => ({
              cid: Number(r[0]),
              name: String(r[1]),
              type: String(r[2]),
              notnull: Number(r[3]),
              dflt_value: r[4] !== null ? String(r[4]) : null,
              pk: Number(r[5]),
            }))
          : [];

      const fkRes = this.db!.exec(`PRAGMA foreign_key_list("${tableName}");`);
      const foreignKeys: ForeignKeyInfo[] =
        fkRes.length > 0
          ? fkRes[0].values.map((r) => ({
              id: Number(r[0]),
              seq: Number(r[1]),
              table: String(r[2]),
              from: String(r[3]),
              to: String(r[4]),
            }))
          : [];

      let rowCount = 0;
      try {
        const countRes = this.db!.exec(`SELECT COUNT(*) FROM "${tableName}";`);
        if (countRes.length > 0 && countRes[0].values.length > 0) {
          rowCount = Number(countRes[0].values[0][0]);
        }
      } catch {
        rowCount = 0;
      }

      return {
        tableName,
        description:
          TABLE_DESCRIPTIONS[tableName] || tableName,
        rowCount,
        columns,
        foreignKeys,
      };
    });
  }
}

export const sqlEngine = new SqlEngine();

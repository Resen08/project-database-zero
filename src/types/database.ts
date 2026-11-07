export interface ColumnInfo {
  cid: number;
  name: string;
  type: string;
  notnull: number;
  dflt_value: string | null;
  pk: number;
}

export interface ForeignKeyInfo {
  id: number;
  seq: number;
  table: string;
  from: string;
  to: string;
}

export interface TableSchemaInfo {
  tableName: string;
  description: string;
  rowCount: number;
  columns: ColumnInfo[];
  foreignKeys: ForeignKeyInfo[];
}

export interface QueryDiagnosis {
  rawError: string;
  friendlyTitle: string;
  explanation: string;
  suggestion: string;
  errorCode: 'SYNTAX' | 'NO_SUCH_TABLE' | 'NO_SUCH_COLUMN' | 'AMBIGUOUS_COLUMN' | 'FOREIGN_KEY' | 'UNIQUE_CONSTRAINT' | 'SECURITY_BLOCKED' | 'EMPTY_QUERY' | 'UNKNOWN';
}

export interface QueryExecutionResult {
  success: boolean;
  query: string;
  columns: string[];
  rows: (string | number | null)[][];
  rowsModified: number;
  executionTimeMs: number;
  statementType: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE' | 'CREATE' | 'PRAGMA' | 'OTHER';
  diagnosis?: QueryDiagnosis;
  notice?: string;
}

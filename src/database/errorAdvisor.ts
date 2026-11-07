import { QueryDiagnosis } from '../types/database';
import { SQL_ERROR_TEMPLATES, SupportedLanguage } from '../services/i18n';

const KNOWN_TABLES = [
  'Organizations',
  'Locations',
  'Citizens',
  'Transactions',
  'SecurityLogs',
  'Missions',
  'Evidence',
  'AuditTrail',
];

export function diagnoseSqlError(
  rawError: string,
  query: string,
  lang: SupportedLanguage = 'de'
): QueryDiagnosis {
  const msg = rawError.trim();
  const lower = msg.toLowerCase();
  const templates = SQL_ERROR_TEMPLATES[lang] || SQL_ERROR_TEMPLATES.de;

  // 1. No such table
  if (lower.includes('no such table')) {
    const match = msg.match(/no such table:\s*([^\s]+)/i);
    const wrongTable = match ? match[1] : (lang === 'de' ? 'Tabelle' : 'table');
    const available = KNOWN_TABLES.slice(0, 7).join(', ');
    const t = templates.noSuchTable(wrongTable, available);
    return {
      rawError: msg,
      errorCode: 'NO_SUCH_TABLE',
      friendlyTitle: t.title,
      explanation: t.exp,
      suggestion: t.sug,
    };
  }

  // 2. No such column
  if (lower.includes('no such column')) {
    const match = msg.match(/no such column:\s*([^\s]+)/i);
    const wrongCol = match ? match[1] : (lang === 'de' ? 'Spalte' : 'column');
    const hint = query.includes('"') ? 'quote_hint' : '';
    const t = templates.noSuchColumn(wrongCol, hint);
    return {
      rawError: msg,
      errorCode: 'NO_SUCH_COLUMN',
      friendlyTitle: t.title,
      explanation: t.exp,
      suggestion: t.sug,
    };
  }

  // 3. Ambiguous column name (common in JOIN)
  if (lower.includes('ambiguous column name')) {
    const match = msg.match(/ambiguous column name:\s*([^\s]+)/i);
    const col = match ? match[1] : (lang === 'de' ? 'Spalte' : 'column');
    const t = templates.ambiguousColumn(col);
    return {
      rawError: msg,
      errorCode: 'AMBIGUOUS_COLUMN',
      friendlyTitle: t.title,
      explanation: t.exp,
      suggestion: t.sug,
    };
  }

  // 4. Foreign key constraint failed
  if (lower.includes('foreign key constraint failed')) {
    const t = templates.foreignKey;
    return {
      rawError: msg,
      errorCode: 'FOREIGN_KEY',
      friendlyTitle: t.title,
      explanation: t.exp,
      suggestion: t.sug,
    };
  }

  // 5. Unique / Primary Key constraint failed
  if (lower.includes('unique constraint failed') || lower.includes('primary key must be unique')) {
    const t = templates.uniqueConstraint;
    return {
      rawError: msg,
      errorCode: 'UNIQUE_CONSTRAINT',
      friendlyTitle: t.title,
      explanation: t.exp,
      suggestion: t.sug,
    };
  }

  // 6. Misuse of aggregate
  if (lower.includes('misuse of aggregate')) {
    const t = templates.misuseAggregate;
    return {
      rawError: msg,
      errorCode: 'SYNTAX',
      friendlyTitle: t.title,
      explanation: t.exp,
      suggestion: t.sug,
    };
  }

  // 7. Syntax error near ...
  if (lower.includes('syntax error') || lower.includes('incomplete input')) {
    const nearMatch = msg.match(/near "([^"]+)"/i);
    const nearToken = nearMatch ? nearMatch[1] : (lang === 'de' ? 'Befehlsende' : '구문 끝');
    const t = templates.syntaxError(nearToken);
    return {
      rawError: msg,
      errorCode: 'SYNTAX',
      friendlyTitle: t.title,
      explanation: t.exp,
      suggestion: t.sug,
    };
  }

  const t = templates.unknown(msg);
  return {
    rawError: msg,
    errorCode: 'UNKNOWN',
    friendlyTitle: t.title,
    explanation: t.exp,
    suggestion: t.sug,
  };
}

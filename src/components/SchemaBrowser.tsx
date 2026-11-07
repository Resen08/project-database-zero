import React, { useEffect, useState } from 'react';
import {
  Database,
  Eye,
  KeyRound,
  Link2,
  Plus,
  Sparkles,
  Table,
} from 'lucide-react';
import { TableSchemaInfo } from '../types/database';
import {
  SupportedLanguage,
  TABLE_DESCRIPTIONS_I18N,
  UI_TRANSLATIONS,
} from '../services/i18n';

interface SchemaBrowserProps {
  schemas: TableSchemaInfo[];
  targetTables: string[];
  language?: SupportedLanguage;
  onPreviewTable: (tableName: string) => void;
  onInsertIdentifier: (identifier: string) => void;
}

export const SchemaBrowser: React.FC<SchemaBrowserProps> = ({
  schemas,
  targetTables,
  language = 'de',
  onPreviewTable,
  onInsertIdentifier,
}) => {
  const [selectedTableName, setSelectedTableName] = useState<string>(
    targetTables[0] || 'Citizens'
  );
  const t = UI_TRANSLATIONS[language];
  const tableDescriptions = TABLE_DESCRIPTIONS_I18N[language] || TABLE_DESCRIPTIONS_I18N.de;

  // 미션 변경 시 핵심 타겟 테이블을 자동으로 첫 선택
  useEffect(() => {
    if (targetTables.length > 0) {
      setSelectedTableName(targetTables[0]);
    }
  }, [targetTables]);

  const activeTable =
    schemas.find((s) => s.tableName === selectedTableName) || schemas[0];

  const fkMap = new Map(
    activeTable
      ? activeTable.foreignKeys.map((fk) => [fk.from, `${fk.table}(${fk.to})`])
      : []
  );

  return (
    <section
      className="panel schema-vertical-panel"
      aria-label="DB Schema Browser"
    >
      {/* 상단 패널 헤더 */}
      <div className="panel-header schema-v-header">
        <div className="schema-dock-title">
          <Database size={16} className="text-cyan" />
          <span className="panel-title">{t.schemaBrowserTitle}</span>
        </div>

        {activeTable && (
          <button
            type="button"
            className="cyber-btn cyber-btn-primary cyber-btn-xs"
            onClick={() => onPreviewTable(activeTable.tableName)}
            title={t.previewInResultBtn}
          >
            <Eye size={13} />
            <span>{activeTable.tableName} {t.previewInResultBtn}</span>
          </button>
        )}
      </div>

      {/* 7개 테이블 선택 탭 바 */}
      <div
        className="schema-tabs-strip"
        role="tablist"
        aria-label="Database Tables"
      >
        {schemas.map((table) => {
          const isSelected = table.tableName === activeTable?.tableName;
          const isTarget = targetTables.includes(table.tableName);

          return (
            <button
              key={table.tableName}
              type="button"
              role="tab"
              aria-selected={isSelected}
              className={`schema-tab-pill ${isSelected ? 'active' : ''} ${
                isTarget ? 'is-target' : ''
              }`}
              onClick={() => setSelectedTableName(table.tableName)}
            >
              <Table size={12} className="schema-tab-icon" />
              <strong className="schema-tab-name">{table.tableName}</strong>
              <span className="schema-tab-count">{table.rowCount}</span>
              {isTarget && (
                <span className="schema-target-badge" title={t.targetTableBadge}>
                  <Sparkles size={9} /> {t.targetTableBadge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 세로형 스크롤 바디: 선택된 테이블 설명 + 세로 컬럼 명세 표 */}
      {activeTable && (
        <div className="panel-body scrollable-y schema-v-body">
          <div className="schema-v-meta-box">
            <div className="schema-v-meta-left">
              <strong className="text-cyan">{activeTable.tableName}</strong>
              <span className="schema-v-row-pill">
                {t.totalRowsLabel} {activeTable.rowCount} {t.rowsUnit}
              </span>
              <p className="schema-v-desc">
                {tableDescriptions[activeTable.tableName] || activeTable.description}
              </p>
            </div>
            <button
              type="button"
              className="schema-insert-table-btn"
              onClick={() => onInsertIdentifier(activeTable.tableName)}
              title={t.insertTableTitle}
            >
              <Plus size={12} /> {t.insertTableName}
            </button>
          </div>

          <div className="schema-v-table-wrap">
            <table className="schema-spec-table">
              <thead>
                <tr>
                  <th scope="col">{t.colName}</th>
                  <th scope="col">{t.colType}</th>
                  <th scope="col">{t.colKeyRelation}</th>
                </tr>
              </thead>
              <tbody>
                {activeTable.columns.map((col) => {
                  const fkTarget = fkMap.get(col.name);
                  const isPk = col.pk > 0;
                  return (
                    <tr
                      key={col.cid}
                      className={isPk ? 'row-pk' : fkTarget ? 'row-fk' : ''}
                      onClick={() => onInsertIdentifier(col.name)}
                      title={`'${col.name}' ${t.insertColTitle}`}
                    >
                      <td className="spec-col-name">
                        <span className="spec-col-identifier">{col.name}</span>
                        <span className="spec-insert-hint">+ {t.colInsertHint}</span>
                      </td>
                      <td className="spec-col-type">
                        <span className="schema-col-type">{col.type}</span>
                      </td>
                      <td className="spec-col-key">
                        {isPk && (
                          <span className="pk-badge">
                            <KeyRound size={10} /> PK
                          </span>
                        )}
                        {fkTarget && (
                          <span className="fk-badge">
                            <Link2 size={10} /> FK → {fkTarget}
                          </span>
                        )}
                        {!isPk && !fkTarget && (
                          <span className="spec-normal-col">
                            {t.normalColTag}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
};

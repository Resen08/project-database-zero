import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import {
  Code2,
  Eraser,
  Play,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { SupportedLanguage, UI_TRANSLATIONS } from '../services/i18n';

interface SqlEditorPanelProps {
  query: string;
  fontSize: number;
  language?: SupportedLanguage;
  onChangeQuery: (val: string) => void;
  onExecuteQuery: () => void;
  onResetStarterQuery: () => void;
}

const SQL_SNIPPETS = [
  { label: 'SELECT *', snippet: 'SELECT * FROM ' },
  { label: 'WHERE', snippet: "WHERE status = 'MISSING'" },
  { label: 'ORDER BY', snippet: 'ORDER BY threat_score DESC LIMIT 3' },
  { label: 'GROUP BY', snippet: 'GROUP BY sender_id' },
  { label: 'JOIN', snippet: 'JOIN Citizens c ON s.citizen_id = c.citizen_id' },
  { label: 'UPDATE', snippet: "UPDATE Citizens SET status = 'SUSPECT' WHERE citizen_id = 1004;" },
];

export const SqlEditorPanel: React.FC<SqlEditorPanelProps> = ({
  query,
  fontSize,
  language = 'de',
  onChangeQuery,
  onExecuteQuery,
  onResetStarterQuery,
}) => {
  const [useSimpleEditor, setUseSimpleEditor] = useState(false);
  const t = UI_TRANSLATIONS[language];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      onExecuteQuery();
      return;
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const next = query.substring(0, start) + '  ' + query.substring(end);
      onChangeQuery(next);
      requestAnimationFrame(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      });
    }
  };

  const insertSnippet = (snippet: string) => {
    const trimmed = query.trimEnd();
    const next = trimmed ? `${trimmed}\n${snippet}` : snippet;
    onChangeQuery(next);
  };

  return (
    <section className="panel sql-editor-panel" aria-label="SQL Editor">
      <div className="panel-header editor-toolbar">
        <div className="editor-title-group">
          <Code2 size={16} className="text-cyan" />
          <span className="panel-title">SQL TERMINAL // SQLite 3.x</span>
          <span className="shortcut-hint">{t.shortcutRunHint}</span>
        </div>

        <div className="editor-actions-group">
          <button
            type="button"
            className="cyber-btn cyber-btn-ghost cyber-btn-xs"
            onClick={() => setUseSimpleEditor((v) => !v)}
            title="Monaco / Light Editor Toggle"
          >
            <Sparkles size={13} />
            <span>{useSimpleEditor ? t.monacoMode : t.lightMode}</span>
          </button>

          <button
            type="button"
            className="cyber-btn cyber-btn-ghost cyber-btn-xs"
            onClick={onResetStarterQuery}
            title={t.resetStarterQuery}
          >
            <RotateCcw size={13} />
            <span>{t.resetStarterQuery}</span>
          </button>

          <button
            type="button"
            className="cyber-btn cyber-btn-ghost cyber-btn-xs"
            onClick={() => onChangeQuery('')}
            title={t.clearEditor}
          >
            <Eraser size={13} />
            <span>{t.clearEditor}</span>
          </button>

          <button
            type="button"
            className="cyber-btn cyber-btn-primary cyber-btn-sm run-query-btn"
            onClick={onExecuteQuery}
          >
            <Play size={15} />
            <span>{t.runQuery}</span>
          </button>
        </div>
      </div>

      {/* 빠른 SQL 키워드 조각 바 */}
      <div className="sql-snippet-bar" aria-label="Schnell-Syntax">
        <span className="snippet-bar-label">{t.quickSyntax}</span>
        {SQL_SNIPPETS.map((item) => (
          <button
            key={item.label}
            type="button"
            className="snippet-chip"
            onClick={() => insertSnippet(item.snippet)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="editor-canvas-wrap">
        {!useSimpleEditor ? (
          <Editor
            height="100%"
            defaultLanguage="sql"
            theme="vs-dark"
            value={query}
            onChange={(val) => onChangeQuery(val ?? '')}
            options={{
              fontSize,
              fontFamily: "'JetBrains Mono', monospace",
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              automaticLayout: true,
              tabSize: 2,
              padding: { top: 12, bottom: 12 },
              lineNumbersMinChars: 3,
            }}
            onMount={(editor, monaco) => {
              editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
                onExecuteQuery();
              });
            }}
            loading={
              <textarea
                className="fallback-sql-textarea"
                style={{ fontSize: `${fontSize}px` }}
                value={query}
                onChange={(e) => onChangeQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                spellCheck={false}
                aria-label={t.sqlEditorAria}
              />
            }
          />
        ) : (
          <textarea
            className="fallback-sql-textarea"
            style={{ fontSize: `${fontSize}px` }}
            value={query}
            onChange={(e) => onChangeQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t.sqlEditorPlaceholder}
            spellCheck={false}
            aria-label={t.sqlEditorAria}
          />
        )}
      </div>
    </section>
  );
};

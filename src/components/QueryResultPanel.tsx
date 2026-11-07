import React, { useId } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Table2,
  TerminalSquare,
  Wrench,
} from 'lucide-react';
import { QueryExecutionResult } from '../types/database';
import {
  SupportedLanguage,
  UI_TRANSLATIONS,
  translateDatabaseCell,
} from '../services/i18n';

interface QueryResultPanelProps {
  result: QueryExecutionResult | null;
  language?: SupportedLanguage;
  missionValidation: {
    passed: boolean;
    feedback: string;
    rewardXp?: number;
    hasNextMission?: boolean;
  } | null;
  onProceedNextMission: () => void;
}

const DANGER_BADGE_VALUES = new Set([
  'MISSING',
  'DENIED',
  'BREACH',
  'CRITICAL',
  'HIGH',
  'FROZEN',
  'BLACKLISTED',
  'ILLEGAL',
]);

const WARNING_BADGE_VALUES = new Set([
  'SUSPECT',
  'WARNING',
  'LOCKED',
  'PENDING',
  'IN_PROGRESS',
  'MEDIUM',
  'UNVERIFIED',
]);

const SUCCESS_BADGE_VALUES = new Set([
  'ACTIVE',
  'GRANTED',
  'COMPLETED',
  'VERIFIED',
  'NORMAL',
  'LOW',
  'CLEARED',
]);

function renderCellContent(
  cell: string | number | null,
  columnName = '',
  language: SupportedLanguage = 'de'
): React.ReactNode {
  if (cell === null || cell === undefined) {
    return <span className="null-badge">NULL</span>;
  }

  if (typeof cell === 'number') {
    return <span className="cell-number">{cell.toLocaleString()}</span>;
  }

  const localizedValue = translateDatabaseCell(cell, columnName, language);
  const str = String(localizedValue !== null ? localizedValue : cell);
  const upper = str.trim().toUpperCase();

  if (DANGER_BADGE_VALUES.has(upper)) {
    return <span className="cell-status-pill danger">{str}</span>;
  }
  if (WARNING_BADGE_VALUES.has(upper)) {
    return <span className="cell-status-pill warning">{str}</span>;
  }
  if (SUCCESS_BADGE_VALUES.has(upper)) {
    return <span className="cell-status-pill success">{str}</span>;
  }

  return str;
}

export const QueryResultPanel: React.FC<QueryResultPanelProps> = ({
  result,
  language = 'de',
  missionValidation,
  onProceedNextMission,
}) => {
  const captionId = useId();
  const t = UI_TRANSLATIONS[language];

  return (
    <section className="panel result-panel" aria-label="Query Output Panel">
      <div className="panel-header result-header">
        <div className="result-title-group">
          <Table2 size={16} className="text-cyan" />
          <span className="panel-title">{t.queryResultTitle}</span>
        </div>

        {result && (
          <div className="result-stats-group">
            {result.success ? (
              <span className="status-dot ok">
                <strong>{result.rows.length}</strong> {t.queryRows} ·{' '}
                <strong>{result.columns.length}</strong> {t.queryCols}
              </span>
            ) : (
              <span className="status-dot err">{t.queryError}</span>
            )}
            <span className="stat-badge">
              <Clock size={12} /> {result.executionTimeMs} ms
            </span>
          </div>
        )}
      </div>

      {/* 미션 판정 피드백 배너 */}
      {missionValidation && (
        <div
          className={`mission-judge-banner ${
            missionValidation.passed ? 'passed' : 'pending'
          }`}
          role="status"
          aria-live="polite"
        >
          <div className="judge-banner-left">
            {missionValidation.passed ? (
              <CheckCircle2 size={20} className="judge-icon-pass" />
            ) : (
              <TerminalSquare size={20} className="judge-icon-pending" />
            )}
            <div className="judge-text-wrap">
              <strong>
                {missionValidation.passed
                  ? t.missionCompletedBadge
                  : t.validationReviewPrompt}
              </strong>
              <span>{missionValidation.feedback}</span>
            </div>
          </div>

          {missionValidation.passed && missionValidation.hasNextMission && (
            <button
              type="button"
              className="cyber-btn cyber-btn-primary cyber-btn-sm"
              onClick={onProceedNextMission}
            >
              <span>{t.nextMissionBtn}</span>
              <ArrowRight size={15} />
            </button>
          )}
        </div>
      )}

      <div className="panel-body result-body">
        {!result ? (
          <div className="empty-result-state">
            <TerminalSquare size={34} className="text-cyan" />
            <p className="empty-result-title">
              {t.emptyResultNotice}
            </p>
            <p className="empty-result-sub">
              {t.emptyResultSub}
            </p>
          </div>
        ) : !result.success && result.diagnosis ? (
          <div className="error-diagnosis-card" role="alert">
            <div className="error-card-header">
              <AlertTriangle size={22} className="text-danger" />
              <div>
                <span className="error-code-pill">
                  {t.sqlDiagnosisLabel} // {result.diagnosis.errorCode}
                </span>
                <h3 className="error-friendly-title">
                  {result.diagnosis.friendlyTitle}
                </h3>
              </div>
            </div>

            <p className="error-explanation">{result.diagnosis.explanation}</p>

            <div className="error-suggestion-box">
              <Wrench size={17} className="text-cyan" />
              <div>
                <strong>{t.solutionGuideLabel}</strong>
                <p>{result.diagnosis.suggestion}</p>
              </div>
            </div>

            <details className="raw-error-details">
              <summary>{t.showRawErrorLabel}</summary>
              <code>{result.diagnosis.rawError}</code>
            </details>
          </div>
        ) : result.rows.length === 0 ? (
          <div className="empty-result-state">
            <p className="empty-result-title">
              {t.emptyZeroRowsNotice}
            </p>
            <p className="empty-result-sub">
              {t.emptyZeroRowsTip}
            </p>
          </div>
        ) : (
          <div
            tabIndex={0}
            role="region"
            aria-labelledby={captionId}
            className="table-wrapper sql-grid-scroll"
          >
            <table className="sql-data-grid">
              <caption id={captionId} className="sr-only">
                {t.queryResultCaptionPrefix}{result.rows.length}{t.queryResultCaptionSuffix}
              </caption>
              <thead>
                <tr>
                  <th scope="col" className="col-row-index">
                    #
                  </th>
                  {result.columns.map((col, idx) => (
                    <th key={idx} scope="col">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.rows.map((row, rIdx) => (
                  <tr key={rIdx}>
                    <td className="cell-row-index">{rIdx + 1}</td>
                    {row.map((cell, cIdx) => {
                      const isLongText =
                        typeof cell === 'string' && cell.length > 34;
                      const colName = result.columns[cIdx] || '';
                      return (
                        <td
                          key={cIdx}
                          className={
                            isLongText
                              ? 'cell-wrap-text'
                              : typeof cell === 'number'
                              ? 'cell-align-num'
                              : 'cell-standard'
                          }
                        >
                          {renderCellContent(cell, colName, language)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};

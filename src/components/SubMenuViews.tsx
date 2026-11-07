import React from 'react';
import {
  Award,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Database,
  FileSearch,
  KeyRound,
  Link2,
  Lock,
  Terminal,
  Trophy,
} from 'lucide-react';
import { TableSchemaInfo } from '../types/database';
import { SaveState } from '../types/game';
import { CURRICULUM_MISSIONS } from '../data/curriculumMissions';
import {
  ACHIEVEMENTS_I18N,
  SupportedLanguage,
  TABLE_DESCRIPTIONS_I18N,
  UI_TRANSLATIONS,
  getEvidenceI18n,
} from '../services/i18n';

interface EvidenceRow {
  evidence_id: number;
  evidence_code: string;
  title: string;
  category: string;
  summary: string;
  is_unlocked: number;
}

interface SubMenuViewsProps {
  mode: 'codex' | 'stats' | 'achievements';
  saveState: SaveState;
  schemas: TableSchemaInfo[];
  evidenceRows: EvidenceRow[];
  language?: SupportedLanguage;
  onJumpToConsoleWithQuery: (sql: string) => void;
}

export const SubMenuViews: React.FC<SubMenuViewsProps> = ({
  mode,
  saveState,
  schemas,
  evidenceRows,
  language = 'de',
  onJumpToConsoleWithQuery,
}) => {
  const t = UI_TRANSLATIONS[language];
  const tableDescriptions = TABLE_DESCRIPTIONS_I18N[language] || TABLE_DESCRIPTIONS_I18N.de;
  const achievements = ACHIEVEMENTS_I18N[language] || ACHIEVEMENTS_I18N.de;

  if (mode === 'codex') {
    return (
      <main className="subview-container">
        <div className="subview-inner">
          <header className="subview-header">
            <div className="stages-header-left">
              <BookOpen size={22} className="text-cyan" />
              <h2>{t.codexTitle}</h2>
            </div>
            <p className="stages-header-right">{t.codexSub}</p>
          </header>

          <section className="subview-section">
            <h3 className="subview-section-title">
              <FileSearch size={18} className="text-cyan" /> {t.evidenceArchiveTitle}
            </h3>
            <div className="codex-evidence-grid">
              {evidenceRows.length === 0 ? (
                <div className="codex-card">
                  <p className="codex-card-desc">{t.noEvidenceYet}</p>
                </div>
              ) : (
                evidenceRows.map((ev) => {
                  const unlocked =
                    ev.is_unlocked === 1 ||
                    saveState.unlockedEvidenceCodes.includes(ev.evidence_code);
                  const evI18n = getEvidenceI18n(ev.evidence_code, language);
                  return (
                    <article
                      key={ev.evidence_id}
                      className={`codex-card ${unlocked ? 'unlocked' : 'locked'}`}
                    >
                      <div className="codex-card-top">
                        <span className="stage-num-label">{ev.evidence_code}</span>
                        <span className="stage-concept-pill">{ev.category}</span>
                      </div>
                      <strong className="codex-card-title">
                        {unlocked ? evI18n.title : t.evidenceEncryptedTitle}
                      </strong>
                      <p className="codex-card-desc">
                        {unlocked ? evI18n.summary : t.evidenceEncryptedDesc}
                      </p>
                    </article>
                  );
                })
              )}
            </div>
          </section>

          <section className="subview-section">
            <h3 className="subview-section-title">
              <Database size={18} className="text-cyan" /> {t.schemaOverviewTitle} ({schemas.length} Tables)
            </h3>
            <div className="codex-schema-grid">
              {schemas.map((tb) => (
                <article key={tb.tableName} className="codex-card unlocked">
                  <div className="codex-card-top">
                    <strong className="codex-table-name">{tb.tableName}</strong>
                    <span className="row-count-pill">{tb.rowCount} Rows</span>
                  </div>
                  <p className="codex-card-desc">
                    {tableDescriptions[tb.tableName] || tb.description}
                  </p>
                  <div className="codex-cols-wrap">
                    {tb.columns.map((c) => (
                      <span key={c.cid} className="codex-col-pill">
                        {c.pk > 0 && <KeyRound size={11} className="text-amber" />}
                        {tb.foreignKeys.some((f) => f.from === c.name) && (
                          <Link2 size={11} className="text-cyan" />
                        )}
                        <strong>{c.name}</strong>
                        <small>{c.type}</small>
                      </span>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="cyber-btn cyber-btn-secondary cyber-btn-xs"
                    onClick={() =>
                      onJumpToConsoleWithQuery(`SELECT * FROM ${tb.tableName} LIMIT 20;`)
                    }
                  >
                    <Terminal size={13} />
                    <span>
                      {tb.tableName} {t.queryTableInConsole}
                    </span>
                  </button>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>
    );
  }

  if (mode === 'stats') {
    const completedCount = saveState.completedMissionIds.length;
    const totalCount = CURRICULUM_MISSIONS.length;
    const completionRate = Math.round((completedCount / totalCount) * 100);

    return (
      <main className="subview-container">
        <div className="subview-inner">
          <header className="subview-header">
            <div className="stages-header-left">
              <BarChart3 size={22} className="text-cyan" />
              <h2>{t.statsTitle}</h2>
            </div>
            <p className="stages-header-right">{t.statsSub}</p>
          </header>

          <div className="stats-kpi-grid">
            <div className="kpi-card">
              <span className="kpi-label">{t.statCompletionRate}</span>
              <strong className="kpi-value text-cyan">{completionRate}%</strong>
              <span className="kpi-sub">
                {completedCount} {t.statStagesCompletedUnit}
              </span>
            </div>
            <div className="kpi-card">
              <span className="kpi-label">{t.statTotalXp}</span>
              <strong className="kpi-value text-amber">
                {saveState.xp.toLocaleString()} XP
              </strong>
              <span className="kpi-sub">{t.statMaxXpAvailable}</span>
            </div>
            <div className="kpi-card">
              <span className="kpi-label">{t.statObjectsScanned}</span>
              <strong className="kpi-value text-emerald">
                {saveState.inspectedObjectIds.length} / 6
              </strong>
              <span className="kpi-sub">{t.statObjectsDesc}</span>
            </div>
            <div className="kpi-card">
              <span className="kpi-label">{t.statEvidenceUnlocked}</span>
              <strong className="kpi-value">
                {saveState.unlockedEvidenceCodes.length} / 5
              </strong>
              <span className="kpi-sub">{t.statEvidenceDesc}</span>
            </div>
          </div>

          <section className="subview-section">
            <h3 className="subview-section-title">
              <Terminal size={18} className="text-cyan" /> {t.queryHistoryTitle} ({saveState.queryHistory.length})
            </h3>
            {saveState.queryHistory.length === 0 ? (
              <div className="codex-card">
                <p className="codex-card-desc">{t.queryHistoryEmpty}</p>
              </div>
            ) : (
              <div className="query-history-list">
                {saveState.queryHistory.map((item, idx) => (
                  <div key={idx} className="query-history-row">
                    <code>{item.query}</code>
                    <button
                      type="button"
                      className="cyber-btn cyber-btn-ghost cyber-btn-xs"
                      onClick={() => onJumpToConsoleWithQuery(item.query)}
                    >
                      {t.loadIntoConsole}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="subview-container">
      <div className="subview-inner">
        <header className="subview-header">
          <div className="stages-header-left">
            <Trophy size={22} className="text-amber" />
            <h2>{t.achievementsTitle}</h2>
          </div>
          <p className="stages-header-right">{t.achievementsSub}</p>
        </header>

        <div className="achievements-grid">
          {achievements.map((ach) => {
            let unlocked = false;
            if (ach.id === 'ach-first-query') {
              unlocked = saveState.completedMissionIds.length >= 1 || saveState.queryHistory.length >= 1;
            } else if (ach.id === 'ach-ch1-clear') {
              unlocked = [1, 2, 3].every((id) => saveState.completedMissionIds.includes(id));
            } else if (ach.id === 'ach-ch2-clear') {
              unlocked = [4, 5, 6, 7].every((id) => saveState.completedMissionIds.includes(id));
            } else if (ach.id === 'ach-field-detective') {
              unlocked = saveState.inspectedObjectIds.length >= 3;
            } else if (ach.id === 'ach-master-architect') {
              unlocked = saveState.completedMissionIds.length >= 10;
            }

            return (
              <article
                key={ach.id}
                className={`codex-card ${unlocked ? 'unlocked' : 'locked'}`}
              >
                <div className="codex-card-top">
                  <span className="stage-concept-pill">{ach.rewardBadge}</span>
                  {unlocked ? (
                    <span className="stage-status-chip completed">
                      <CheckCircle2 size={14} /> {t.statusCompleted}
                    </span>
                  ) : (
                    <span className="stage-status-chip locked">
                      <Lock size={13} /> {t.statusLocked}
                    </span>
                  )}
                </div>
                <strong className="codex-card-title">
                  <Award
                    size={16}
                    className={unlocked ? 'text-amber' : 'text-muted'}
                    style={{ marginRight: 6, verticalAlign: 'text-bottom' }}
                  />
                  {ach.title}
                </strong>
                <p className="codex-card-desc">{ach.desc}</p>
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
};

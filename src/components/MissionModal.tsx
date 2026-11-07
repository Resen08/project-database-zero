import React, { useEffect, useId, useRef, useState } from 'react';
import {
  Award,
  CheckCircle2,
  FileSearch,
  Lock,
  Play,
  X,
} from 'lucide-react';
import { CHAPTERS_DATA } from '../data/chaptersData';
import { CURRICULUM_MISSIONS } from '../data/curriculumMissions';
import {
  SupportedLanguage,
  UI_TRANSLATIONS,
  getChapterI18n,
  getEvidenceI18n,
  getMissionI18n,
} from '../services/i18n';

interface EvidenceRow {
  evidence_id: number;
  evidence_code: string;
  title: string;
  category: string;
  summary: string;
  is_unlocked: number;
}

interface MissionModalProps {
  isOpen: boolean;
  currentMissionId: number;
  completedMissionIds: number[];
  unlockedEvidenceCodes: string[];
  evidenceRows: EvidenceRow[];
  language?: SupportedLanguage;
  onSelectMission: (missionId: number) => void;
  onClose: () => void;
}

export const MissionModal: React.FC<MissionModalProps> = ({
  isOpen,
  currentMissionId,
  completedMissionIds,
  unlockedEvidenceCodes,
  evidenceRows,
  language = 'de',
  onSelectMission,
  onClose,
}) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const titleId = useId();
  const [tab, setTab] = useState<'missions' | 'evidence'>('missions');
  const t = UI_TRANSLATIONS[language];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  // Fallback for closedby="any" in browsers without HTMLDialogElement.prototype.closedBy
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || 'closedBy' in HTMLDialogElement.prototype) return;

    const outside = (e: PointerEvent) => {
      const r = dialog.getBoundingClientRect();
      return (
        e.clientX < r.left ||
        e.clientX > r.right ||
        e.clientY < r.top ||
        e.clientY > r.bottom
      );
    };

    let pressedOutside = false;
    const onDown = (e: PointerEvent) => {
      pressedOutside = outside(e);
    };
    const onUp = (e: PointerEvent) => {
      if (pressedOutside && outside(e)) {
        dialog.close();
      }
    };

    dialog.addEventListener('pointerdown', onDown);
    dialog.addEventListener('pointerup', onUp);
    return () => {
      dialog.removeEventListener('pointerdown', onDown);
      dialog.removeEventListener('pointerup', onUp);
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      className="cyber-dialog"
      onClose={() => {
        if (dialogRef.current) {
          dialogRef.current.returnValue = '';
        }
        onClose();
      }}
      {...({ closedby: 'any' } as React.DialogHTMLAttributes<HTMLDialogElement>)}
    >
      <div className="dialog-inner">
        <header className="dialog-header">
          <div className="dialog-title-row">
            <Award size={20} className="text-cyan" />
            <h2 id={titleId}>{t.missionModalTitle}</h2>
          </div>
          <form method="dialog">
            <button
              type="submit"
              value="close"
              className="hud-icon-btn"
              aria-label={t.closeBtn}
              autoFocus
            >
              <X size={18} />
            </button>
          </form>
        </header>

        <div className="dialog-tabs">
          <button
            type="button"
            className={`panel-tab ${tab === 'missions' ? 'active' : ''}`}
            onClick={() => setTab('missions')}
          >
            {t.missionsCatalogTab} ({completedMissionIds.length}/10 {t.statusCompleted})
          </button>
          <button
            type="button"
            className={`panel-tab ${tab === 'evidence' ? 'active' : ''}`}
            onClick={() => setTab('evidence')}
          >
            {t.evidenceTab}
          </button>
        </div>

        <div className="dialog-body scrollable-y">
          {tab === 'missions' ? (
            <div className="chapters-progress-list">
              {CHAPTERS_DATA.map((ch) => {
                const chMissions = CURRICULUM_MISSIONS.filter(
                  (m) => m.chapterId === ch.chapterId
                );
                const chI18n = getChapterI18n(ch.chapterId, language);

                return (
                  <div key={ch.chapterId} className="chapter-group-block">
                    <div className="chapter-group-header">
                      <span className="code-badge">{ch.code}</span>
                      <strong>{chI18n.title}</strong>
                      <span className="chapter-sub">{chI18n.subtitle}</span>
                    </div>

                    <div className="mission-cards-grid">
                      {chMissions.map((m) => {
                        const isDone = completedMissionIds.includes(m.missionId);
                        const isActive = m.missionId === currentMissionId;
                        const mI18n = getMissionI18n(m.missionId, language);

                        return (
                          <div
                            key={m.missionId}
                            className={`modal-mission-card ${isActive ? 'current' : ''} ${
                              isDone ? 'done' : ''
                            }`}
                          >
                            <div className="modal-mission-top">
                              <span className="stage-pill">STAGE 0{m.stageOrder}</span>
                              <span className="concept-tag">{mI18n.conceptBadge}</span>
                              {isDone && (
                                <CheckCircle2 size={16} className="text-emerald" />
                              )}
                            </div>
                            <h3 className="modal-mission-title">{mI18n.title}</h3>
                            <p className="modal-mission-desc">{mI18n.objectiveSummary}</p>
                            <div className="modal-mission-footer">
                              <span className="xp-text">{t.rewardText} +{m.rewardXp} XP</span>
                              <button
                                type="button"
                                className="cyber-btn cyber-btn-secondary cyber-btn-xs"
                                onClick={() => {
                                  onSelectMission(m.missionId);
                                  onClose();
                                }}
                              >
                                <Play size={12} />
                                <span>{isActive ? t.currentActiveBtn : t.jumpToMissionBtn}</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="evidence-archive-list">
              {evidenceRows.map((ev) => {
                const isUnlocked =
                  ev.is_unlocked === 1 ||
                  unlockedEvidenceCodes.includes(ev.evidence_code);
                const evI18n = getEvidenceI18n(ev.evidence_code, language);
                return (
                  <div
                    key={ev.evidence_id}
                    className={`evidence-card ${isUnlocked ? 'unlocked' : 'locked'}`}
                  >
                    <div className="evidence-card-top">
                      <span className="code-badge">{ev.evidence_code}</span>
                      <span className="concept-tag">{ev.category}</span>
                      {isUnlocked ? (
                        <FileSearch size={16} className="text-cyan" />
                      ) : (
                        <Lock size={16} className="text-muted" />
                      )}
                    </div>
                    <h3 className="evidence-title">
                      {isUnlocked ? evI18n.title : t.evidenceEncryptedTitle}
                    </h3>
                    <p className="evidence-summary">
                      {isUnlocked ? evI18n.summary : t.evidenceEncryptedDesc}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </dialog>
  );
};

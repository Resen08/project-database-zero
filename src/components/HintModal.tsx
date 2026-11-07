import React, { useState } from 'react';
import {
  Code2,
  Copy,
  HelpCircle,
  Lightbulb,
  Sparkles,
  Unlock,
  X,
} from 'lucide-react';
import { SqlMission } from '../types/game';
import { SupportedLanguage, UI_TRANSLATIONS, getMissionI18n } from '../services/i18n';

interface HintModalProps {
  isOpen: boolean;
  mission: SqlMission;
  language: SupportedLanguage;
  onClose: () => void;
  onApplyQuery: (sql: string) => void;
}

export const HintModal: React.FC<HintModalProps> = ({
  isOpen,
  mission,
  language,
  onClose,
  onApplyQuery,
}) => {
  const [revealedLevel, setRevealedLevel] = useState<number>(1);
  const [showSolution, setShowSolution] = useState<boolean>(false);

  if (!isOpen) return null;

  const t = UI_TRANSLATIONS[language];
  const tierLabels = [t.hintTier1, t.hintTier2, t.hintTier3];
  const mI18n = getMissionI18n(mission.missionId, language);

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="hint-modal-title"
      onClick={onClose}
    >
      <div
        className="modal-container hint-modal-box"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title-wrap">
            <Lightbulb size={20} className="text-amber" />
            <div>
              <h2 id="hint-modal-title" className="modal-heading">
                {t.hintModalTitle}
              </h2>
              <span className="modal-subheading">
                {mission.codeName} // {mI18n.title} ({mI18n.conceptBadge})
              </span>
            </div>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label={t.closeBtn}
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div className="hint-caution-box">
            <HelpCircle size={18} className="text-amber" />
            <p>{t.hintCautionText}</p>
          </div>

          <div className="hint-cards-stack">
            {mI18n.hints.map((hintText, idx) => {
              const level = idx + 1;
              const isUnlocked = level <= revealedLevel;

              return (
                <div
                  key={level}
                  className={`hint-step-card ${isUnlocked ? 'unlocked' : 'locked'}`}
                >
                  <div className="hint-step-card-header">
                    <span className="hint-step-tag">
                      {t.hintStepPrefix} {level}
                    </span>
                    <span className="hint-step-sub">{tierLabels[idx]}</span>
                  </div>

                  {isUnlocked ? (
                    <p className="hint-step-body">{hintText}</p>
                  ) : (
                    <div className="hint-locked-box">
                      <span>{t.hintLockedText}</span>
                      <button
                        type="button"
                        className="cyber-btn cyber-btn-secondary cyber-btn-xs"
                        onClick={() => setRevealedLevel(level)}
                      >
                        <Unlock size={12} />
                        <span>
                          {t.hintStepPrefix} {level} {t.hintUnlockBtn}
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Musterlösung / 정답 확인 영역 */}
          <div className="hint-solution-box">
            <div className="hint-solution-header">
              <div className="solution-title-row">
                <Code2 size={16} className="text-cyan" />
                <strong>{t.hintSolutionTitle}</strong>
              </div>
              <span>{t.hintSolutionSub}</span>
            </div>

            {showSolution ? (
              <div className="hint-revealed-solution">
                <pre className="hint-sql-preview">
                  <code>{mission.referenceQuery}</code>
                </pre>
                <button
                  type="button"
                  className="cyber-btn cyber-btn-primary cyber-btn-xs"
                  onClick={() => {
                    onApplyQuery(mission.referenceQuery);
                    onClose();
                  }}
                >
                  <Copy size={13} />
                  <span>{t.hintApplyQuery}</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="cyber-btn cyber-btn-ghost cyber-btn-sm"
                onClick={() => setShowSolution(true)}
              >
                <Sparkles size={14} className="text-amber" />
                <span>{t.hintShowSolution}</span>
              </button>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="cyber-btn cyber-btn-primary cyber-btn-sm"
            onClick={onClose}
          >
            {t.closeBtn}
          </button>
        </div>
      </div>
    </div>
  );
};

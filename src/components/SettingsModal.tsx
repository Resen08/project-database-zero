import React, { useEffect, useId, useRef } from 'react';
import {
  Download,
  Globe,
  Settings,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { SaveState } from '../types/game';
import { SupportedLanguage, UI_TRANSLATIONS } from '../services/i18n';

interface SettingsModalProps {
  isOpen: boolean;
  saveState: SaveState;
  onUpdateSettings: (partial: Partial<SaveState['settings']>) => void;
  onExportSave: () => void;
  onImportSave: (imported: SaveState) => void;
  onResetAllProgress: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  saveState,
  onUpdateSettings,
  onExportSave,
  onImportSave,
  onResetAllProgress,
  onClose,
}) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const titleId = useId();

  const lang: SupportedLanguage = saveState.settings.language || 'de';
  const t = UI_TRANSLATIONS[lang];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as SaveState;
        if (parsed && typeof parsed.currentMissionId === 'number') {
          onImportSave(parsed);
        }
      } catch {
        // invalid json
      }
    };
    reader.readAsText(file);
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      className="cyber-dialog cyber-dialog-md"
      onClose={() => {
        if (dialogRef.current) {
          dialogRef.current.returnValue = '';
        }
        onClose();
      }}
    >
      <div className="dialog-inner">
        <header className="dialog-header">
          <div className="dialog-title-row">
            <Settings size={20} className="text-cyan" />
            <h2 id={titleId}>{t.settingsTitle}</h2>
          </div>
          <button
            type="button"
            className="hud-icon-btn"
            onClick={onClose}
            aria-label={t.closeBtn}
          >
            <X size={18} />
          </button>
        </header>

        <div className="dialog-body scrollable-y settings-form-body">
          {/* 1. Language settings tab */}
          <div className="settings-group">
            <div className="settings-group-header">
              <Globe size={16} className="text-cyan" />
              <h3>{t.langSettingTitle}</h3>
            </div>
            <p className="settings-hint">{t.langDesc}</p>

            <div className="lang-selection-row">
              <button
                type="button"
                className={`lang-select-card ${lang === 'de' ? 'active' : ''}`}
                onClick={() => onUpdateSettings({ language: 'de' })}
              >
                <span className="lang-flag">🇩🇪</span>
                <div className="lang-card-text">
                  <strong>Deutsch</strong>
                  <span>Standard / Hauptsprache</span>
                </div>
              </button>

              <button
                type="button"
                className={`lang-select-card ${lang === 'ko' ? 'active' : ''}`}
                onClick={() => onUpdateSettings({ language: 'ko' })}
              >
                <span className="lang-flag">🇰🇷</span>
                <div className="lang-card-text">
                  <strong>한국어</strong>
                  <span>Koreanisch</span>
                </div>
              </button>
            </div>
          </div>

          {/* 2. Audio & Interface settings */}
          <div className="settings-group">
            <h3>{t.soundSettingsTitle}</h3>

            <label className="setting-row">
              <span>{t.soundAudioEffects}</span>
              <input
                type="checkbox"
                checked={saveState.settings.soundEnabled}
                onChange={(e) =>
                  onUpdateSettings({ soundEnabled: e.target.checked })
                }
              />
            </label>

            <label className="setting-row">
              <span>{t.soundBgm}</span>
              <input
                type="checkbox"
                checked={saveState.settings.bgmEnabled}
                onChange={(e) =>
                  onUpdateSettings({ bgmEnabled: e.target.checked })
                }
              />
            </label>

            <label className="setting-row">
              <span>
                {t.editorFontSizeLabel} ({saveState.settings.editorFontSize}px)
              </span>
              <input
                type="range"
                min={12}
                max={20}
                value={saveState.settings.editorFontSize}
                onChange={(e) =>
                  onUpdateSettings({ editorFontSize: Number(e.target.value) })
                }
              />
            </label>
          </div>

          {/* 3. Save data backup and recovery */}
          <div className="settings-group">
            <h3>{t.dataManageTitle}</h3>
            <p className="settings-hint">{t.saveDataHelp}</p>
            <div className="settings-btn-row">
              <button
                type="button"
                className="cyber-btn cyber-btn-secondary cyber-btn-sm"
                onClick={onExportSave}
              >
                <Download size={15} />
                <span>{t.exportSaveBtn}</span>
              </button>

              <label className="cyber-btn cyber-btn-secondary cyber-btn-sm file-upload-label">
                <Upload size={15} />
                <span>{t.importSaveBtn}</span>
                <input
                  type="file"
                  accept="application/json"
                  onChange={handleFileChange}
                  hidden
                />
              </label>

              <button
                type="button"
                className="cyber-btn cyber-btn-danger cyber-btn-sm"
                onClick={onResetAllProgress}
              >
                <Trash2 size={15} />
                <span>{t.resetProgressBtn}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
};

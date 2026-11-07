import React from 'react';
import {
  BarChart3,
  BookOpen,
  Globe,
  Home,
  Settings,
  Shield,
  Terminal,
  Trophy,
  User,
  Volume2,
  VolumeX,
} from 'lucide-react';
import {
  SupportedLanguage,
  UI_TRANSLATIONS,
  getRankByXpAndCount,
} from '../services/i18n';
import { assetUrl } from '../utils/assets';

export type NavTabId = 'home' | 'console' | 'codex' | 'stats' | 'achievements';

interface TopNavBarProps {
  activeTab: NavTabId;
  xp: number;
  completedCount: number;
  soundEnabled: boolean;
  language: SupportedLanguage;
  onSelectTab: (tab: NavTabId) => void;
  onToggleSound: () => void;
  onToggleLanguage: () => void;
  onOpenSettings: () => void;
}

export function getInvestigatorRank(
  xp: number,
  completedCount: number,
  lang: SupportedLanguage = 'de'
) {
  return getRankByXpAndCount(xp, completedCount, lang);
}

export const TopNavBar: React.FC<TopNavBarProps> = ({
  activeTab,
  xp,
  completedCount,
  soundEnabled,
  language,
  onSelectTab,
  onToggleSound,
  onToggleLanguage,
  onOpenSettings,
}) => {
  const t = UI_TRANSLATIONS[language];
  const rank = getInvestigatorRank(xp, completedCount, language);

  return (
    <header className="aegis-top-navbar">
      <div className="navbar-left">
        <button
          type="button"
          className="aegis-brand-btn"
          onClick={() => onSelectTab('home')}
          title={t.navHome}
        >
          <div className="aegis-shield-logo">
            <Shield size={19} className="shield-icon" />
          </div>
          <div className="aegis-brand-text">
            <span>AEGIS DATA</span>
            <span>INVESTIGATION BUREAU</span>
          </div>
        </button>

        <div className="navbar-divider" aria-hidden="true" />

        <nav className="navbar-links" aria-label="Main Navigation">
          <button
            type="button"
            className={`navbar-link-item ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => onSelectTab('home')}
          >
            <Home size={15} />
            <span>{t.navHome}</span>
          </button>

          <button
            type="button"
            className={`navbar-link-item ${activeTab === 'console' ? 'active' : ''}`}
            onClick={() => onSelectTab('console')}
          >
            <Terminal size={15} />
            <span>{t.navConsole}</span>
          </button>

          <button
            type="button"
            className={`navbar-link-item ${activeTab === 'codex' ? 'active' : ''}`}
            onClick={() => onSelectTab('codex')}
          >
            <BookOpen size={15} />
            <span>{t.navCodex}</span>
          </button>

          <button
            type="button"
            className={`navbar-link-item ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => onSelectTab('stats')}
          >
            <BarChart3 size={15} />
            <span>{t.navStats}</span>
          </button>

          <button
            type="button"
            className={`navbar-link-item ${activeTab === 'achievements' ? 'active' : ''}`}
            onClick={() => onSelectTab('achievements')}
          >
            <Trophy size={15} />
            <span>{t.navAchievements}</span>
          </button>
        </nav>
      </div>

      <div className="navbar-right">
        {/* 언어 전환 버튼 (DE / KO) */}
        <button
          type="button"
          className="lang-pill-btn"
          onClick={onToggleLanguage}
          title={t.langToggle}
          aria-label={t.langToggle}
        >
          <Globe size={13} className="lang-icon" />
          <span className={`lang-choice ${language === 'de' ? 'active' : ''}`}>
            DE
          </span>
          <span className="lang-sep">|</span>
          <span className={`lang-choice ${language === 'ko' ? 'active' : ''}`}>
            KO
          </span>
        </button>

        <div className="navbar-divider" aria-hidden="true" />

        {/* 수사관 프로필 칩 */}
        <div className="player-profile-chip" title={`${rank.title} (Level ${rank.level})`}>
          <div className="profile-avatar-mini" aria-hidden="true">
            <span
              className="profile-pixel-face"
              style={{ backgroundImage: `url("${assetUrl('/assets/sprites/player_idle_1.png')}")` }}
            />
          </div>
          <div className="profile-meta">
            <strong className="profile-level">Lv.{rank.level}</strong>
            <span className="profile-rank">{rank.title}</span>
          </div>
        </div>

        <div className="navbar-divider" aria-hidden="true" />

        {/* 볼륨 버튼 */}
        <button
          type="button"
          className="navbar-action-btn"
          onClick={onToggleSound}
          aria-label={t.soundToggle}
          title={soundEnabled ? 'Audio: ON' : 'Audio: OFF'}
        >
          {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
        </button>

        {/* 설정 버튼 */}
        <button
          type="button"
          className="navbar-action-btn"
          onClick={onOpenSettings}
          title={t.settingsBtn}
        >
          <Settings size={15} />
          <span>{t.settingsBtn}</span>
        </button>
      </div>
    </header>
  );
};

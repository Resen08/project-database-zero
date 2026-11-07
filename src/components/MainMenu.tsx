import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Lock,
  Play,
  PlayCircle,
  RotateCcw,
  Settings,
  Sparkles,
  Star,
} from 'lucide-react';
import { CURRICULUM_MISSIONS } from '../data/curriculumMissions';
import { StageVisualIcon } from './StageVisualIcon';
import { assetUrl } from '../utils/assets';
import {
  STAGE_SHORT_SUBTITLES,
  SupportedLanguage,
  UI_TRANSLATIONS,
  getMissionI18n,
  getRankByXpAndCount,
} from '../services/i18n';

interface MainMenuProps {
  hasSave: boolean;
  currentMissionId: number;
  completedMissionIds: number[];
  xp: number;
  language: SupportedLanguage;
  onStartNewGame: () => void;
  onContinueGame: () => void;
  onSelectMissionDirect: (missionId: number) => void;
  onOpenSettings: () => void;
}

const PLAYER_IDLE_FRAMES = [
  assetUrl('/assets/sprites/player_idle_1.png'),
  assetUrl('/assets/sprites/player_idle_2.png'),
  assetUrl('/assets/sprites/player_idle_3.png'),
  assetUrl('/assets/sprites/player_idle_4.png'),
];

export const MainMenu: React.FC<MainMenuProps> = ({
  currentMissionId,
  completedMissionIds,
  xp,
  language,
  onStartNewGame,
  onContinueGame,
  onSelectMissionDirect,
  onOpenSettings,
}) => {
  const [animFrame, setAnimFrame] = useState(0);

  // Initialize selected theme based on current progression
  const isTheme1Complete = [1, 2, 3, 4, 5].every((id) =>
    completedMissionIds.includes(id)
  );
  const [selectedTheme, setSelectedTheme] = useState<1 | 2>(() => {
    return currentMissionId > 5 ? 2 : 1;
  });

  useEffect(() => {
    const timer = window.setInterval(() => {
      setAnimFrame((prev) => (prev + 1) % 4);
    }, 200);
    return () => window.clearInterval(timer);
  }, []);

  const t = UI_TRANSLATIONS[language];
  const completedCount = completedMissionIds.length;
  const rank = getRankByXpAndCount(xp, completedCount, language);

  // Maximum unlocked stage (Cannot jump ahead without clearing earlier stages)
  const maxUnlockedStage = completedCount + 1;

  // Chapter progress (10 stages total: 1~3, 4~7, 8~10)
  const chapterProgress =
    completedCount >= 7 ? 3 : completedCount >= 4 ? 2 : 1;
  const chapterPercent = Math.min(
    100,
    Math.max(10, Math.round(((completedCount) / 10) * 100))
  );
  const xpPercent = Math.min(100, Math.max(8, Math.round((xp / rank.nextXp) * 100)));

  const handleCardClick = (m: (typeof CURRICULUM_MISSIONS)[0], status: string) => {
    if (status === 'locked') {
      alert(t.lockedAlert);
      return;
    }
    onSelectMissionDirect(m.missionId);
  };

  const displayedMissions = CURRICULUM_MISSIONS.filter(
    (m) => m.themeId === selectedTheme
  );

  return (
    <main className="dashboard-screen">
      {/* 1. 시네마틱 사이버펑크 메인 히어로 모듈 */}
      <section className="hero-master-card" aria-label="Main Hero Module">
        <div className="hero-banner-stage">
          <div
            className="hero-skyline-bg pixelated"
            style={{
              backgroundImage: `url("${assetUrl('/assets/backgrounds/bg_warped_city_skyline.png')}")`,
            }}
          />
          <div className="hero-atmosphere-gradient" />

          {/* 상공 비행 경찰 스피너 & 순찰 드론 */}
          <div
            className="hero-flying-spinner pixelated"
            style={{
              backgroundImage: `url("${assetUrl('/assets/objects/obj_police_spinner.png')}")`,
            }}
          />
          <div
            className="hero-patrol-drone pixelated"
            style={{
              backgroundImage: `url("${assetUrl('/assets/sprites/drone_1.png')}")`,
            }}
          />

          {/* 좌측: 신입 데이터 수사관 이즈리얼 워크스테이션 */}
          <div className="hero-station-left">
            <div className="agent-badge-tag">
              <span className="agent-status-dot" />
              <span>INVESTIGATOR EZREAL</span>
            </div>
            <div className="hero-terminal-unit">
              <div
                className="terminal-desk-obj pixelated"
                style={{
                  backgroundImage: `url("${assetUrl('/assets/objects/obj_computer_terminal.png')}")`,
                }}
              />
              <div
                className="player-sprite-char pixelated"
                style={{
                  backgroundImage: `url("${PLAYER_IDLE_FRAMES[animFrame]}")`,
                }}
              />
            </div>
          </div>

          {/* 중앙 네온 타이틀 블록 */}
          <div className="hero-neon-title-block">
            <div className="hero-laser-header">
              <span className="laser-bracket">[</span>
              <span className="laser-tag">AEGIS DATA CRIMES DIVISION // SYSTEM 2086</span>
              <span className="laser-bracket">]</span>
            </div>
            <h1 className="hero-cyber-brand">PROJECT DATABASE ZERO</h1>
            <p className="hero-korean-subtitle">{t.appHeadline}</p>
            <p className="hero-sub-meta">{t.appSubheadline}</p>
          </div>

          {/* 우측: 수석 데이터 분석관 아리 서버 랙 & 말풍선 */}
          <div className="hero-station-right">
            <div className="aria-speech-bubble">
              <span className="speech-pulse-dot" />
              <div className="speech-body">
                <span className="speech-author">CHIEF ANALYST AHRI</span>
                <p>{t.ariaSpeech}</p>
              </div>
            </div>
            <div className="hero-server-unit">
              <div
                className="aria-sprite-char pixelated"
                style={{
                  backgroundImage: `url("${assetUrl('/assets/characters/char_aria_sheet.png')}")`,
                }}
              />
              <div
                className="server-rack-box pixelated"
                style={{
                  backgroundImage: `url("${assetUrl('/assets/objects/obj_server_control_box1.png')}")`,
                }}
              />
            </div>
          </div>
        </div>

        {/* 2. 대형 3개 CTA 액션 버튼 바 */}
        <div className="hero-action-dock" aria-label="Quick Actions">
          <button
            type="button"
            className="cta-bevel-primary"
            onClick={completedCount > 0 ? onContinueGame : onStartNewGame}
          >
            <Play size={20} className="cta-play-icon" />
            <div className="cta-text-col">
              <strong>{t.startInvestigation}</strong>
              <span>{t.startInvestigationSub}</span>
            </div>
          </button>

          <button
            type="button"
            className="cta-glass-secondary"
            onClick={onContinueGame}
          >
            <div className="cta-circle-icon">
              <RotateCcw size={17} />
            </div>
            <div className="cta-text-col">
              <strong>{t.continueInvestigation}</strong>
              <span>{t.continueInvestigationSub}</span>
            </div>
          </button>

          <button
            type="button"
            className="cta-glass-secondary"
            onClick={onOpenSettings}
          >
            <div className="cta-circle-icon">
              <Settings size={17} />
            </div>
            <div className="cta-text-col">
              <strong>{t.settingsBtn}</strong>
              <span>{t.settingsSub}</span>
            </div>
          </button>
        </div>

        {/* 3. 챕터 진행도 & SQL 숙련도 와이드 상태 바 */}
        <div
          className="progress-mastery-banner"
          aria-label="Progress & Mastery"
        >
          <div
            className="progress-city-silhouette"
            aria-hidden="true"
            style={{
              backgroundImage: `url("${assetUrl('/assets/backgrounds/bg_warped_city_skyline.png')}")`,
            }}
          />
          
          <div className="mastery-col">
            <div className="mastery-icon-box cyan-glow">
              <BookOpen size={20} />
            </div>
            <div className="mastery-info-group">
              <span className="mastery-label">{t.chapterProgress}</span>
              <strong className="mastery-value">{chapterProgress} / 3</strong>
            </div>
            <div className="mastery-track-wrapper">
              <div className="mastery-bar-track" aria-hidden="true">
                <div
                  className="mastery-bar-fill"
                  style={{ width: `${chapterPercent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mastery-vertical-divider" aria-hidden="true" />

          <div className="mastery-col mastery-col-xp">
            <div className="mastery-icon-box amber-glow">
              <Star size={20} />
            </div>
            <div className="mastery-info-group">
              <span className="mastery-label">{t.sqlMastery}</span>
              <strong className="mastery-value">
                Lv.{rank.level} {rank.title}
              </strong>
            </div>
            <div className="mastery-track-wrapper">
              <div className="mastery-bar-track" aria-hidden="true">
                <div
                  className="mastery-bar-fill amber"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
              <span className="mastery-xp-counter">
                {xp.toLocaleString()} / {rank.nextXp.toLocaleString()} XP
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SQL 조사 단계 (테마 1 기초 / 테마 2 실전 응용 선택 탭 & 카드) */}
      <section
        className="sql-stages-section"
        aria-labelledby="sql-stages-heading"
      >
        <div className="stages-section-header">
          <div className="stages-header-left">
            <span className="slash-accent" aria-hidden="true">
              //
            </span>
            <h2 id="sql-stages-heading">{t.sqlStagesHeading}</h2>
          </div>
          <p className="stages-header-right">
            {t.sqlStagesSub}{' '}
            <span className="slash-accent" aria-hidden="true">
              //
            </span>
          </p>
        </div>

        {/* 테마 1 vs 테마 2 탭 전환 바 */}
        <div className="theme-toggle-container" role="tablist" aria-label="Curriculum Themes">
          <button
            type="button"
            role="tab"
            aria-selected={selectedTheme === 1}
            className={`theme-pill-btn ${selectedTheme === 1 ? 'active' : ''}`}
            onClick={() => setSelectedTheme(1)}
          >
            <div className="theme-pill-left">
              <span className="theme-pill-badge">PHASE 1</span>
              <strong>{t.theme1Tab}</strong>
            </div>
            <span className="theme-pill-sub">{t.theme1Subtitle}</span>
            <span className="theme-pill-count">5 / 5 STAGES</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={selectedTheme === 2}
            className={`theme-pill-btn ${selectedTheme === 2 ? 'active' : ''} ${!isTheme1Complete ? 'is-locked' : ''}`}
            onClick={() => {
              if (!isTheme1Complete) {
                alert(t.themeLockedAlert);
                return;
              }
              setSelectedTheme(2);
            }}
          >
            <div className="theme-pill-left">
              <span className="theme-pill-badge">
                PHASE 2 {!isTheme1Complete && '🔒'}
              </span>
              <strong>{t.theme2Tab}</strong>
            </div>
            <span className="theme-pill-sub">{t.theme2Subtitle}</span>
            <span className="theme-pill-count">
              {isTheme1Complete ? (
                <span className="unlocked-text"><Sparkles size={13} /> UNLOCKED</span>
              ) : (
                <span className="locked-text"><Lock size={13} /> {t.statusLocked}</span>
              )}
            </span>
          </button>
        </div>

        {/* 선택된 테마의 5개 단계 카드 */}
        <div className="stages-cards-grid">
          {displayedMissions.map((m) => {
            const isCompleted = completedMissionIds.includes(m.missionId);
            const isLocked = m.stageOrder > maxUnlockedStage;
            const status: 'completed' | 'active' | 'locked' = isCompleted
              ? 'completed'
              : isLocked
              ? 'locked'
              : 'active';
            const mI18n = getMissionI18n(m.missionId, language);

            return (
              <button
                key={m.missionId}
                type="button"
                className={`stage-card-v2 status-${status}`}
                onClick={() => handleCardClick(m, status)}
                disabled={status === 'locked'}
                title={
                  status === 'locked'
                    ? t.lockedAlert
                    : `${m.stageOrder}: ${mI18n.title}`
                }
              >
                <StageVisualIcon stage={m.themeStageOrder} status={status} />

                <div className="stage-card-main">
                  <div className="stage-card-top-row">
                    <span className="stage-num-label">
                      STAGE {m.stageOrder < 10 ? `0${m.stageOrder}` : m.stageOrder}
                    </span>
                    <span className="stage-concept-pill">
                      {mI18n.conceptBadge}
                    </span>
                  </div>

                  <div className="stage-card-mid-row">
                    <div className="stage-card-titles">
                      <strong className="stage-card-heading">{mI18n.title}</strong>
                      <span className="stage-card-sub">
                        {STAGE_SHORT_SUBTITLES[language][m.missionId] ||
                          mI18n.objectiveSummary}
                      </span>
                    </div>
                    <ChevronRight size={18} className="stage-chevron" />
                  </div>

                  <div className="stage-card-bottom-row">
                    {status === 'completed' && (
                      <span className="stage-status-chip completed">
                        <CheckCircle2 size={14} /> {t.statusCompleted}
                      </span>
                    )}
                    {status === 'active' && (
                      <span className="stage-status-chip active">
                        <PlayCircle size={14} /> {t.statusActive}
                      </span>
                    )}
                    {status === 'locked' && (
                      <span className="stage-status-chip locked">
                        <Lock size={13} /> {t.statusLocked}
                      </span>
                    )}

                    <span className="stage-xp-reward">+{m.rewardXp} XP</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </main>
  );
};

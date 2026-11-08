import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Code2,
  Copy,
  Eye,
  FileCode2,
  Lock,
  MapPin,
  Search,
  Sparkles,
  Target,
  Terminal,
  Unlock,
} from 'lucide-react';
import { ChapterData, DialogueLine, InvestigatableObject, SqlMission } from '../types/game';
import { AvatarSvg } from './AvatarSvg';
import {
  GUIDEBOOK_DATA,
  GuidebookEntry,
  SupportedLanguage,
  UI_TRANSLATIONS,
  getChapterI18n,
  getMissionI18n,
} from '../services/i18n';

interface StoryDialogPanelProps {
  chapter: ChapterData;
  mission: SqlMission;
  isMissionCompleted: boolean;
  inspectedObjectIds: string[];
  language: SupportedLanguage;
  onInspectObject: (obj: InvestigatableObject) => void;
  onLoadSuggestedQuery: (sql: string) => void;
  onPreviewTable?: (tableName: string) => void;
  onSelectMission: (missionId: number) => void;
  completedMissionIds: number[];
  allMissions: SqlMission[];
}

type LeftConsoleTab = 'mission' | 'guidebook' | 'story' | 'clues';

export const StoryDialogPanel: React.FC<StoryDialogPanelProps> = ({
  chapter,
  mission,
  isMissionCompleted,
  inspectedObjectIds,
  language,
  onInspectObject,
  onLoadSuggestedQuery,
  onPreviewTable,
  onSelectMission,
  completedMissionIds,
  allMissions,
}) => {
  const [activeTab, setActiveTab] = useState<LeftConsoleTab>(() => {
    const params = new URLSearchParams(window.location.search);
    const left = params.get('left') as LeftConsoleTab | null;
    return left && ['mission', 'guidebook', 'story', 'clues'].includes(left)
      ? left
      : 'mission';
  });
  const [selectedGuideStage, setSelectedGuideStage] = useState<number>(mission.stageOrder);
  const [selectedObject, setSelectedObject] = useState<InvestigatableObject | null>(null);

  const t = UI_TRANSLATIONS[language];
  const guidebookEntries = GUIDEBOOK_DATA[language];
  const mI18n = getMissionI18n(mission.missionId, language);
  const chI18n = getChapterI18n(chapter.chapterId, language);

  // Stage progression lock rule: Only allow up to (completed count + 1)
  const maxUnlockedStage = completedMissionIds.length + 1;

  const handleMissionStepClick = (m: SqlMission) => {
    if (m.stageOrder > maxUnlockedStage) {
      alert(t.lockedAlert);
      return;
    }
    setSelectedGuideStage(m.stageOrder);
    onSelectMission(m.missionId);
  };

  const dialoguesToDisplay = isMissionCompleted
    ? [
        ...chI18n.introDialogues.map((d, i) => ({
          id: `intro-${i}`,
          speakerId: 'intro',
          speakerName: d.speakerName,
          speakerRole: d.speakerRole,
          avatarType: (i % 2 === 0 ? 'aria' : 'kyle') as 'aria' | 'kyle',
          text: d.text,
          sqlTip: d.sqlTip,
        })),
        ...mI18n.successDialogue.map((d, i) => ({
          id: `win-${i}`,
          speakerId: 'win',
          speakerName: d.speakerName,
          speakerRole: d.speakerRole,
          avatarType: 'aria' as const,
          text: d.text,
          sqlTip: d.sqlTip,
        })),
      ]
    : chI18n.introDialogues.map((d, i) => ({
        id: `intro-${i}`,
        speakerId: 'intro',
        speakerName: d.speakerName,
        speakerRole: d.speakerRole,
        avatarType: (i % 2 === 0 ? 'aria' : 'kyle') as 'aria' | 'kyle',
        text: d.text,
        sqlTip: d.sqlTip,
      }));

  return (
    <section className="panel story-panel" aria-label="Ermittlungs-Panel">
      {/* 1. 상단 10단계 스테이지 네비게이터 (미클리어 잠금 적용, 테마1 튜토리얼 / 테마2 실전응용) */}
      <div className="stage-stepper" role="navigation" aria-label="Stufenauswahl">
        {allMissions.map((m) => {
          const isCurrent = m.missionId === mission.missionId;
          const isDone = completedMissionIds.includes(m.missionId);
          const isLocked = m.stageOrder > maxUnlockedStage;
          const label = `T${m.themeId}-${m.themeStageOrder}`;
          const stepI18n = getMissionI18n(m.missionId, language);

          return (
            <button
              key={m.missionId}
              type="button"
              className={`stage-step-btn ${isCurrent ? 'active' : ''} ${
                isDone ? 'completed' : ''
              } ${isLocked ? 'locked' : ''}`}
              onClick={() => handleMissionStepClick(m)}
              disabled={isLocked}
              title={
                isLocked
                  ? `Stage ${m.stageOrder} (${label}): 🔒 ${t.statusLocked}`
                  : `Stage ${m.stageOrder} (${label}): ${stepI18n.title} (${stepI18n.conceptBadge})`
              }
            >
              <span className="step-num">{label}</span>
              {isDone && <CheckCircle2 size={11} className="step-check-icon" />}
              {isLocked && <Lock size={9} className="step-lock-icon" />}
            </button>
          );
        })}
      </div>

      {/* 2. 4대 독립 탭: [미션] / [가이드북(신규 해금)] / [스토리] / [단서] */}
      <div className="panel-tabs panel-tabs-4" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'mission'}
          className={`panel-tab ${activeTab === 'mission' ? 'active' : ''}`}
          onClick={() => setActiveTab('mission')}
        >
          <Target size={14} />
          <span>{t.missionTab}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'guidebook'}
          className={`panel-tab ${activeTab === 'guidebook' ? 'active' : ''}`}
          onClick={() => {
            setSelectedGuideStage(mission.stageOrder);
            setActiveTab('guidebook');
          }}
        >
          <BookOpen size={14} />
          <span>{t.guidebookTab}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'story'}
          className={`panel-tab ${activeTab === 'story' ? 'active' : ''}`}
          onClick={() => setActiveTab('story')}
        >
          <Terminal size={14} />
          <span>{t.storyTab}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'clues'}
          className={`panel-tab ${activeTab === 'clues' ? 'active' : ''}`}
          onClick={() => setActiveTab('clues')}
        >
          <Search size={14} />
          <span>{t.cluesTab}</span>
        </button>
      </div>

      {/* 3. 탭별 메인 컨텐츠 바디 */}
      <div className="panel-body scrollable-y">
        {/* 탭 1: 미션 브리핑 (간결하고 흥미로운 스토리 전달) */}
        {activeTab === 'mission' && (
          <div className="mission-briefing-view">
            <div className="mission-header-card">
              <div className="mission-meta-row">
                <span className="code-badge">{mission.codeName}</span>
                <span className="concept-badge">{mI18n.conceptBadge}</span>
                {isMissionCompleted && (
                  <span className="completed-pill">
                    <CheckCircle2 size={13} /> {t.statusCompleted}
                  </span>
                )}
              </div>
              <h2 className="mission-title">{mI18n.title}</h2>
              <div className="sector-line">
                <MapPin size={14} />
                <span>{chI18n.locationSector}</span>
              </div>
            </div>

            {/* 짧고 긴박한 수사 브리핑 */}
            <div className="narrative-box">
              <div className="narrative-box-label">
                🚨 {t.briefingHeader}
              </div>
              <p className="narrative-text">{mI18n.briefing}</p>
            </div>

            {/* 명확한 목표 조건 */}
            <div className="objective-box">
              <div className="objective-label">
                <Sparkles size={16} className="text-cyan" />
                <strong>
                  {t.objectiveHeader}
                </strong>
              </div>
              <p className="objective-text">{mI18n.objectiveSummary}</p>
              
              <div className="target-tables-row">
                <span className="target-label">
                  {t.relevantTablesHeader}
                </span>
                {mission.targetTables.map((tName) => (
                  <button
                    key={tName}
                    type="button"
                    className="table-quick-chip"
                    onClick={() => {
                      if (onPreviewTable) onPreviewTable(tName);
                      else onLoadSuggestedQuery(`SELECT * FROM ${tName} LIMIT 20;`);
                    }}
                    title={t.tablePreviewNotice}
                  >
                    <Eye size={12} />
                    <span>{tName}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 가이드북 열람 안내 */}
            <div className="mission-quick-nav-row">
              <button
                type="button"
                className="cyber-btn cyber-btn-secondary cyber-btn-xs"
                onClick={() => {
                  setSelectedGuideStage(mission.stageOrder);
                  setActiveTab('guidebook');
                }}
              >
                <BookOpen size={13} className="text-cyan" />
                <span>
                  {t.openGuidebookStage ? `${t.openGuidebookStage} ${mission.stageOrder} ${t.openGuidebookSuffix}` : `${mission.stageOrder}${t.openGuidebookSuffix}`}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* 탭 2: SQL 가이드북 (스토리 진행에 따라 단계별 해금) */}
        {activeTab === 'guidebook' && (
          <div className="guidebook-view">
            <div className="guidebook-banner">
              <div className="guidebook-banner-top">
                <FileCode2 size={18} className="text-cyan" />
                <div>
                  <strong>
                    {t.guidebookMainTitle}
                  </strong>
                  <p>
                    {t.guidebookUnlockedCountPrefix} {maxUnlockedStage} {t.guidebookUnlockedCountSuffix}
                  </p>
                </div>
              </div>

              {/* 가이드북 스테이지 선택 필터 칩 */}
              <div className="guidebook-stage-selector" role="tablist">
                {guidebookEntries.map((entry: GuidebookEntry) => {
                  const isUnlocked = entry.stageOrder <= maxUnlockedStage;
                  const isSelected = selectedGuideStage === entry.stageOrder;

                  return (
                    <button
                      key={entry.stageOrder}
                      type="button"
                      role="tab"
                      aria-selected={isSelected}
                      className={`guide-chip ${isSelected ? 'active' : ''} ${
                        !isUnlocked ? 'locked' : ''
                      }`}
                      onClick={() => {
                        if (isUnlocked) setSelectedGuideStage(entry.stageOrder);
                      }}
                      title={
                        isUnlocked
                          ? `${entry.stageOrder}: ${entry.keyword}`
                          : t.lockedAlertNeedPrev
                      }
                    >
                      <span>
                        T{entry.themeId}-{entry.themeId === 1 ? entry.stageOrder : entry.stageOrder - 5}
                      </span>
                      {!isUnlocked ? (
                        <Lock size={10} />
                      ) : (
                        <span className="guide-chip-kw">{entry.keyword.split(' ')[0]}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 선택된 스테이지의 가이드북 상세 내용 */}
            {(() => {
              const activeEntry =
                guidebookEntries.find((g: GuidebookEntry) => g.stageOrder === selectedGuideStage) ||
                guidebookEntries[0];
              const isUnlocked = activeEntry.stageOrder <= maxUnlockedStage;

              if (!isUnlocked) {
                return (
                  <div className="guidebook-locked-state">
                    <Lock size={32} className="text-muted" />
                    <p className="locked-state-title">
                      {t.levelPrefix} {activeEntry.stageOrder} {t.guidebookLockedEntry}
                    </p>
                    <p className="locked-state-sub">
                      {t.guidebookLockedDesc}
                    </p>
                  </div>
                );
              }

              return (
                <article className="guidebook-card" aria-label={activeEntry.title}>
                  <div className="guidebook-card-header">
                    <span className="guidebook-badge">{activeEntry.badge}</span>
                    <h3 className="guidebook-title">{activeEntry.title}</h3>
                    <p className="guidebook-summary">{activeEntry.summary}</p>
                  </div>

                  {/* 1. 기본 문법 구조 박스 */}
                  <div className="guidebook-syntax-block">
                    <div className="syntax-block-label">
                      <Code2 size={14} className="text-cyan" />
                      <span>{t.guidebookSyntaxTitle}</span>
                    </div>
                    <pre className="syntax-code-view">
                      <code>{activeEntry.syntax}</code>
                    </pre>
                  </div>

                  {/* 2. 핵심 원칙 설명 목록 */}
                  <div className="guidebook-rules-list">
                    <div className="rules-list-label">
                      💡 {t.guidebookRulesTitle}
                    </div>
                    <ul>
                      {activeEntry.explanation.map((item: string, idx: number) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  {/* 3. 실제 코드 예시 및 적용 버튼 */}
                  <div className="guidebook-example-box">
                    <div className="example-box-header">
                      <span>{t.guidebookExampleTitle}</span>
                      <button
                        type="button"
                        className="cyber-btn cyber-btn-primary cyber-btn-xs"
                        onClick={() => onLoadSuggestedQuery(activeEntry.exampleQuery)}
                      >
                        <Copy size={12} />
                        <span>{t.guidebookCopyToEditor}</span>
                      </button>
                    </div>
                    <pre className="example-code-pre">
                      <code>{activeEntry.exampleQuery}</code>
                    </pre>
                  </div>

                  {/* 4. 프로 팁 */}
                  <div className="guidebook-protip-box">
                    <strong>TIP:</strong> {activeEntry.proTip}
                  </div>
                </article>
              );
            })()}
          </div>
        )}

        {/* 탭 3: 스토리 대화록 (핵심만 간결하고 몰입감 있게) */}
        {activeTab === 'story' && (
          <div className="dialogue-list-view">
            <div className="chapter-banner-mini">
              <span className="code-badge">{chapter.code}</span>
              <strong className="chapter-banner-heading">{chI18n.title}</strong>
              <p>{chI18n.synopsis}</p>
            </div>

            <div className="story-section-divider">
              <span>{t.dialogueArchiveTitle}</span>
            </div>

            <div className="dialogue-cards-stack">
              {dialoguesToDisplay.map((d) => (
                <div key={d.id} className="dialogue-card">
                  <div className="dialogue-avatar-col">
                    <AvatarSvg type={d.avatarType} animated={false} language={language} />
                  </div>
                  <div className="dialogue-content-col">
                    <div className="dialogue-speaker-row">
                      <strong className="speaker-name">{d.speakerName}</strong>
                      <span className="speaker-role">{d.speakerRole}</span>
                    </div>
                    <p className="dialogue-text">{d.text}</p>
                    {d.sqlTip && (
                      <div className="dialogue-sql-tip">
                        <Sparkles size={13} className="text-amber" />
                        <span>{d.sqlTip}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 탭 4: 단서 및 현장 오브젝트 */}
        {activeTab === 'clues' && (
          <div className="objects-investigation-view">
            <p className="objects-guide-text">
              {t.cluesIntro}
            </p>

            <div className="objects-list">
              {chapter.objects.map((origObj) => {
                const isInspected = inspectedObjectIds.includes(origObj.id);
                const objI18n =
                  chI18n.objects.find((o) => o.id === origObj.id) || origObj;

                return (
                  <div
                    key={origObj.id}
                    className={`object-card ${isInspected ? 'inspected' : ''}`}
                  >
                    <div className="object-card-header">
                      <div className="object-icon-wrap">
                        <Search size={16} className="text-cyan" />
                      </div>
                      <div className="object-title-group">
                        <strong className="object-name">{objI18n.name}</strong>
                        <span className="object-loc">{objI18n.locationName}</span>
                      </div>
                      <button
                        type="button"
                        className="cyber-btn cyber-btn-secondary cyber-btn-xs"
                        onClick={() => {
                          setSelectedObject(origObj);
                          onInspectObject(origObj);
                        }}
                      >
                        {isInspected ? t.reinspect : t.inspect}
                      </button>
                    </div>

                    <p className="object-short-desc">{objI18n.shortDesc}</p>

                    {isInspected && (
                      <div className="object-inspection-detail">
                        <p className="inspection-report">{objI18n.inspectionReport}</p>
                        {objI18n.unlocksClueText && (
                          <div className="clue-unlocked-banner">
                            🔍 <strong>{t.clueFound}</strong>{' '}
                            {objI18n.unlocksClueText}
                          </div>
                        )}
                        {origObj.suggestedQuery && (
                          <button
                            type="button"
                            className="cyber-btn cyber-btn-ghost cyber-btn-xs"
                            onClick={() => onLoadSuggestedQuery(origObj.suggestedQuery!)}
                          >
                            <FileCode2 size={12} />
                            <span>
                              {t.loadRelatedQuery}
                            </span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

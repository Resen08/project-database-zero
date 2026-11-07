import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { CHAPTERS_DATA } from './data/chaptersData';
import { CURRICULUM_MISSIONS } from './data/curriculumMissions';
import { sqlEngine } from './database/sqlEngine';
import { QueryExecutionResult, TableSchemaInfo } from './types/database';
import { InvestigatableObject, SaveState } from './types/game';
import {
  clearSavedGame,
  exportSaveToJson,
  getDefaultSaveState,
  hasSavedGame,
  loadSaveState,
  saveGameState,
} from './services/storageService';
import { soundService } from './services/soundService';
import { MainMenu } from './components/MainMenu';
import { NavTabId, TopNavBar } from './components/TopNavBar';
import { SubMenuViews } from './components/SubMenuViews';
import { StoryDialogPanel } from './components/StoryDialogPanel';
import { SqlEditorPanel } from './components/SqlEditorPanel';
import { QueryResultPanel } from './components/QueryResultPanel';
import { SchemaBrowser } from './components/SchemaBrowser';
import { MissionModal } from './components/MissionModal';
import { SettingsModal } from './components/SettingsModal';
import { HintModal } from './components/HintModal';
import { SupportedLanguage, UI_TRANSLATIONS, getMissionI18n } from './services/i18n';
import { BookOpen, DatabaseBackup, Lightbulb } from 'lucide-react';

export const App: React.FC = () => {
  const [dbReady, setDbReady] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);
  const [activeNavTab, setActiveNavTab] = useState<NavTabId>(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab') as NavTabId | null;
    return tab && ['home', 'console', 'codex', 'stats', 'achievements'].includes(tab)
      ? tab
      : 'home';
  });
  const [saveState, setSaveState] = useState<SaveState>(() => {
    const state = loadSaveState();
    const params = new URLSearchParams(window.location.search);
    const langParam = params.get('lang') as SupportedLanguage | null;
    if (langParam === 'ko' || langParam === 'de') {
      state.settings.language = langParam;
    }
    return state;
  });
  const [schemas, setSchemas] = useState<TableSchemaInfo[]>([]);

  const currentMission = useMemo(
    () =>
      CURRICULUM_MISSIONS.find((m) => m.missionId === saveState.currentMissionId) ||
      CURRICULUM_MISSIONS[0],
    [saveState.currentMissionId]
  );

  const currentChapter = useMemo(
    () =>
      CHAPTERS_DATA.find((c) => c.chapterId === currentMission.chapterId) ||
      CHAPTERS_DATA[0],
    [currentMission.chapterId]
  );

  const lang: SupportedLanguage = saveState.settings.language || 'de';
  const t = UI_TRANSLATIONS[lang];

  const [editorQuery, setEditorQuery] = useState<string>(() =>
    getMissionI18n(currentMission.missionId, lang).starterQuery
  );
  const [queryResult, setQueryResult] = useState<QueryExecutionResult | null>(null);
  const [missionValidation, setMissionValidation] = useState<{
    passed: boolean;
    feedback: string;
    rewardXp?: number;
    hasNextMission?: boolean;
  } | null>(null);

  const [isMissionModalOpen, setIsMissionModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isHintModalOpen, setIsHintModalOpen] = useState(false);

  const handleToggleLanguage = useCallback(() => {
    setSaveState((prev) => {
      const currentL = prev.settings.language || 'de';
      const nextLang: SupportedLanguage = currentL === 'de' ? 'ko' : 'de';
      const prevStarter = getMissionI18n(prev.currentMissionId, currentL).starterQuery;
      setEditorQuery((q) => {
        if (!q || q.trim() === prevStarter.trim() || q.includes('Citizens')) {
          return getMissionI18n(prev.currentMissionId, nextLang).starterQuery;
        }
        return q;
      });
      return {
        ...prev,
        settings: {
          ...prev.settings,
          language: nextLang,
        },
      };
    });
  }, []);

  const refreshSchemas = useCallback(() => {
    if (!sqlEngine.isReady()) return;
    setSchemas(sqlEngine.getAllTableSchemas());
  }, []);

  useEffect(() => {
    let mounted = true;
    sqlEngine
      .init(`${import.meta.env.BASE_URL}sql-wasm.wasm`)
      .then(() => {
        if (!mounted) return;
        setDbReady(true);
        refreshSchemas();
        const initialPreview = sqlEngine.executeQuery(
          'SELECT * FROM Citizens LIMIT 20;'
        );
        if (initialPreview.success) {
          setQueryResult(initialPreview);
        }
      })
      .catch((err) => {
        if (!mounted) return;
        setDbError(err instanceof Error ? err.message : String(err));
      });
    return () => {
      mounted = false;
    };
  }, [refreshSchemas]);

  useEffect(() => {
    soundService.setSoundEnabled(saveState.settings.soundEnabled);
    soundService.setBgmEnabled(saveState.settings.bgmEnabled);
    if (saveState.settings.autoSave) {
      saveGameState(saveState);
    }
  }, [saveState]);

  const selectMission = useCallback(
    (missionId: number) => {
      const target =
        CURRICULUM_MISSIONS.find((m) => m.missionId === missionId) ||
        CURRICULUM_MISSIONS[0];

      // Enforce stage lock: Can only play up to completed + 1
      const maxAllowed = saveState.completedMissionIds.length + 1;
      if (target.stageOrder > maxAllowed) {
        return;
      }

      setSaveState((prev) => ({
        ...prev,
        currentMissionId: target.missionId,
        currentChapterId: target.chapterId,
      }));
      setEditorQuery(getMissionI18n(target.missionId, lang).starterQuery);
      setMissionValidation(null);
      if (sqlEngine.isReady()) {
        const targetTable = target.targetTables[0] || 'Citizens';
        const preview = sqlEngine.executeQuery(
          `SELECT * FROM ${targetTable} LIMIT 20;`
        );
        setQueryResult(preview.success ? preview : null);
      } else {
        setQueryResult(null);
      }
    },
    [saveState.completedMissionIds]
  );

  const handleExecuteQuery = useCallback(
    (customSql?: string) => {
      if (!dbReady) return;
      const sqlToRun = customSql !== undefined ? customSql : editorQuery;
      const res = sqlEngine.executeQuery(sqlToRun, lang);
      setQueryResult(res);
      refreshSchemas();

      if (!res.success) {
        soundService.playError();
        setMissionValidation({
          passed: false,
          feedback: t.queryErrorFeedback,
        });
        return;
      }

      const checkRunner = (checkSql: string) => sqlEngine.executeQuery(checkSql);
      const validation = currentMission.validate(res, checkRunner);
      const hasNext = currentMission.missionId < CURRICULUM_MISSIONS.length;

      setMissionValidation({
        passed: validation.passed,
        feedback: validation.feedback,
        rewardXp: currentMission.rewardXp,
        hasNextMission: hasNext,
      });

      if (validation.passed) {
        soundService.playMissionSuccess();
        sqlEngine.executeQuery(
          `UPDATE Missions SET status = 'COMPLETED' WHERE mission_id = ${currentMission.missionId};`
        );
        if (currentMission.unlockedEvidenceCode) {
          sqlEngine.executeQuery(
            `UPDATE Evidence SET is_unlocked = 1 WHERE evidence_code = '${currentMission.unlockedEvidenceCode}';`
          );
        }
        refreshSchemas();

        setSaveState((prev) => {
          const alreadyDone = prev.completedMissionIds.includes(
            currentMission.missionId
          );
          const nextCompleted = alreadyDone
            ? prev.completedMissionIds
            : [...prev.completedMissionIds, currentMission.missionId];
          const nextEvidence =
            currentMission.unlockedEvidenceCode &&
            !prev.unlockedEvidenceCodes.includes(
              currentMission.unlockedEvidenceCode
            )
              ? [...prev.unlockedEvidenceCodes, currentMission.unlockedEvidenceCode]
              : prev.unlockedEvidenceCodes;

          return {
            ...prev,
            completedMissionIds: nextCompleted,
            unlockedEvidenceCodes: nextEvidence,
            xp: alreadyDone ? prev.xp : prev.xp + currentMission.rewardXp,
            queryHistory: [
              {
                query: sqlToRun,
                timestamp: new Date().toISOString(),
                success: true,
              },
              ...prev.queryHistory.slice(0, 29),
            ],
          };
        });
      } else {
        soundService.playQueryRun();
      }
    },
    [currentMission, dbReady, editorQuery, refreshSchemas]
  );

  const handlePreviewTable = useCallback(
    (tableName: string) => {
      if (!dbReady) return;
      const previewSql = `SELECT * FROM ${tableName} LIMIT 20;`;
      const res = sqlEngine.executeQuery(previewSql);
      setQueryResult(res);
      setMissionValidation(null);
    },
    [dbReady]
  );

  const handleResetDb = useCallback(() => {
    if (!dbReady) return;
    sqlEngine.resetDatabase();
    refreshSchemas();
    setQueryResult(null);
    setMissionValidation({
      passed: false,
      feedback: t.dbResetSuccessFeedback,
    });
  }, [dbReady, refreshSchemas, t.dbResetSuccessFeedback]);

  const handleInspectObject = useCallback((obj: InvestigatableObject) => {
    setSaveState((prev) => ({
      ...prev,
      inspectedObjectIds: prev.inspectedObjectIds.includes(obj.id)
        ? prev.inspectedObjectIds
        : [...prev.inspectedObjectIds, obj.id],
    }));
  }, []);

  const evidenceRows = useMemo(() => {
    if (!dbReady) return [];
    const res = sqlEngine.executeQuery(
      'SELECT evidence_id, evidence_code, title, category, summary, is_unlocked FROM Evidence ORDER BY evidence_id ASC;'
    );
    if (!res.success) return [];
    return res.rows.map((r) => ({
      evidence_id: Number(r[0]),
      evidence_code: String(r[1]),
      title: String(r[2]),
      category: String(r[3]),
      summary: String(r[4]),
      is_unlocked: Number(r[5]),
    }));
  }, [dbReady, schemas, saveState.unlockedEvidenceCodes]);

  if (dbError) {
    return (
      <div className="loading-screen">
        <div className="error-diagnosis-card">
          <h2>{t.sqliteLoadError}</h2>
          <p>{dbError}</p>
        </div>
      </div>
    );
  }

  if (!dbReady) {
    return (
      <div className="loading-screen">
        <div className="cyber-spinner" />
        <p className="loading-title">INITIALIZING SQLITE WASM ENGINE...</p>
        <span className="loading-sub">{t.loadingEngineSub}</span>
      </div>
    );
  }

  return (
    <div className="app-root">
      {/* 상단 통합 GNB 네비게이션 바 (홈 / 수사 콘솔 / 도감 / 통계 / 업적 / 프로필 / 설정) */}
      <TopNavBar
        activeTab={activeNavTab}
        xp={saveState.xp}
        completedCount={saveState.completedMissionIds.length}
        soundEnabled={saveState.settings.soundEnabled}
        language={lang}
        onSelectTab={(tab) => {
          setActiveNavTab(tab);
        }}
        onToggleSound={() =>
          setSaveState((prev) => ({
            ...prev,
            settings: {
              ...prev.settings,
              soundEnabled: !prev.settings.soundEnabled,
            },
          }))
        }
        onToggleLanguage={handleToggleLanguage}
        onOpenSettings={() => {
          setIsSettingsModalOpen(true);
        }}
      />

      {activeNavTab === 'home' && (
        <MainMenu
          hasSave={hasSavedGame()}
          currentMissionId={currentMission.missionId}
          completedMissionIds={saveState.completedMissionIds}
          xp={saveState.xp}
          language={lang}
          onStartNewGame={() => {
            sqlEngine.resetDatabase();
            refreshSchemas();
            const fresh: SaveState = {
              ...getDefaultSaveState(),
              settings: {
                ...getDefaultSaveState().settings,
                language: lang,
              },
            };
            setSaveState(fresh);
            saveGameState(fresh);
            setEditorQuery(getMissionI18n(1, lang).starterQuery);
            setQueryResult(null);
            setMissionValidation(null);
            setActiveNavTab('console');
          }}
          onContinueGame={() => {
            setEditorQuery(getMissionI18n(currentMission.missionId, lang).starterQuery);
            setActiveNavTab('console');
          }}
          onSelectMissionDirect={(mId) => {
            selectMission(mId);
            setActiveNavTab('console');
          }}
          onOpenSettings={() => {
            setIsSettingsModalOpen(true);
          }}
        />
      )}

      {(activeNavTab === 'codex' ||
        activeNavTab === 'stats' ||
        activeNavTab === 'achievements') && (
        <SubMenuViews
          mode={activeNavTab}
          saveState={saveState}
          schemas={schemas}
          evidenceRows={evidenceRows}
          language={lang}
          onJumpToConsoleWithQuery={(sql) => {
            setEditorQuery(sql);
            setActiveNavTab('console');
            if (dbReady) {
              const res = sqlEngine.executeQuery(sql);
              setQueryResult(res);
              setMissionValidation(null);
            }
          }}
        />
      )}

      {activeNavTab === 'console' && (
        <div className="game-workspace">
          {/* 수사 콘솔 보조 상태 바 */}
          <div className="console-subbar">
            <div className="console-subbar-left">
              <span className="hud-chapter-badge">{currentChapter.code}</span>
              <span className="mission-stage-badge">
                STAGE 0{currentMission.stageOrder}
              </span>
              <strong className="mission-pill-title">
                {getMissionI18n(currentMission.missionId, lang).title}
              </strong>
              <span className="stage-concept-pill">
                {getMissionI18n(currentMission.missionId, lang).conceptBadge}
              </span>
            </div>

            <div className="console-subbar-right">
              <button
                type="button"
                className="cyber-btn cyber-btn-secondary cyber-btn-xs"
                onClick={() => {
                  setIsMissionModalOpen(true);
                }}
              >
                <BookOpen size={14} />
                <span>
                  {t.missionsAndEvidence} ({saveState.completedMissionIds.length}/10)
                </span>
              </button>

              {/* 💡 Emergency Hint Button */}
              <button
                type="button"
                className="cyber-btn cyber-btn-secondary cyber-btn-xs hint-subbar-btn"
                onClick={() => setIsHintModalOpen(true)}
                title={t.emergencyHintTitle}
              >
                <Lightbulb size={14} className="text-amber" />
                <span>{t.emergencyHintBtn}</span>
              </button>

              <button
                type="button"
                className="cyber-btn cyber-btn-ghost cyber-btn-xs"
                onClick={handleResetDb}
                title={t.resetDbTitle}
              >
                <DatabaseBackup size={14} />
                <span>{t.resetDbBtn}</span>
              </button>
            </div>
          </div>

          <main className="workspace-grid">
            {/* 1열(좌측): 스테이지 바 + 독립 탭(미션 / 가이드북 / 스토리 / 단서) */}
            <StoryDialogPanel
              chapter={currentChapter}
              mission={currentMission}
              isMissionCompleted={saveState.completedMissionIds.includes(
                currentMission.missionId
              )}
              inspectedObjectIds={saveState.inspectedObjectIds}
              language={lang}
              onInspectObject={handleInspectObject}
              onLoadSuggestedQuery={(sql) => {
                setEditorQuery(sql);
              }}
              onPreviewTable={handlePreviewTable}
              onSelectMission={selectMission}
              completedMissionIds={saveState.completedMissionIds}
              allMissions={CURRICULUM_MISSIONS}
            />

            {/* 2열(중앙, 결과 테이블 왼쪽): 상단 SQL 터미널 + 하단 세로형 DB 빠른 조회 */}
            <div className="center-workbench">
              <SqlEditorPanel
                query={editorQuery}
                fontSize={saveState.settings.editorFontSize}
                language={lang}
                onChangeQuery={setEditorQuery}
                onExecuteQuery={() => handleExecuteQuery()}
                onResetStarterQuery={() => {
                  setEditorQuery(
                    getMissionI18n(currentMission.missionId, lang).starterQuery
                  );
                }}
              />

              <SchemaBrowser
                schemas={schemas}
                targetTables={currentMission.targetTables}
                language={lang}
                onPreviewTable={handlePreviewTable}
                onInsertIdentifier={(ident) => {
                  setEditorQuery(
                    (prev) => `${prev}${prev.endsWith(' ') ? '' : ' '}${ident}`
                  );
                }}
              />
            </div>

            {/* 3열(우측 전체 세로뷰): 쿼리 실행 결과 테이블 */}
            <QueryResultPanel
              result={queryResult}
              language={lang}
              missionValidation={missionValidation}
              onProceedNextMission={() => {
                const nextId = Math.min(
                  CURRICULUM_MISSIONS.length,
                  currentMission.missionId + 1
                );
                selectMission(nextId);
              }}
            />
          </main>
        </div>
      )}

      {/* 긴급 수사 힌트 모달 */}
      <HintModal
        isOpen={isHintModalOpen}
        mission={currentMission}
        language={lang}
        onClose={() => setIsHintModalOpen(false)}
        onApplyQuery={(sql) => setEditorQuery(sql)}
      />

      <MissionModal
        isOpen={isMissionModalOpen}
        currentMissionId={currentMission.missionId}
        completedMissionIds={saveState.completedMissionIds}
        unlockedEvidenceCodes={saveState.unlockedEvidenceCodes}
        evidenceRows={evidenceRows}
        language={lang}
        onSelectMission={(mId) => {
          selectMission(mId);
          setActiveNavTab('console');
        }}
        onClose={() => setIsMissionModalOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        saveState={saveState}
        onUpdateSettings={(partial) =>
          setSaveState((prev) => ({
            ...prev,
            settings: { ...prev.settings, ...partial },
          }))
        }
        onExportSave={() => exportSaveToJson(saveState)}
        onImportSave={(imported) => {
          setSaveState(imported);
          saveGameState(imported);
          selectMission(imported.currentMissionId || 1);
          setIsSettingsModalOpen(false);
        }}
        onResetAllProgress={() => {
          clearSavedGame();
          sqlEngine.resetDatabase();
          refreshSchemas();
          const fresh: SaveState = {
            ...getDefaultSaveState(),
            settings: {
              ...getDefaultSaveState().settings,
              language: lang,
            },
          };
          setSaveState(fresh);
          setEditorQuery(getMissionI18n(1, lang).starterQuery);
          setQueryResult(null);
          setMissionValidation(null);
          setIsSettingsModalOpen(false);
        }}
        onClose={() => setIsSettingsModalOpen(false)}
      />
    </div>
  );
};

export default App;

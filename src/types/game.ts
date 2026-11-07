import { QueryExecutionResult } from './database';

export type SqlStageId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface DialogueLine {
  id: string;
  speakerId: string;
  speakerName: string;
  speakerRole: string;
  avatarType: 'aria' | 'kyle' | 'zero' | 'elena' | 'system' | 'jhin' | 'player';
  text: string;
  sqlTip?: string;
}

export interface InvestigatableObject {
  id: string;
  name: string;
  locationName: string;
  icon: 'terminal' | 'server' | 'badge' | 'document' | 'cctv' | 'vault';
  shortDesc: string;
  inspectionReport: string;
  relatedTable: string;
  suggestedQuery: string;
  unlocksClueText: string;
}

export interface SqlMission {
  missionId: number;
  chapterId: number;
  stageOrder: SqlStageId;
  themeId: 1 | 2;
  themeStageOrder: 1 | 2 | 3 | 4 | 5;
  codeName: string;
  title: string;
  sqlConcept: string;
  conceptBadge: string;
  briefing: string;
  objectiveSummary: string;
  targetTables: string[];
  starterQuery: string;
  hints: [string, string, string];
  referenceQuery: string;
  rewardXp: number;
  unlockedEvidenceCode?: string;
  successStoryDialogue: DialogueLine[];
  validate: (userResult: QueryExecutionResult, runCheckQuery: (sql: string) => QueryExecutionResult) => {
    passed: boolean;
    feedback: string;
  };
}

export interface ChapterData {
  chapterId: number;
  code: string;
  title: string;
  subtitle: string;
  synopsis: string;
  locationSector: string;
  introDialogues: DialogueLine[];
  objects: InvestigatableObject[];
  missionIds: number[];
}

export interface SaveState {
  version: string;
  playerName: string;
  currentChapterId: number;
  currentMissionId: number;
  completedMissionIds: number[];
  inspectedObjectIds: string[];
  unlockedEvidenceCodes: string[];
  xp: number;
  queryHistory: { query: string; timestamp: string; success: boolean }[];
  settings: {
    soundEnabled: boolean;
    bgmEnabled: boolean;
    editorFontSize: number;
    autoSave: boolean;
    language: 'de' | 'ko';
  };
  lastSavedAt: string;
}

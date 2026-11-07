import { SaveState } from '../types/game';

const STORAGE_KEY = 'PROJECT_DATABASE_ZERO_SAVE_V1';

export function getDefaultSaveState(): SaveState {
  return {
    version: '1.0.0',
    playerName: 'Ezreal',
    currentChapterId: 1,
    currentMissionId: 1,
    completedMissionIds: [],
    inspectedObjectIds: [],
    unlockedEvidenceCodes: ['EV-001'],
    xp: 0,
    queryHistory: [],
    settings: {
      soundEnabled: true,
      bgmEnabled: false,
      editorFontSize: 14,
      autoSave: true,
      language: 'de',
    },
    lastSavedAt: new Date().toISOString(),
  };
}

export function hasSavedGame(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== null;
  } catch {
    return false;
  }
}

export function loadSaveState(): SaveState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultSaveState();
    const parsed = JSON.parse(raw) as Partial<SaveState>;
    const defaults = getDefaultSaveState();
    return {
      ...defaults,
      ...parsed,
      settings: {
        ...defaults.settings,
        ...(parsed.settings || {}),
      },
    };
  } catch {
    return getDefaultSaveState();
  }
}

export function saveGameState(state: SaveState): void {
  try {
    const updated: SaveState = {
      ...state,
      lastSavedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // ignore storage quota errors
  }
}

export function clearSavedGame(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function exportSaveToJson(state: SaveState): void {
  const dataStr = JSON.stringify(state, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `database-zero-save-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

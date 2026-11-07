const AUDIO_PATHS = {
  click: '/assets/audio/sfx_click.ogg',
  queryRun: '/assets/audio/sfx_query_run.ogg',
  scanObject: '/assets/audio/sfx_scan_object.ogg',
  missionSuccess: '/assets/audio/sfx_mission_success.ogg',
  error: '/assets/audio/sfx_error.ogg',
  doorOpen: '/assets/audio/sfx_door_open.ogg',
  bgm: '/assets/music/bgm_cyberpunk_investigation.ogg',
} as const;

class SoundService {
  private ctx: AudioContext | null = null;
  private soundEnabled = true;
  private bgmEnabled = false;
  private bgmAudio: HTMLAudioElement | null = null;
  private sfxCache: Map<string, HTMLAudioElement> = new Map();

  private playOggOrFallback(src: string, volume: number, fallbackFn: () => void) {
    if (!this.soundEnabled || typeof window === 'undefined') return;
    try {
      if (typeof Audio !== 'undefined') {
        let base = this.sfxCache.get(src);
        if (!base) {
          base = new Audio(src);
          base.preload = 'auto';
          this.sfxCache.set(src, base);
        }
        const clone = base.cloneNode(true) as HTMLAudioElement;
        clone.volume = volume;
        const p = clone.play();
        if (p && typeof p.catch === 'function') {
          p.catch(() => fallbackFn());
        }
        return;
      }
    } catch {
      // Fallback to Web Audio synth if HTMLAudioElement is blocked
    }
    fallbackFn();
  }

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  setBgmEnabled(enabled: boolean) {
    this.bgmEnabled = enabled;
    if (enabled) {
      this.startBgm();
    } else {
      this.stopBgm();
    }
  }

  playClick() {
    // 메뉴 및 UI 버튼 클릭 시 효과음 비활성화 (사용자 요청 반영)
  }

  playScanObject() {
    // 오브젝트/메뉴 클릭 시 효과음 비활성화
  }

  playDoorOpen() {
    // 모달/메뉴 전환 시 효과음 비활성화
  }

  playQueryRun() {
    // 쿼리 실행 및 콘솔 불러오기 시 불필요한 효과음 비활성화
  }

  playMissionSuccess() {
    // 미션 성공 및 쿼리 재실행 시 효과음 비활성화
  }

  playError() {
    // 오류 시 효과음 비활성화
  }

  startBgm() {
    if (!this.bgmEnabled || typeof window === 'undefined') return;
    try {
      if (!this.bgmAudio && typeof Audio !== 'undefined') {
        this.bgmAudio = new Audio(AUDIO_PATHS.bgm);
        this.bgmAudio.loop = true;
        this.bgmAudio.volume = 0.28;
      }
      if (this.bgmAudio) {
        const p = this.bgmAudio.play();
        if (p && typeof p.catch === 'function') {
          p.catch(() => {});
        }
      }
    } catch {
      // ignore autoplay block until user interaction
    }
  }

  stopBgm() {
    if (!this.bgmAudio) return;
    try {
      this.bgmAudio.pause();
      this.bgmAudio.currentTime = 0;
    } catch {
      // ignore
    }
  }
}

export const soundService = new SoundService();

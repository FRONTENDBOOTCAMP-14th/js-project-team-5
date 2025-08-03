class AudioManager {
  constructor() {
    if (AudioManager._instance) return AudioManager._instance;

    this.audio = null;
    this.iconEl = null;
    this.btnEl = null;

    AudioManager._instance = this;
  }

  setSource(src) {
    if (this.audio) this.audio.pause();
    this.audio = new Audio(src);
    this.audio.loop = true;
  }

  setUI({ iconSelector, buttonSelector }) {
    this.iconEl = document.querySelector(iconSelector);
    this.btnEl = document.querySelector(buttonSelector);

    if (this.btnEl) {
      this.btnEl.addEventListener('click', () => {
        this.toggleWithUI();
      });
    }

    // === UI 상태 동기화 추가 ===
    const isMuted = sessionStorage.getItem('isMuted') === 'true';
    if (this.audio) {
      if (isMuted && !this.audio.paused) {
        this.audio.pause();
      } else if (!isMuted && this.audio.paused) {
        this.audio.play().catch(() => {});
      }
    }

    if (isMuted) {
      this.muteSfx();
      if (this.iconEl && this.btnEl) {
        this.iconEl.src = '/assets/icons/sound-off.svg';
        this.iconEl.alt = '사운드 꺼짐';
        this.btnEl.setAttribute('aria-label', '사운드 켜기');
      }
    } else {
      this.unmuteSfx();
      if (this.iconEl && this.btnEl) {
        this.iconEl.src = '/assets/icons/sound-on.svg';
        this.iconEl.alt = '사운드 켜짐';
        this.btnEl.setAttribute('aria-label', '사운드 끄기');
      }
    }
  }

  play() {
    this.audio?.play();
  }

  pause() {
    this.audio?.pause();
  }

  isPlaying() {
    return this.audio && !this.audio.paused;
  }

  toggle() {
    if (!this.audio) return false;

    if (this.isPlaying()) {
      this.pause();
      return false;
    } else {
      this.play();
      return true;
    }
  }

  // ✅ UI 토글도 포함된 메서드
  toggleWithUI() {
    const isNowPlaying = this.toggle();

    // 상태 저장 (isMuted: true면 음소거)
    sessionStorage.setItem('isMuted', String(!isNowPlaying));

    if (this.iconEl && this.btnEl) {
      if (isNowPlaying) {
        this.iconEl.src = '/assets/icons/sound-on.svg';
        this.iconEl.alt = '사운드 켜짐';
        this.btnEl.setAttribute('aria-label', '사운드 끄기');
        this.unmuteSfx();
      } else {
        this.iconEl.src = '/assets/icons/sound-off.svg';
        this.iconEl.alt = '사운드 꺼짐';
        this.btnEl.setAttribute('aria-label', '사운드 켜기');
        this.muteSfx();
      }
    }
  }

  // SFX 관련 메서드
  setSfx(sfxList) {
    this.sfxList = sfxList; // 배열 또는 객체로 여러 SFX 등록
  }

  muteSfx() {
    if (!this.sfxList) return;
    Object.values(this.sfxList).forEach((sfx) => {
      sfx.volume = 0;
    });
  }

  unmuteSfx() {
    if (!this.sfxList) return;
    Object.values(this.sfxList).forEach((sfx) => {
      sfx.volume = sfx.defaultVolume ?? 0.2;
    });
  }
}

const audioManager = new AudioManager();
export default audioManager;

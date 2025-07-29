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

    if (this.iconEl && this.btnEl) {
      if (isNowPlaying) {
        this.iconEl.src = '/assets/icons/sound-on.svg';
        this.iconEl.alt = '사운드 켜짐';
        this.btnEl.setAttribute('aria-label', '사운드 끄기');
      } else {
        this.iconEl.src = '/assets/icons/sound-off.svg';
        this.iconEl.alt = '사운드 꺼짐';
        this.btnEl.setAttribute('aria-label', '사운드 켜기');
      }
    }
  }
}

const audioManager = new AudioManager();
export default audioManager;

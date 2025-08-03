import audioManager from '/src/scripts/audiomanager.js';

/* =========================
   BGM(배경음악) 관련 코드
========================= */

// BGM AudioManager 설정
const BGM_SRC = '/assets/audio/bgm/main-XRayVision-Slynk.mp3';
const bgmRange = document.getElementById('bgm-range');
const progressBgmFill = bgmRange?.closest('.bgm-slider-custom')?.querySelector('.progress-fill');

let bgmVolume = localStorage.getItem('bgmVolume');
if (bgmVolume === null) bgmVolume = 0.3;
else bgmVolume = Number(bgmVolume);

// BGM이 다르거나, 아직 재생 중이 아니면만 setSource/재생
if (!audioManager.audio || !audioManager.audio.src.endsWith(BGM_SRC) || audioManager.audio.paused || audioManager.audio.ended) {
  audioManager.setSource(BGM_SRC);
  audioManager.audio.volume = bgmVolume;
  audioManager.play();
}

audioManager.setUI({
  iconSelector: '#soundIcon',
  buttonSelector: '#soundToggleBtn',
});

// BGM 볼륨 슬라이더 이벤트
if (bgmRange) {
  bgmRange.value = bgmVolume * 100;
  updateProgressFill(progressBgmFill, bgmRange.value);

  bgmRange.addEventListener('input', (e) => {
    const value = e.target.value;
    audioManager.audio.volume = value / 100;
    updateProgressFill(progressBgmFill, value);
    localStorage.setItem('bgmVolume', value / 100);
  });
}

/* =========================
   효과음(SFX) 관련 코드
========================= */

// 클릭 효과음 객체
const clickSfx = new Audio('/assets/audio/sfx/click.wav');

let sfxVolume = localStorage.getItem('sfxVolume');
if (sfxVolume === null) sfxVolume = 0.2;
else sfxVolume = Number(sfxVolume);
clickSfx.volume = sfxVolume;

// 효과음의 원래 볼륨 저장
clickSfx.defaultVolume = sfxVolume;

// audioManager에 등록
audioManager.setSfx({ clickSfx });

const sfxRange = document.getElementById('sfx-range');
const progressSfxFill = sfxRange?.closest('.sfx-slider-custom')?.querySelector('.progress-fill');

// SFX 볼륨 슬라이더 이벤트
if (sfxRange) {
  sfxRange.value = sfxVolume * 100;
  updateProgressFill(progressSfxFill, sfxRange.value);

  sfxRange.addEventListener('input', (e) => {
    const value = e.target.value;
    clickSfx.volume = value / 100;
    updateProgressFill(progressSfxFill, value);
    localStorage.setItem('sfxVolume', value / 100);
  });
}

// 인터랙티브 요소 판별 함수
// TODO: 새로운 interactive 요소가 생기면 이 배열에 추가하기
const INTERACTIVE_SELECTOR = ['button', 'a', 'input', 'label', '.card', '.card-wrapper', '[role="button"]'].join(',');

function isInteractiveElement(el) {
  return el.closest(INTERACTIVE_SELECTOR);
}

// monitor-frame 내 상호작용 효과음
const monitorFrame = document.querySelector('.monitor-frame');
const mainStart = monitorFrame?.querySelector('.main-start');

if (monitorFrame) {
  // 클릭 효과음
  monitorFrame.addEventListener('click', (e) => {
    if (isInteractiveElement(e.target)) {
      clickSfx.currentTime = 0;
      clickSfx.play();
    }
  });

  // 키보드로 Enter/Space로 활성화 시 효과음
  monitorFrame.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && isInteractiveElement(e.target)) {
      clickSfx.currentTime = 0;
      clickSfx.play();
    }
  });

  // mainStart가 있을 때만 이벤트 등록
  if (mainStart) {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        clickSfx.currentTime = 0;
        clickSfx.play();
      }
    });
  }
}

/* =========================
   공통 유틸 함수
========================= */

function updateProgressFill(fillEl, value) {
  if (fillEl) {
    fillEl.style.width = `${value}%`;
  }
}

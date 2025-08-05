import audioManager from '/src/scripts/audiomanager.js';

const quizContainer = document.querySelector('.quiz-container');

initAudio();

quizContainer.addEventListener('click', (e) => {
  const button = e.target.closest('button');
  if (!button) return;
  e.preventDefault();

  if (button.classList.contains('quiz-exit-btn')) {
    window.loadHTML('/src/pages/game-landing/quiz-landing.html');
  } else if (button.classList.contains('quiz-focus-on-btn')) {
    alert('집중 모드는 곧 찾아옵니다! 커밍순😄');
    // window.loadHTML('/src/pages/game-quiz/quiz-focus-on.html');
  } else if (button.classList.contains('quiz-time-attack-btn')) {
    window.loadHTML('/src/pages/game-quiz/quiz-time-attack.html');
  }
});

// 타이틀 애니메이션 끝나면 버튼 페이드인
const title = quizContainer.querySelector('.quiz-title');
const buttons = quizContainer.querySelectorAll('.quiz-time-attack-btn, .quiz-focus-on-btn');
const exitBtn = quizContainer.querySelector('.quiz-exit-btn');

if (title) {
  title.addEventListener('animationend', () => {
    buttons.forEach((btn) => btn.classList.add('fade-in-up'));
    exitBtn.classList.add('fade-in');
  });
}

/**
 * 오디오 매니저 초기화하고, 볼륨 설정
 */
function initAudio() {
  let bgmVolume = localStorage.getItem('bgmVolume');
  if (bgmVolume === null) bgmVolume = 0.3;
  audioManager.setSource('/assets/audio/bgm/quiz-WildPogo-Francis-Preve.mp3');
  audioManager.audio.volume = bgmVolume;

  // === 뮤트 상태 동기화 ===
  const isMuted = sessionStorage.getItem('isMuted') === 'true';
  if (isMuted) {
    audioManager.audio.pause();
  } else {
    audioManager.audio.play();
  }
}

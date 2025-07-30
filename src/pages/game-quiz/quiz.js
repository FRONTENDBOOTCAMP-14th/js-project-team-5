import audioManager from '/src/scripts/audiomanager.js';
// import { loadHTML } from '/src/components/window/controlWindow.js';

// 게임 시작 전 오디오 볼륨 일치 시키기 위한 코드(임시)
let volume = localStorage.getItem('quizVolume');
if (volume === null) {
  volume = 0.3; // Default volume
}

audioManager.setSource('/assets/audio/bgm/quiz-WildPogo-Francis-Preve.mp3');
audioManager.audio.volume = volume;
audioManager.play();

audioManager.setUI({
  iconSelector: '#soundIcon',
  buttonSelector: '#soundToggleBtn',
});

const quizContainer = document.querySelector('.quiz-container');

quizContainer.addEventListener('click', (e) => {
  const button = e.target.closest('button');
  if (!button) return;
  e.preventDefault();

  // 페이지 연결은 추후에 다시 연결할 예정
  if (button.classList.contains('quiz-exit-btn')) {
    // loadHTML('/src/pages/game-landing/quiz-landing.html');
  } else if (button.classList.contains('quiz-focus-on-btn')) {
    // loadHTML('/src/pages/game-quiz/quiz-focus-on.html');
  } else if (button.classList.contains('quiz-time-attack-btn')) {
    // loadHTML('/src/pages/game-quiz/quiz-time-attack.html');
  }
});

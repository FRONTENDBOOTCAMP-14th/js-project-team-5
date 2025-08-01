import audioManager from '/src/scripts/audiomanager.js';
import { loadHTML } from '/src/components/monitor/controlMonitor.js';

const quizContainer = document.querySelector('.quiz-container');

initAudio();

quizContainer.addEventListener('click', (e) => {
  const button = e.target.closest('button');
  if (!button) return;
  e.preventDefault();

  // 페이지 연결은 추후에 다시 연결할 예정
  if (button.classList.contains('quiz-exit-btn')) {
    loadHTML('/src/pages/game-landing/quiz-landing.html');
  } else if (button.classList.contains('quiz-focus-on-btn')) {
    loadHTML('/src/pages/game-quiz/quiz-focus-on.html');
  } else if (button.classList.contains('quiz-time-attack-btn')) {
    loadHTML('/src/pages/game-quiz/quiz-time-attack.html');
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
 * 오디오 매니저 초기화하고, 볼륨 및 UI를 설정
 */
function initAudio() {
  let volume = localStorage.getItem('quizVolume');
  if (volume === null) volume = 0.3;
  audioManager.setSource('/assets/audio/bgm/quiz-WildPogo-Francis-Preve.mp3');
  audioManager.audio.volume = volume;
  audioManager.play();
  audioManager.setUI({
    iconSelector: '#soundIcon',
    buttonSelector: '#soundToggleBtn',
  });
}

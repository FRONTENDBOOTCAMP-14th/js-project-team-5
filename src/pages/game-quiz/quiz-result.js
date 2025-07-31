import audioManager from '/src/scripts/audiomanager.js';
// import { loadHTML } from '/src/components/window/controlWindow.js';

const result = JSON.parse(sessionStorage.getItem('quizResult'));

// 다시하기 버튼 클릭 시, 이동할 페이지 경로 설정
const LOAD_URL = result.mode === 'time-attack' ? '/src/pages/game-quiz/quiz-time-attack.html' : '/src/pages/game-quiz/quiz-focus-on.html';

const quizContainer = document.querySelector('.quiz-container.result');
const scoreText = document.getElementById('score');
const totalText = document.getElementById('total');
const correctText = document.getElementById('correct');
const resultButtons = quizContainer.querySelector('.quiz-result-buttons');

initAudio();
initResult();

resultButtons.addEventListener('click', (e) => {
  const button = e.target;
  if (button.classList.contains('retry-button')) {
    loadHTML(LOAD_URL);
  } else if (button.classList.contains('main-button')) {
    loadHTML('/src/pages/game-quiz/quiz-start.html');
  }
});

function initResult() {
  scoreText.textContent = result.score;
  totalText.textContent = result.total;
  correctText.textContent = result.correct;
}

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

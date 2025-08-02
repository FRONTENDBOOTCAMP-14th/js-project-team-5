import audioManager from '/src/scripts/audiomanager.js';
import { loadHTML } from '/src/components/monitor/controlMonitor.js';

const result = JSON.parse(sessionStorage.getItem('quizResult'));
// 효과음 관리
const gameOverSfx = new Audio('/assets/audio/sfx/quiz-game-over2.mp3');

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

/**
 * 결과 페이지의 점수, 총 문제 수, 정답 개수를 UI에 표시
 */
function initResult() {
  scoreText.textContent = result.score;
  totalText.textContent = result.total;
  correctText.textContent = result.correct;
}

/**
 * 오디오 매니저 초기화하고, 효과음 재생 후 배경음악을 재생
 */
function initAudio() {
  let bgmVolume = localStorage.getItem('bgmVolume');
  if (bgmVolume === null) bgmVolume = 0.3;
  else bgmVolume = Number(bgmVolume);

  let sfxVolume = localStorage.getItem('sfxVolume');
  if (sfxVolume === null) sfxVolume = 0.2;
  else sfxVolume = Number(sfxVolume);

  // 효과음의 원래 볼륨 저장
  gameOverSfx.defaultVolume = sfxVolume;

  // audioManager에 등록
  audioManager.setSfx({ gameOverSfx });

  if (volume === null) volume = 0.3;
  audioManager.setSource('/assets/audio/bgm/quiz-WildPogo-Francis-Preve.mp3');
  audioManager.audio.volume = bgmVolume;
  audioManager.setUI({
    iconSelector: '#soundIcon',
    buttonSelector: '#soundToggleBtn',
  });

  gameOverSfx.volume = sfxVolume;
  gameOverSfx.loop = false;
  gameOverSfx.playbackRate = 1.2;
  gameOverSfx.play();

  // 게임 오버 사운드가 끝나면 배경음악 재생
  gameOverSfx.onended = () => {
    audioManager.play();
  };
}

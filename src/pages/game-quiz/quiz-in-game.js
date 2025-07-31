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

// 카운트다운
const countdownEl = quizContainer.querySelector('.countdown-overlay');
let count = 5;

function showCountdown() {
  countdownEl.textContent = count;
  countdownEl.classList.remove('hide');
  const interval = setInterval(() => {
    count--;
    if (count > 0) {
      countdownEl.textContent = count;
    } else if (count === 0) {
      countdownEl.textContent = '시작!';
    } else {
      countdownEl.classList.add('hide');
      clearInterval(interval);
      // 게임 시작 로직 실행
    }
  }, 1000);
}

showCountdown();

function updateProgressBar(current, total) {
  const bar = quizContainer.querySelector('.progress-bar');
  const percent = (current / total) * 100;
  bar.style.setProperty('--progress', percent + '%');
  bar.style.setProperty('--progress-width', percent + '%');
}
// 예시: 15개 풀었을 때
updateProgressBar(15, 30);

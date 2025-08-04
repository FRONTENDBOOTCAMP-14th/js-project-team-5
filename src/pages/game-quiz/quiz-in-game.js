// 1. 모듈/상수/DOM 요소 선언
import audioManager from '/src/scripts/audiomanager.js';
import { handleQuizPause } from '/src/components/modal/pause-modal/quiz-pause.js';

// 효과음 관리
const correctSfx = new Audio('/assets/audio/sfx/quiz-correct.mp3');
const wrongSfx = new Audio('/assets/audio/sfx/quiz-wrong.mp3');

// 주요 DOM 요소
const quizContainer = document.querySelector('.quiz-container');
const scoreText = quizContainer.querySelector('.score-info span:first-child');
const timeText = quizContainer.querySelector('.score-info span:last-child');
const bar = quizContainer.querySelector('.progress-bar');
const questionContainer = quizContainer.querySelector('.quiz-question-container');
const progressTextQ = quizContainer.querySelector('.progress-text span:first-child');
const questionText = quizContainer.querySelector('.question-text');
const currentQ = quizContainer.querySelector('.current-question');
const typingInput = quizContainer.querySelector('.typing-input');
const pauseButton = document.querySelector('[data-type="pause"]');

// 2. 문제 데이터 경로 및 상태 변수 선언
const QUIZ_LIST_NORMAL = '/data/quiz-normal.json'; // 일반 모드
const QUIZ_LIST_DEV = '/data/quiz-dev.json'; // 개발자 모드

const savedMode = localStorage.getItem('dev-or-normal') || 'normal';
const QUIZ_LIST_SRC = savedMode === 'dev' ? QUIZ_LIST_DEV : QUIZ_LIST_NORMAL;

let generalQuizList = [];
let currentQuestion = 0;
let timer = 0;
let timerInterval = null;
let countdownInterval = null;
let countdownValue = null;
let isCountdownActive = false;
let correctCount = 0;
let score = 0;
let isGameActive = false;
let totalQuestions = 0;
let startTime = 0;
let comboCount = 0;

// 3. 초기화 및 이벤트 바인딩
cleanupQuizGame();
initQuizGame();

// 4. 입력 핸들러
function typingInputHandler(e) {
  if (!isGameActive) return;
  if (e.key === 'Enter' || e.key === ' ') {
    if (isCountdownActive) {
      e.preventDefault(); // 카운트다운 중이면 무시
      return;
    }
    if (!e.target.value.trim()) return;
    handleAnswer(e.target.value);
    e.target.value = '';
  }
}

// 5. 게임 상태 및 UI 초기화
function cleanupQuizGame() {
  clearInterval(timerInterval);
  clearInterval(countdownInterval);

  const countdownEl = quizContainer.querySelector('.countdown-overlay');
  if (countdownEl) {
    countdownEl.classList.add('hide');
    countdownEl.textContent = '';
  }

  if (typingInput) {
    typingInput.value = '';
    typingInput.disabled = false;
    typingInput.removeEventListener('keydown', typingInputHandler);
  }

  if (pauseButton) {
    pauseButton.removeEventListener('click', pauseGame);
  }

  isGameActive = false;
  currentQuestion = 0;
  correctCount = 0;
  score = 0;
  comboCount = 0;
  countdownValue = null;

  const comboEl = questionContainer?.querySelector('.combo-ui');
  if (comboEl) comboEl.remove();
}

// 6. 게임 시작 및 이벤트 바인딩
function initQuizGame() {
  if (typingInput) {
    typingInput.addEventListener('keydown', (e) => {
      if (e.key === ' ') e.preventDefault();
    });
    typingInput.removeEventListener('keydown', typingInputHandler);
    typingInput.addEventListener('keydown', typingInputHandler);
    typingInput.focus();
  }

  if (pauseButton) {
    pauseButton.removeEventListener('click', pauseGame);
    pauseButton.addEventListener('click', (e) => {
      e.preventDefault();
      pauseGame();
      const pauseDialog = document.querySelector('dialog[data-type="pause"]');
      if (pauseDialog) {
        handleQuizPause(pauseDialog, {
          continue: () => {
            resumeGame();
          },
          retry: () => {
            restartGame();
          },
          main: () => {
            goToMain();
          },
        });
      }
    });
  }

  initAudio();

  fetch(QUIZ_LIST_SRC)
    .then((response) => {
      if (!response.ok) throw new Error('문제 데이터를 불러오지 못했습니다.');
      return response.json();
    })
    .then((data) => {
      generalQuizList = shuffleQuestion(data);
      ({ totalQuestions, startTime } = initModeSettings());
      timer = startTime;
      showCountdown();
    })
    .catch(() => {
      // 게임이 이미 종료된 상태라면 alert를 띄우지 않음
      if (isGameActive) {
        alert('문제 데이터를 불러오는 데 실패했습니다.');
      }
      generalQuizList = [];
    });
}

// 7. 문제 배열 섞기
function shuffleQuestion(data) {
  for (let i = data.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [data[i], data[j]] = [data[j], data[i]];
  }
  return data;
}

// 8. 게임 시작
function startGame() {
  isGameActive = true;
  currentQuestion = 1;
  correctCount = 0;
  timer = startTime;
  updateProgressBar(currentQuestion, totalQuestions);
  updateTimeUI(timer);
  showQuestion();
  startTimer();
}

// 9. 타이머
function startTimer() {
  timerInterval = setInterval(() => {
    timer--;
    updateTimeUI(timer);
    if (timer <= 0) {
      clearInterval(timerInterval);
      clearInterval(countdownInterval);
      endGame();
    }
  }, 1000);
}

// 10. UI 업데이트 함수
function updateTimeUI(time) {
  if (timeText) timeText.textContent = `시간: ${time}초`;
}

function updateScoreUI(score) {
  if (scoreText) scoreText.textContent = `점수: ${score}`;
}

// 11. 문제 표시
function showQuestion() {
  if (currentQuestion > totalQuestions) {
    endGame();
    return;
  }
  if (!generalQuizList.length) {
    questionText.textContent = '문제 데이터가 없습니다.';
    return;
  }
  questionText.textContent = generalQuizList[currentQuestion - 1]?.question || '문제 없음';
  updateProgressBar(currentQuestion, totalQuestions);
  if (currentQ) currentQ.textContent = currentQuestion;
}

// 12. 답안 처리
function handleAnswer(input) {
  if (input === generalQuizList[currentQuestion - 1]?.answer) {
    comboCount++;
    let comboBonus = 0;
    if ([3, 5, 10, 15, 20, 25, 30].includes(comboCount)) {
      comboBonus = 5;
      showComboUI(comboCount);
    }
    correctSfx.currentTime = 0;
    correctSfx.play();

    questionContainer.classList.remove('wrong');
    questionContainer.classList.add('correct');
    setTimeout(() => questionContainer.classList.remove('correct'), 1000);
    correctCount++;

    score += 10 + comboBonus;
    updateScoreUI(score);
  } else {
    comboCount = 0;
    wrongSfx.currentTime = 0;
    wrongSfx.play();

    questionContainer.classList.remove('correct');
    questionContainer.classList.add('wrong');
    setTimeout(() => questionContainer.classList.remove('wrong'), 1000);
  }
  currentQuestion++;
  showQuestion();
}

// 13. 콤보 UI
function showComboUI(combo) {
  const prev = questionContainer.querySelector('.combo-ui');
  if (prev) prev.remove();

  const comboEl = document.createElement('div');
  comboEl.className = 'combo-ui';
  comboEl.textContent = `🎉 ${combo} COMBO 🎉`;
  questionContainer.prepend(comboEl);
  setTimeout(() => comboEl.remove(), 1000);
}

// 14. 게임 종료
function endGame() {
  isGameActive = false;
  sessionStorage.setItem(
    'quizResult',
    JSON.stringify({
      mode: quizContainer.classList.contains('time-attack') ? 'time-attack' : 'focus-on',
      score,
      total: currentQuestion - 1,
      correct: correctCount,
    })
  );
  cleanupQuizGame();
  loadHTML('/src/pages/game-quiz/quiz-result.html');
}

// 15. 일시정지
function pauseGame() {
  sessionStorage.setItem(
    'quizMode',
    JSON.stringify({
      mode: quizContainer.classList.contains('time-attack') ? 'time-attack' : 'focus-on',
    })
  );
  isGameActive = false;
  clearInterval(timerInterval);
  clearInterval(countdownInterval);
  countdownInterval = null;
}

// 16. 외부에서 호출하는 함수
export function resumeGame() {
  isGameActive = true;
  audioManager.play();
  if (countdownValue !== null) {
    showCountdown();
  } else {
    startTimer();
  }
}

export function restartGame() {
  cleanupQuizGame();
  initQuizGame();
}

export function goToMain() {
  audioManager.pause();
  isGameActive = false;
  cleanupQuizGame();
  loadHTML('/src/pages/game-quiz/quiz-start.html');
}

// 17. 진행률 바
function updateProgressBar(current, total) {
  const percent = (current / total) * 100;
  bar.style.setProperty('--progress', percent + '%');
  bar.style.setProperty('--progress-width', percent + '%');
  progressTextQ.textContent = current;
}

// 18. 카운트다운
function showCountdown() {
  isCountdownActive = true;
  clearInterval(countdownInterval);
  const countdownEl = quizContainer.querySelector('.countdown-overlay');
  let count = countdownValue !== null ? countdownValue : 5;
  countdownEl.textContent = count;
  countdownEl.classList.remove('hide');

  countdownInterval = setInterval(() => {
    count--;
    countdownValue = count;
    if (count > 0) {
      countdownEl.textContent = count;
    } else if (count === 0) {
      countdownEl.textContent = '시작!';
    } else {
      countdownEl.classList.add('hide');
      clearInterval(countdownInterval);
      isCountdownActive = false;
      countdownInterval = null;
      countdownValue = null;
      startGame();
    }
  }, 1000);
}

// 19. 모드별 문제 수/시간 설정
function initModeSettings() {
  let totalQuestions = 30;
  let startTime = 60;
  if (quizContainer.classList.contains('focus-on')) {
    totalQuestions = 10;
    startTime = 10;
  } else if (quizContainer.classList.contains('time-attack')) {
    totalQuestions = 30;
    startTime = 60;
  }
  const totalQ = quizContainer.querySelector('.total-questions');
  if (totalQ) totalQ.textContent = totalQuestions;
  const timeSpan = quizContainer.querySelector('.score-info span:last-child');
  if (timeSpan) timeSpan.textContent = `시간: ${startTime}초`;
  return { totalQuestions, startTime };
}

// 20. 오디오 초기화
function initAudio() {
  let volume = localStorage.getItem('quizVolume');
  if (volume === null) volume = 0.3;

  // 이미 같은 곡이 재생 중이면 아무것도 하지 않음
  if (audioManager.audio && audioManager.audio.src.includes('quiz-WildPogo-Francis-Preve.mp3') && !audioManager.audio.paused) {
    audioManager.audio.volume = volume;
    audioManager.setUI({
      iconSelector: '#soundIcon',
      buttonSelector: '#soundToggleBtn',
    });
    correctSfx.volume = volume;
    wrongSfx.volume = volume - 0.1;
    return;
  }

  // 아니면 새로 세팅
  audioManager.setSource('/assets/audio/bgm/quiz-WildPogo-Francis-Preve.mp3');
  audioManager.audio.volume = volume;
  audioManager.play();
  audioManager.setUI({
    iconSelector: '#soundIcon',
    buttonSelector: '#soundToggleBtn',
  });
  correctSfx.volume = volume;
  wrongSfx.volume = volume - 0.1;
}

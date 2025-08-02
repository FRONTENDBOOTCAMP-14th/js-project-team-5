import audioManager from '/src/scripts/audiomanager.js';
import { loadHTML } from '/src/components/monitor/controlMonitor.js';

// 효과음 관리
const correctSfx = new Audio('/assets/audio/sfx/quiz-correct.mp3');
const wrongSfx = new Audio('/assets/audio/sfx/quiz-wrong.mp3');

// 문제 데이터 경로
const QUIZ_LIST_DEV = '/data/quiz-dev.json'; // 개발자 모드

// 게임 상태 변수
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

// 주요 DOM 요소를 항상 최신으로 참조하는 함수
function getQuizElements() {
  const quizContainer = document.querySelector('.quiz-container');
  return {
    quizContainer,
    scoreText: quizContainer?.querySelector('.score-info span:first-child'),
    timeText: quizContainer?.querySelector('.score-info span:last-child'),
    bar: quizContainer?.querySelector('.progress-bar'),
    questionContainer: quizContainer?.querySelector('.quiz-question-container'),
    progressTextQ: quizContainer?.querySelector('.progress-text span:first-child'),
    questionText: quizContainer?.querySelector('.question-text'),
    currentQ: quizContainer?.querySelector('.current-question'),
    typingInput: quizContainer?.querySelector('.typing-input'),
    pauseButton: quizContainer?.querySelector('[data-type="pause"]'),
  };
}

// 인터벌 안전하게 모두 정리
function clearAllIntervals() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
}

// 3. 초기화 및 이벤트 바인딩
function initialize() {
  const { quizContainer } = getQuizElements();
  if (!quizContainer) return;
  cleanupQuizGame();
  initQuizGame();
}
initialize();

// 4. 입력 핸들러
function typingInputHandler(e) {
  if (!isGameActive) return;
  if (e.key === 'Enter' || e.key === ' ') {
    if (isCountdownActive) {
      e.preventDefault();
      return;
    }
    if (!e.target.value.trim()) return;
    handleAnswer(e.target.value);
    e.target.value = '';
  }
}

// 5. 게임 상태 및 UI 초기화
function cleanupQuizGame() {
  const { quizContainer, typingInput, pauseButton, questionContainer } = getQuizElements();
  if (!quizContainer) return;

  clearAllIntervals();

  // 카운트다운 오버레이 초기화
  const countdownEl = quizContainer.querySelector('.countdown-overlay');
  if (countdownEl) {
    countdownEl.classList.add('hide');
    countdownEl.textContent = '';
  }

  // 문제 카운트, 진행률, 점수, 시간 등 UI 완전 초기화
  const progressTextQ = quizContainer.querySelector('.progress-text span:first-child');
  const totalQ = quizContainer.querySelector('.progress-text span:last-child');
  const currentQ = quizContainer.querySelector('.current-question');
  const questionText = quizContainer.querySelector('.question-text');
  const bar = quizContainer.querySelector('.progress-bar');
  const scoreText = quizContainer.querySelector('.score-info span:first-child');
  const timeText = quizContainer.querySelector('.score-info span:last-child');
  if (progressTextQ) progressTextQ.textContent = '0';
  if (totalQ) totalQ.textContent = '0';
  if (currentQ) currentQ.textContent = '0';
  if (questionText) questionText.textContent = '';
  if (scoreText) scoreText.textContent = '점수: 0';
  if (timeText) timeText.textContent = '시간: 0초';
  if (bar) {
    bar.style.setProperty('--progress', '0%');
    bar.style.setProperty('--progress-width', '0%');
  }

  // 입력창 초기화
  if (typingInput) {
    typingInput.value = '';
    typingInput.disabled = false;
    typingInput.removeEventListener('keydown', typingInputHandler);
  }

  if (pauseButton) {
    pauseButton.removeEventListener('click', pauseGame);
  }

  // 상태변수 초기화
  isGameActive = false;
  isCountdownActive = false;
  currentQuestion = 0;
  correctCount = 0;
  score = 0;
  comboCount = 0;
  countdownValue = null;
  generalQuizList = [];
  totalQuestions = 0;
  startTime = 0;
  timer = 0;

  const comboEl = questionContainer?.querySelector('.combo-ui');
  if (comboEl) comboEl.remove();
}

// 6. 게임 시작 및 이벤트 바인딩
function initQuizGame() {
  const { quizContainer, typingInput, pauseButton } = getQuizElements();
  if (!quizContainer) return;

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
    pauseButton.addEventListener('click', pauseGame);
  }

  initAudio();

  fetch(QUIZ_LIST_DEV)
    .then((response) => {
      if (!response.ok) throw new Error('문제 데이터를 불러오지 못했습니다.');
      return response.json();
    })
    .then((data) => {
      generalQuizList = shuffleQuestion(data);
      const modeSettings = initModeSettings();
      totalQuestions = modeSettings.totalQuestions;
      startTime = modeSettings.startTime;
      timer = startTime;
      showCountdown();
    })
    .catch(() => {
      generalQuizList = [];
      if (isGameActive) {
        alert('문제 데이터를 불러오는 데 실패했습니다.');
      }
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
  clearAllIntervals();
  isGameActive = true;
  isCountdownActive = false;
  countdownValue = null;
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
  clearAllIntervals();
  timerInterval = setInterval(() => {
    timer--;
    updateTimeUI(timer);
    if (timer <= 0) {
      clearAllIntervals();
      endGame();
    }
  }, 1000);
}

// 10. UI 업데이트 함수
function updateTimeUI(time) {
  const { timeText } = getQuizElements();
  if (timeText) timeText.textContent = `시간: ${time}초`;
}

function updateScoreUI(score) {
  const { scoreText } = getQuizElements();
  if (scoreText) scoreText.textContent = `점수: ${score}`;
}

// 11. 문제 표시
function showQuestion() {
  const { questionText, currentQ } = getQuizElements();
  if (currentQuestion > totalQuestions) {
    endGame();
    return;
  }
  if (!generalQuizList.length) {
    if (questionText) questionText.textContent = '문제 데이터가 없습니다.';
    return;
  }
  if (questionText) questionText.textContent = generalQuizList[currentQuestion - 1]?.question || '문제 없음';
  updateProgressBar(currentQuestion, totalQuestions);
  if (currentQ) currentQ.textContent = currentQuestion;
}

// 12. 답안 처리
function handleAnswer(input) {
  const { questionContainer } = getQuizElements();
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
  const { questionContainer } = getQuizElements();
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
  isCountdownActive = false;
  clearAllIntervals();
  const { quizContainer } = getQuizElements();
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
  const { quizContainer } = getQuizElements();
  sessionStorage.setItem(
    'quizMode',
    JSON.stringify({
      mode: quizContainer.classList.contains('time-attack') ? 'time-attack' : 'focus-on',
    })
  );
  isGameActive = false;
  // 카운트다운 중이면 인터벌만 정지, 상태유지
  if (isCountdownActive) {
    if (countdownInterval) {
      clearInterval(countdownInterval);
      countdownInterval = null;
    }
  }
  // 타이머 중이면 인터벌만 정지
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

// 16. 외부에서 호출하는 함수
export function resumeGame() {
  const { quizContainer } = getQuizElements();
  if (!quizContainer) return;
  isGameActive = true;
  audioManager.play();

  // 인터벌 무조건 정리
  // clearAllIntervals();

  if (isCountdownActive && countdownValue !== null && countdownValue > 0) {
    // 남은 카운트다운 이어서
    showCountdown();
  } else if (!isCountdownActive && typeof timer === 'number' && timer > 1) {
    // 남은 타이머 이어서
    startTimer();
  } else {
    // 게임이 끝났거나 시작할 수 없는 상태면 아무 동작도 하지 않음
    return;
  }
}

export function restartGame() {
  cleanupQuizGame();
  initQuizGame();
}

export function goToMain() {
  audioManager.pause();
  isGameActive = false;
  isCountdownActive = false;
  countdownValue = null;
  clearAllIntervals();
  cleanupQuizGame();
  loadHTML('/src/pages/game-quiz/quiz-start.html');
}

// 17. 진행률 바
function updateProgressBar(current, total) {
  const { bar, progressTextQ } = getQuizElements();
  const percent = (current / total) * 100;
  bar?.style.setProperty('--progress', percent + '%');
  bar?.style.setProperty('--progress-width', percent + '%');
  if (progressTextQ) progressTextQ.textContent = current;
}

// 18. 카운트다운 - 타이머와 중복 절대 금지!
function showCountdown() {
  // 인터벌이 이미 돌고 있으면 끊고 새로 시작!
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
  isCountdownActive = true;

  const { quizContainer } = getQuizElements();
  const countdownEl = quizContainer?.querySelector('.countdown-overlay');
  let count = countdownValue !== null && countdownValue > 0 ? countdownValue : 5;
  countdownValue = count;

  if (count <= 0) {
    isCountdownActive = false;
    countdownValue = null;
    if (countdownEl) {
      countdownEl.classList.add('hide');
      countdownEl.textContent = '';
    }
    return;
  }

  if (countdownEl) {
    countdownEl.textContent = count;
    countdownEl.classList.remove('hide');
  }

  // [핵심!] interval이 null이면 새로 생성
  countdownInterval = setInterval(() => {
    count--;
    countdownValue = count;
    if (countdownEl) {
      if (count > 0) {
        countdownEl.textContent = count;
      } else {
        countdownEl.classList.add('hide');
        clearInterval(countdownInterval);
        countdownInterval = null;
        isCountdownActive = false;
        countdownValue = null;
        startGame();
      }
    }
  }, 1000);
}

// 19. 모드별 문제 수/시간 설정
function initModeSettings() {
  const { quizContainer } = getQuizElements();
  if (!quizContainer) return { totalQuestions: 0, startTime: 0 };
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
  let bgmVolume = localStorage.getItem('bgmVolume');
  if (bgmVolume === null) bgmVolume = 0.3;
  else bgmVolume = Number(bgmVolume);

  let sfxVolume = localStorage.getItem('sfxVolume');
  if (sfxVolume === null) sfxVolume = 0.2;
  else sfxVolume = Number(sfxVolume);

  audioManager.audio && (audioManager.audio.volume = bgmVolume);
  correctSfx.volume = sfxVolume;
  wrongSfx.volume = Math.max(0, sfxVolume - 0.1);

  // 이미 같은 BGM이 재생 중이면 UI만 갱신하고 리턴
  if (audioManager.audio && audioManager.audio.src.includes('quiz-WildPogo-Francis-Preve.mp3') && !audioManager.audio.paused) {
    audioManager.setUI({
      iconSelector: '#soundIcon',
      buttonSelector: '#soundToggleBtn',
    });
    return;
  }

  // 아니면 새로 세팅
  audioManager.setSource('/assets/audio/bgm/quiz-WildPogo-Francis-Preve.mp3');
  audioManager.audio.volume = bgmVolume;
  audioManager.play();
  audioManager.setUI({
    iconSelector: '#soundIcon',
    buttonSelector: '#soundToggleBtn',
  });
}

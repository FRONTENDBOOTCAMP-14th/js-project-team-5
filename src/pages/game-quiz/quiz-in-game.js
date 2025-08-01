//  1. 모듈/상수/DOM 요소 선언
import audioManager from '/src/scripts/audiomanager.js';
// import { loadHTML } from '/src/components/window/controlWindow.js';

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

//  2. 문제 데이터 경로 및 상태 변수 선언
const QUIZ_LIST_NORMAL = '/data/quiz-normal.json'; // 일반 모드
const QUIZ_LIST_DEV = '/data/quiz-dev.json'; // 개발자 모드
// 일반 모드, 개발자 모드 분기 필요

let generalQuizList = [];

let currentQuestion = 0;
let timer = 0;
let timerInterval = null;
let correctCount = 0;
let score = 0;
let isGameActive = false;
let totalQuestions = 0;
let startTime = 0;
let comboCount = 0;

//  4. 초기화 및 이벤트 바인딩

// 스페이스바 입력 항상 방지
if (typingInput) {
  typingInput.addEventListener('keydown', (e) => {
    if (e.key === ' ') {
      e.preventDefault();
    }
  });
}

initQuizGame();

/**
 *  4. 퀴즈 게임을 초기화하고 문제 데이터를 불러온 뒤, 이벤트 리스너 등록
 */
function initQuizGame() {
  initAudio();
  if (typingInput) typingInput.focus();
  fetch(QUIZ_LIST_DEV)
    .then((response) => {
      if (!response.ok) throw new Error('문제 데이터를 불러오지 못했습니다.');
      return response.json();
    })
    .then((data) => {
      generalQuizList = data; // 문제 순서 섞기
      ({ totalQuestions, startTime } = initModeSettings());
      timer = startTime;
      showCountdown();

      if (typingInput) {
        typingInput.addEventListener('keydown', (e) => {
          if (!isGameActive) return;
          // 엔터키나 스페이스바로 답안 제출
          if (e.key === 'Enter' || e.key === ' ') {
            if (!e.target.value.trim()) return; // input에 아무것도 없을 땐 답안 제출 막기
            handleAnswer(e.target.value);
            e.target.value = '';
          }
        });
      }
    })
    .catch((err) => {
      alert('문제 데이터를 불러오는 데 실패했습니다.');
      generalQuizList = [];
    });
}

/**
 * 5. 문제 배열을 Fisher-Yates 알고리즘으로 무작위로 섞어 반환
 * @param {Array} data - 문제 객체 배열
 * @returns {Array} 섞인 문제 배열
 */
function suffleQuestion(data) {
  for (let i = data.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [data[i], data[j]] = [data[j], data[i]];
  }
  return data;
}

/**
 * 6. 게임을 시작하고, 상태값을 초기화하며 첫 문제를 표시
 */
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

/**
 * 6-1. 타이머를 1초마다 감소시키고, 시간이 다 되면 게임 종료
 */
function startTimer() {
  timerInterval = setInterval(() => {
    timer--;
    updateTimeUI(timer, score);
    if (timer <= 0) {
      clearInterval(timerInterval);
      endGame();
    }
  }, 1000);
}

/**
 * 6-2. 남은 시간 및 점수를 UI에 표시
 * @param {number} time - 남은 시간(초)
 * @param {number} score - 현재 점수
 */
function updateTimeUI(time, score = 0) {
  if (timeText) timeText.textContent = `시간: ${time}초`;
  if (scoreText) scoreText.textContent = `점수: ${score}점`;
}

/**
 * 6-3. 현재 문제를 화면에 표시하고, 진행률 업데이트
 */
function showQuestion() {
  // 현재 질문이 총 질문 수를 초과하면 게임 종료
  if (currentQuestion > totalQuestions) {
    endGame();
    return;
  }
  // 문제 표시 (데이터가 없으면 안내)
  if (!generalQuizList.length) {
    questionText.textContent = '문제 데이터가 없습니다.';
    return;
  }
  questionText.textContent = generalQuizList[currentQuestion - 1]?.question || '문제 없음';
  updateProgressBar(currentQuestion, totalQuestions);
  if (currentQ) currentQ.textContent = currentQuestion + 1;
}

/**
 * 6-4. 사용자의 답안을 채점하고, 정답/오답 효과 및 점수 처리
 * @param {string} input - 사용자가 입력한 답
 */
function handleAnswer(input) {
  if (input === generalQuizList[currentQuestion - 1]?.answer) {
    comboCount++;
    let comboBonus = 0;
    if ([3, 5, 10, 15, 20, 25, 30].includes(comboCount)) {
      comboBonus = 5;
      showComboUI(comboCount); // 콤보 UI 표시 함수 호출
    }
    correctSfx.currentTime = 0;
    correctSfx.play();

    questionContainer.classList.remove('wrong');
    questionContainer.classList.add('correct');
    setTimeout(() => questionContainer.classList.remove('correct'), 1000);
    correctCount++;

    score += 10 + comboBonus; // 정답 점수 + 콤보 보너스
  } else {
    comboCount = 0; // 오답 시 콤보 초기화
    wrongSfx.currentTime = 0;
    wrongSfx.play();

    questionContainer.classList.remove('correct');
    questionContainer.classList.add('wrong');
    setTimeout(() => questionContainer.classList.remove('wrong'), 1000);
  }
  currentQuestion++;
  showQuestion();
}

/**
 * 6-4-1. 콤보 달성 시 콤보 UI를 화면에 표시
 * @param {number} combo - 현재 콤보 수
 */
function showComboUI(combo) {
  // 기존 콤보 UI가 있으면 제거
  const prev = questionContainer.querySelector('.combo-ui');
  if (prev) prev.remove();

  const comboEl = document.createElement('div');
  comboEl.className = 'combo-ui';
  comboEl.textContent = `🎉 ${combo} COMBO 🎉`;
  questionContainer.prepend(comboEl); // 문제 카드 안 맨 위에 추가
  setTimeout(() => comboEl.remove(), 1000);
}

/**
 * 6-5. 게임을 종료하고, 결과를 sessionStorage에 저장한 뒤 결과 페이지로 이동
 */
function endGame() {
  isGameActive = false;
  clearInterval(timerInterval);
  // 결과값 저장
  sessionStorage.setItem(
    'quizResult',
    JSON.stringify({
      mode: quizContainer.classList.contains('time-attack') ? 'time-attack' : 'focus-on',
      score,
      total: currentQuestion - 1,
      correct: correctCount,
    })
  );
  // 결과 페이지로 이동
  loadHTML('/src/pages/game-quiz/quiz-result.html');
}

/**
 * 7. 진행률 바와 진행률 텍스트 업데이트
 * @param {number} current - 현재 문제 번호
 * @param {number} total - 전체 문제 수
 */
function updateProgressBar(current, total) {
  const percent = (current / total) * 100;
  bar.style.setProperty('--progress', percent + '%');
  bar.style.setProperty('--progress-width', percent + '%');
  progressTextQ.textContent = current; // 진행률 텍스트 업데이트
}

/**
 * 8. 카운트다운 표시 및 카운트다운 종료 후 게임 시작
 */
function showCountdown() {
  const countdownEl = quizContainer.querySelector('.countdown-overlay');
  let count = 5;
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
      if (quizContainer.classList.contains('time-attack')) {
        startGame();
      }
      // 집중 모드는 기존대로(추후 구현)
    }
  }, 1000);
}

/**
 * 9. 모드별(집중/타임어택)로 문제 수와 제한 시간을 설정하고, UI에 반영
 * @returns {{totalQuestions: number, startTime: number}} 문제 수와 제한 시간
 */
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
  // UI에 반영
  const totalQ = quizContainer.querySelector('.total-questions');
  if (totalQ) totalQ.textContent = totalQuestions;
  const timeSpan = quizContainer.querySelector('.score-info span:last-child');
  if (timeSpan) timeSpan.textContent = `시간: ${startTime}초`;
  return { totalQuestions, startTime };
}

/**
 * 10. 오디오 매니저 초기화하고, bgm과 효과음 볼륨 및 UI 설정
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
  // 효과음 볼륨 설정
  correctSfx.volume = volume;
  wrongSfx.volume = volume - 0.1; // 오답 효과음 기본 볼륨이 커서 약간 낮춤
}

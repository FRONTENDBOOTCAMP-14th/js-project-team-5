//  1. 모듈/상수/DOM 요소 선언
import audioManager from '/src/scripts/audiomanager.js';
// import { loadHTML } from '/src/components/window/controlWindow.js';

// 효과음 관리
const correctSfx = new Audio('/assets/audio/sfx/quiz-correct.mp3');
const wrongSfx = new Audio('/assets/audio/sfx/quiz-wrong.mp3');

// 주요 DOM 요소
const quizContainer = document.querySelector('.quiz-container');
const timeSpan = quizContainer.querySelector('.score-info span:last-child');
const bar = quizContainer.querySelector('.progress-bar');
const questionContainer = quizContainer.querySelector('.quiz-question-container');
const progressTextQ = quizContainer.querySelector('.progress-text span:first-child');
const questionText = quizContainer.querySelector('.question-text');
const currentQ = quizContainer.querySelector('.current-question');
const typingInput = quizContainer.querySelector('.typing-input');

//  2. 문제 데이터
const QUIZ_LIST_NORMAL = '/data/quiz-normal.json'; // 일반 모드
const QUIZ_LIST_DEV = '/data/quiz-dev.json'; // 개발자 모드
// 일반 모드, 개발자 모드 분기 필요

let generalQuizList = [];

//  3. 게임 상태 변수
let currentQuestion = 0;
let timer = 0;
let timerInterval = null;
let correctCount = 0;
let score = 0;
let isGameActive = false;
let totalQuestions = 0;
let startTime = 0;

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

function initQuizGame() {
  initAudio();
  if (typingInput) typingInput.focus();
  fetch(QUIZ_LIST_DEV)
    .then((response) => {
      if (!response.ok) throw new Error('문제 데이터를 불러오지 못했습니다.');
      return response.json();
    })
    .then((data) => {
      generalQuizList = data;
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

//  5. 게임 핵심 로직

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

function startTimer() {
  timerInterval = setInterval(() => {
    timer--;
    updateTimeUI(timer);
    if (timer <= 0) {
      clearInterval(timerInterval);
      endGame();
    }
  }, 1000);
}

//  6. UI 업데이트 함수
function updateTimeUI(time) {
  if (timeSpan) timeSpan.textContent = `시간: ${time}초`;
}

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

function handleAnswer(input) {
  if (input === generalQuizList[currentQuestion - 1]?.answer) {
    correctSfx.currentTime = 0;
    correctSfx.play();

    questionContainer.classList.remove('wrong');
    questionContainer.classList.add('correct');
    setTimeout(() => questionContainer.classList.remove('correct'), 1000);
    correctCount++;
    score += 10; // 정답일 경우 10점 추가
  } else {
    wrongSfx.currentTime = 0;
    wrongSfx.play();

    questionContainer.classList.remove('correct');
    questionContainer.classList.add('wrong');
    setTimeout(() => questionContainer.classList.remove('wrong'), 1000);
  }
  currentQuestion++;
  showQuestion();
}

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

function updateProgressBar(current, total) {
  const percent = (current / total) * 100;
  bar.style.setProperty('--progress', percent + '%');
  bar.style.setProperty('--progress-width', percent + '%');
  progressTextQ.textContent = current; // 진행률 텍스트 업데이트
}

//  7. 카운트다운 및 모드별 초기화
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

//  8. 모드별 세팅 및 오디오
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

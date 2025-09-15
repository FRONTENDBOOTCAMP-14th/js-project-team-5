//=====================================
// 🎵 오디오 매니저 설정 (유저 컨트롤 포함)
// =====================================
import audioManager from '/src/scripts/audiomanager.js';
import { handleAcidRainPause } from '/src/components/modal/pause-modal/acidrain-pause.js';

// BGM 설정 및 재생 시작
// 로컬 스토리지에서 볼륨값 가져오기 (없으면 기본값 0.3)
let bgmVolume = localStorage.getItem('bgmVolume');
if (bgmVolume === null) bgmVolume = 0.3;
else bgmVolume = Number(bgmVolume);

audioManager.setSource(
  '  /assets/audio/bgm/acidrain-DiscoHeart-Coyote-Hearing.mp3'
);
audioManager.audio.volume = bgmVolume;
audioManager.play();

// 사운드 토글 UI 연결
audioManager.setUI({
  iconSelector: '#soundIcon',
  buttonSelector: '#soundToggleBtn',
});

// =====================================
// 게임 초기 변수 및 데이터
// =====================================
const typingInput = document.querySelector('.typing-input'); // 타자 입력창
const scoreDisplay = document.getElementById('score'); // 점수 표시 영역
const timeDisplay = document.getElementById('time'); // 시간 표시 영역
const gameOverModal = document.getElementById('gameOverModal'); // 게임 오버 모달창
const finalScoreDisplay = document.getElementById('finalScore'); // 최종 점수 영역
const retryBtn = document.getElementById('retryBtn'); // 다시하기 버튼
const modalButtons = document.querySelectorAll('.modal-button'); // 모달 내 모든 버튼

let score = 0; // 현재 점수
let time = 60; // 제한 시간
let dropInterval; // 단어 생성 타이머
let timerInterval; // 시간 감소 타이머
const fallingIntervals = []; // 낙하 단어들의 개별 타이머 저장 배열

let focusedButtonIndex = -1; // ←→ 키로 포커스된 버튼 인덱스

// 문제 데이터 경로 및 상태 변수 선언
const WORD_LIST_NORMAL = '/data/word-normal.json'; // 일반 모드
const WORD_LIST_DEV = '/data/word-dev.json'; // 개발자 모드

const savedMode = localStorage.getItem('dev-or-normal') || 'normal';
const WORD_LIST_SRC = savedMode === 'dev' ? WORD_LIST_DEV : WORD_LIST_NORMAL;

let words = [];

// 비동기로 단어 리스트 불러오기
fetch(WORD_LIST_SRC)
  .then((res) => res.json())
  .then((data) => {
    words = data;
  });

// =====================================
//  유틸 함수 정의
// =====================================

// 무작위 단어 반환
function getRandomWord() {
  return words[Math.floor(Math.random() * words.length)];
}

// 단어 X 좌표 무작위 설정
function getRandomX() {
  const maxWidth = 1550;
  return Math.floor(Math.random() * (maxWidth - 100));
}

// 점수 UI 업데이트
function updateScore() {
  scoreDisplay.textContent = `점수: ${score}`;
}

// 시간 UI 업데이트
function updateTime() {
  timeDisplay.textContent = `시간: ${time}초`;
}

// 모든 낙하 단어의 타이머 제거
function clearFallingIntervals() {
  fallingIntervals.forEach(clearInterval);
  fallingIntervals.length = 0;
}

// =====================================
//  게임 종료 처리
// =====================================
function gameOver() {
  clearInterval(dropInterval); // 단어 생성 중단
  clearInterval(timerInterval); // 시간 감소 중단
  clearFallingIntervals(); // 낙하 단어 인터벌 정리

  finalScoreDisplay.textContent = score; // 최종 점수 표시
  gameOverModal.hidden = false; // 모달 보이기
  typingInput.disabled = true; // 입력창 비활성화
  document.querySelectorAll('.falling-word').forEach((el) => el.remove()); // 단어 제거

  retryBtn.blur(); // 자동 포커스 제거
  focusedButtonIndex = -1; // 방향키 포커스 초기화
}

// ====================================
//   카운트 다운
//=====================================
function startCountdown(callback) {
  const countdownEl = document.getElementById('countdown');
  let count = 3;

  countdownEl.hidden = false;
  countdownEl.textContent = count;

  const interval = setInterval(() => {
    count--;
    if (count === 0) {
      clearInterval(interval);
      countdownEl.hidden = true;
      callback(); // 실제 게임 시작
    } else {
      countdownEl.textContent = count;
      countdownEl.style.animation = 'none';
      void countdownEl.offsetWidth; // 리플로우
      countdownEl.style.animation = '';
    }
  }, 1000);
}

// =====================================
//  게임 시작
// =====================================
function startGame() {
  clearInterval(dropInterval);
  clearInterval(timerInterval);
  clearFallingIntervals();

  score = 0;
  time = 60;
  updateScore();
  updateTime();
  typingInput.disabled = false;
  typingInput.value = '';
  gameOverModal.hidden = true;

  document.querySelectorAll('.falling-word').forEach((el) => el.remove());

  // 타이머 시작
  timerInterval = setInterval(() => {
    updateTime();
    if (time <= 0) {
      gameOver();
    } else {
      time--;
    }
  }, 1000);

  // 단어 생성 시작
  dropInterval = setInterval(() => {
    dropWord();
  }, 1000);

  // 타자창 포커스
  setTimeout(() => {
    typingInput.focus();
  }, 100);
}

// =====================================
//  단어 낙하 기능
// =====================================
function dropWord() {
  const wordEl = document.createElement('div');
  wordEl.className = 'falling-word';
  wordEl.textContent = getRandomWord();

  // 빨간 단어일 확률 20%
  if (Math.random() < 0.2) {
    wordEl.classList.add('red');
    wordEl.style.color = '#D13032';
  } else {
    wordEl.style.color = '#0F1E69';
  }

  // 위치 및 스타일
  wordEl.style.position = 'absolute';
  wordEl.style.left = `${getRandomX()}px`;
  wordEl.style.top = `0px`;
  wordEl.style.fontWeight = 'bold';
  wordEl.style.fontSize = '1.75rem';
  wordEl.style.pointerEvents = 'none';
  wordEl.style.userSelect = 'none';

  document.querySelector('.acidrain-bg').append(wordEl);

  let y = 0;
  let hasFallen = false;

  const interval = setInterval(() => {
    // 화면에 없으면 정리
    if (!document.body.contains(wordEl)) {
      clearInterval(interval);
      return;
    }

    y += 2;
    wordEl.style.top = `${y}px`;

    if (y > 700 && !hasFallen) {
      hasFallen = true;
      clearInterval(interval);
      wordEl.remove();

      time -= 5;
      if (time < 0) time = 0;
      updateTime();
      if (time <= 0) gameOver();
    }
  }, 30);

  fallingIntervals.push(interval);
}

// =====================================
// 단어 제거 효과음 함수
// =====================================
let sfxVolume = localStorage.getItem('sfxVolume');
if (sfxVolume === null) sfxVolume = 0.2;
else sfxVolume = Number(sfxVolume);

function playPopSound() {
  const popSound = new Audio('/assets/audio/sfx/droplet-sound.mp3'); // 효과음 경로

  popSound.volume = sfxVolume;

  // 효과음의 원래 볼륨 저장
  popSound.defaultVolume = sfxVolume;

  // audiomanager에 등록
  audioManager.setSfx({ popSound });

  popSound.playbackRate = 2.0; // 더 빠르게 재생 (기본은 1.0)
  popSound.play();
}

// =====================================
//  타자 입력 검사
// =====================================
typingInput.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter') return;

  const typed = typingInput.value.trim();
  const fallingWords = document.querySelectorAll('.falling-word');

  for (const wordEl of fallingWords) {
    if (typed === wordEl.textContent) {
      const isRed = wordEl.classList.contains('red');
      score += isRed ? 15 : 10;
      wordEl.remove(); // 매칭 단어 제거

      playPopSound(); // ✅ 여기서만 효과음 재생
      break; // 하나만 처리
    }
  }

  typingInput.value = '';
  updateScore();
});

// =====================================
//  메인 버튼
// =====================================
const goHomeBtn = document.getElementById('goHomeBtn');

goHomeBtn.addEventListener('click', () => {
  window.loadHTML('/src/pages/game-landing/acidrain-landing.html'); // ← 산성비 렌딩 페이지 경로
});

// Enter 또는 Space로 다시 시작 가능
retryBtn.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    startGame();
  }
});

// =====================================
//  방향키로 모달 버튼 포커스 이동
// =====================================
document.addEventListener('keydown', (e) => {
  if (gameOverModal.hidden) return;

  if (e.key === 'ArrowRight') {
    // 처음 누를 경우 첫 번째로
    focusedButtonIndex =
      focusedButtonIndex === -1
        ? 0
        : (focusedButtonIndex + 1) % modalButtons.length;
    modalButtons[focusedButtonIndex].focus();
  }

  if (e.key === 'ArrowLeft') {
    focusedButtonIndex =
      focusedButtonIndex === -1
        ? modalButtons.length - 1
        : (focusedButtonIndex - 1 + modalButtons.length) % modalButtons.length;
    modalButtons[focusedButtonIndex].focus();
  }
});

// =====================================
// 일시정지 모달 제어 관련 변수 및 버튼 연결
// =====================================

// 게임 상태 관리
let isPaused = false;
// eslint-disable-next-line no-unused-vars
let wasPausedByModal = false;

// 일시정지 버튼 요소 (상단바)
const pauseOpenBtn = document.querySelector('.modal-open[data-type="pause"]');
if (pauseOpenBtn) {
  pauseOpenBtn.addEventListener('click', pauseGame); // 🔧 모달 열기 전에 게임 멈추기
}

// 일시정지 처리 함수 및 resume/retry/main 핸들러 분리
function pauseGame() {
  if (isPaused) return;

  isPaused = true;
  wasPausedByModal = true;

  clearInterval(dropInterval);
  clearInterval(timerInterval);
  fallingIntervals.forEach(clearInterval);
  typingInput.disabled = true;

  const pauseDialog = document.querySelector('dialog[data-type="pause"]');
  if (pauseDialog) {
    handleAcidRainPause(pauseDialog, {
      continue: () => {
        resumeGame();
      },
      retry: () => {
        restartFromPause();
      },
      main: () => {
        window.loadHTML('/src/pages/game-landing/acidrain-landing.html');
      },
    });
  }
}

function resumeGame() {
  if (!isPaused) return;

  startCountdown(() => {
    isPaused = false;
    wasPausedByModal = false;
    startWordDrop();
    startTimer();
    typingInput.disabled = false;
    typingInput.focus();

    document.querySelectorAll('.falling-word').forEach((wordEl) => {
      resumeFallingWord(wordEl);
    });
  });
}

function resumeFallingWord(wordEl) {
  let y = parseInt(wordEl.style.top || '0', 10);
  let hasFallen = false;
  const interval = setInterval(() => {
    if (isPaused || !document.body.contains(wordEl)) {
      clearInterval(interval);
      return;
    }
    y += 2;
    wordEl.style.top = `${y}px`;
    if (y > 700 && !hasFallen) {
      hasFallen = true;
      clearInterval(interval);
      wordEl.remove();
      time -= 5;
      if (time < 0) time = 0;
      updateTime();
      if (time <= 0) gameOver();
    }
  }, 30);
  fallingIntervals.push(interval);
}

function restartFromPause() {
  clearInterval(dropInterval);
  clearInterval(timerInterval);
  clearFallingIntervals();
  typingInput.disabled = true;

  isPaused = true;
  wasPausedByModal = true;

  startCountdown(() => {
    isPaused = false;
    wasPausedByModal = false;
    startGame();
  });
}

// =====================================
// 단어 낙하 재개 함수 (resume에서 사용)
// =====================================
function startWordDrop() {
  dropInterval = setInterval(() => {
    dropWord();
  }, 1000);
}

// =====================================
// 시간 타이머 재개 함수 (resume에서 사용)
// =====================================
function startTimer() {
  timerInterval = setInterval(() => {
    updateTime();
    if (time <= 0) {
      gameOver();
    } else {
      time--;
    }
  }, 1000);
}

// =====================================
//   최초 게임 시작
// =====================================
// ✅ 3,2,1 카운트다운 후 게임 시작
startCountdown(startGame);

// 다시하기 버튼 (클릭)
retryBtn.addEventListener('click', () => {
  gameOverModal.hidden = true;
  startCountdown(startGame); // 카운트다운 후 실제 게임 시작
});

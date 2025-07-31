// ;=====================================
// ; 🎵 오디오 매니저 설정 (유저 컨트롤 포함)
// ;=====================================
import audioManager from '/src/scripts/audiomanager.js';

audioManager.setSource('/assets/audio/bgm/acidrain-DiscoHeart-Coyote-Hearing.mp3');
audioManager.audio.volume = 0.1;
audioManager.play();
audioManager.setUI({
  iconSelector: '#soundIcon',
  buttonSelector: '#soundToggleBtn',
});

// ;=====================================
// ; 🤩 게임 초기 변수 및 데이터
// ;=====================================
const typingInput = document.querySelector('.typing-input');
const scoreDisplay = document.getElementById('score');
const timeDisplay = document.getElementById('time');
const gameOverModal = document.getElementById('gameOverModal');
const finalScoreDisplay = document.getElementById('finalScore');
const retryBtn = document.getElementById('retryBtn');

let score = 0;
let time = 60;
let dropInterval;
let timerInterval;
const fallingIntervals = [];

const words = ["사과", "바나나", "수박", "포도", "자몽", "참외", "딸기", "복숭아",
  "레몬", "학교", "도서관", "문방구", "교실", "학생", "선생", "칠판",
  "연필", "지우개", "노트", "자동차", "비행기", "버스", "자전거", "헬기",
  "기차", "지하철", "택시", "트럭", "스쿠터", "컴퓨터", "마우스", "키보드",
  "모니터", "프린터", "코딩", "프로그", "자바", "스크립트", "코드", "바다",
  "호수", "계곡", "사막", "초원", "빙하", "여름", "가을", "겨울",

  "바람", "천둥", "번개", "햇빛", "빨강", "파랑", "노랑", "초록",
  "보라", "하양", "검정", "회색", "주황", "갈색", "우유", "커피",
  "주스", "콜라", "사이다", "맥주", "와인", "소주", "사랑", "우정",
  "행복", "기쁨", "슬픔", "분노", "걱정", "희망", "용기", "두려움",

  "한국", "일본", "중국", "미국", "영국", "독일", "프랑스", "이탈리아",
  "러시아", "호주", "노트북", "핸드폰", "이어폰", "충전기", "마이크", "카메라",
  "삼각대", "배터리", "램프", "시계", "토끼", "호랑이", "사자", "코끼리",
  "기린", "원숭이", "여우", "늑대", "고양이", "강아지", "농구", "축구",

  "야구", "배구", "탁구", "씨름", "달리기", "자전거", "수영", "스키",
  "화요일", "월요일", "수요일", "목요일", "금요일", "토요일", "일요일", "오늘",
  "어제", "내일", "사무실", "회의실", "식당", "화장실", "계단", "복도",
  "출입문", "창문", "책상", "신문", "잡지", "만화", "동화", "소설",

  "문학", "과학", "역사", "철학", "버튼", "화면", "설정", "파일",
  "폴더", "이메일", "주소", "비밀번호"];

// ;=====================================
// ; 🔧 유틸 함수 정의
// ;=====================================
function getRandomWord() {
  return words[Math.floor(Math.random() * words.length)];
}

function getRandomX() {
  const maxWidth = 1600;
  return Math.floor(Math.random() * (maxWidth - 100));
}

function updateScore() {
  scoreDisplay.textContent = `점수: ${score}`;
}

function updateTime() {
  timeDisplay.textContent = `시간: ${time}초`;
}

function clearFallingIntervals() {
  fallingIntervals.forEach(clearInterval);
  fallingIntervals.length = 0;
}

// ;=====================================
// ; 🔚 게임 종료 처리
// ;=====================================
function gameOver() {
  clearInterval(dropInterval);
  clearInterval(timerInterval);
  clearFallingIntervals();
  finalScoreDisplay.textContent = score;
  gameOverModal.hidden = false;
  typingInput.disabled = true;
  document.querySelectorAll('.falling-word').forEach(el => el.remove());

  // ✅ 포커스를 다시하기 버튼으로 이동
  retryBtn.focus();
}

// ;=====================================
// ; 🆕 게임 시작
// ;=====================================
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

  document.querySelectorAll('.falling-word').forEach(el => el.remove());

  timerInterval = setInterval(() => {
    updateTime();
    if (time <= 0) {
      gameOver();
    } else {
      time--;
    }
  }, 1000);

  dropInterval = setInterval(() => {
    dropWord();
  }, 1000);

  // ✅ 입력창에 자동 포커스
  setTimeout(() => {
    typingInput.focus();
  }, 100);
}

// ;=====================================
// ; 💧 단어 낙하 기능
// ;=====================================
function dropWord() {
  const wordEl = document.createElement('div');
  wordEl.className = 'falling-word';
  wordEl.textContent = getRandomWord();

  if (Math.random() < 0.2) {
    wordEl.classList.add('red');
    wordEl.style.color = '#D13032';
  } else {
    wordEl.style.color = '#0F1E69';
  }

  wordEl.style.position = 'absolute';
  wordEl.style.left = `${getRandomX()}px`;
  wordEl.style.top = `0px`;
  wordEl.style.fontWeight = 'bold';
  wordEl.style.fontSize = '1.75rem';
  wordEl.style.pointerEvents = 'none';
  wordEl.style.userSelect = 'none';

  document.querySelector('.acidrain-bg').append(wordEl);

  let y = 0;
  const interval = setInterval(() => {
    y += 2;
    wordEl.style.top = `${y}px`;

    if (y > 700) {
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

// ;=====================================
// ; ⌨️ 입력값 검사
// ;=====================================
typingInput.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter') return;

  const typed = typingInput.value.trim();
  const fallingWords = document.querySelectorAll('.falling-word');

  fallingWords.forEach((wordEl) => {
    if (typed === wordEl.textContent) {
      const isRed = wordEl.classList.contains('red');
      score += isRed ? 15 : 10;
      wordEl.remove();
    }
  });

  typingInput.value = '';
  updateScore();
});

// ;=====================================
// ; 🔁 다시하기 버튼
// ;=====================================
retryBtn.addEventListener('click', startGame);

// ✅ 키보드 Enter / Space 키도 다시 시작 가능
retryBtn.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    startGame();
  }
});

// ;=====================================
// ; 🚀 최초 게임 시작
// ;=====================================
startGame();

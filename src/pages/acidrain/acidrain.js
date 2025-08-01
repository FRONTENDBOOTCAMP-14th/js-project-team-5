import { loadHTML } from '/src/components/monitor/controlMonitor.js';

//=====================================
// 🎵 오디오 매니저 설정 (유저 컨트롤 포함)
// =====================================
import audioManager from '/src/scripts/audiomanager.js';

// BGM 설정 및 재생 시작
audioManager.setSource('/assets/audio/bgm/acidrain-DiscoHeart-Coyote-Hearing.mp3');
audioManager.audio.volume = 0.1;
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

// 낙하 단어 리스트
const words = [
  '사과',
  '바나나',
  '수박',
  '포도',
  '자몽',
  '참외',
  '딸기',
  '복숭아',
  '레몬',
  '학교',
  '도서관',
  '문방구',
  '교실',
  '학생',
  '선생',
  '칠판',
  '연필',
  '지우개',
  '노트',
  '자동차',
  '비행기',
  '버스',
  '자전거',
  '헬기',
  '기차',
  '지하철',
  '택시',
  '트럭',
  '스쿠터',
  '컴퓨터',
  '마우스',
  '키보드',
  '모니터',
  '프린터',
  '코딩',
  '프로그',
  '자바',
  '스크립트',
  '코드',
  '바다',
  '호수',
  '계곡',
  '사막',
  '초원',
  '빙하',
  '여름',
  '가을',
  '겨울',
  '바람',
  '천둥',
  '번개',
  '햇빛',
  '빨강',
  '파랑',
  '노랑',
  '초록',
  '보라',
  '하양',
  '검정',
  '회색',
  '주황',
  '갈색',
  '우유',
  '커피',
  '주스',
  '콜라',
  '사이다',
  '맥주',
  '와인',
  '소주',
  '사랑',
  '우정',
  '행복',
  '기쁨',
  '슬픔',
  '분노',
  '걱정',
  '희망',
  '용기',
  '두려움',
  '한국',
  '일본',
  '중국',
  '미국',
  '영국',
  '독일',
  '프랑스',
  '이탈리아',
  '러시아',
  '호주',
  '노트북',
  '핸드폰',
  '이어폰',
  '충전기',
  '마이크',
  '카메라',
  '삼각대',
  '배터리',
  '램프',
  '시계',
  '토끼',
  '호랑이',
  '사자',
  '코끼리',
  '기린',
  '원숭이',
  '여우',
  '늑대',
  '고양이',
  '강아지',
  '농구',
  '축구',
  '야구',
  '배구',
  '탁구',
  '씨름',
  '달리기',
  '자전거',
  '수영',
  '스키',
  '화요일',
  '월요일',
  '수요일',
  '목요일',
  '금요일',
  '토요일',
  '일요일',
  '오늘',
  '어제',
  '내일',
  '사무실',
  '회의실',
  '식당',
  '화장실',
  '계단',
  '복도',
  '출입문',
  '창문',
  '책상',
  '신문',
  '잡지',
  '만화',
  '동화',
  '소설',
  '문학',
  '과학',
  '역사',
  '철학',
  '버튼',
  '화면',
  '설정',
  '파일',
  '폴더',
  '이메일',
  '주소',
  '비밀번호',
];

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
function playPopSound() {
  const popSound = new Audio('/assets/audio/sfx/droplet-sound.mp3'); // 효과음 경로
  popSound.volume = 0.7;
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
  loadHTML('/src/pages/game-landing/acidrain-landing.html'); // ← 산성비 렌딩 페이지 경로
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
    focusedButtonIndex = focusedButtonIndex === -1 ? 0 : (focusedButtonIndex + 1) % modalButtons.length;
    modalButtons[focusedButtonIndex].focus();
  }

  if (e.key === 'ArrowLeft') {
    focusedButtonIndex = focusedButtonIndex === -1 ? modalButtons.length - 1 : (focusedButtonIndex - 1 + modalButtons.length) % modalButtons.length;
    modalButtons[focusedButtonIndex].focus();
  }
});

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

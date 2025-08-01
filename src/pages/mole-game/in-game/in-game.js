window.addEventListener("DOMContentLoaded", () => {
  words.forEach((_, idx) => {
    positionWordAtMole(idx);
    updateWordBoxScale(idx);
    
  });

  showRandomMoles();

  setInterval(showRandomMoles, 4000);

  typingArea.focus();
});

const wordList = [
  "사과", "바나나", "포도", "딸기", "자두", // 과일
  "고양이", "강아지", "토끼", "곰", "펭귄", // 동물
  "물고기", "코끼리", "호랑이", "원숭이", "사자",
  "자동차", "버스", "기차", "비행기", "지하철", // 탈 것
  "책상", "의자", "연필", "지우개", "노트", // 학교사물
  "컴퓨터", "마우스", "키보드", "모니터", "전화기",
  "라면", "김밥", "삼겹살", "불고기", "햄버거", // 음식
  "감자", "고구마", "수박", "오이", "당근",
  "커피", "우유", "주스", "물", "차",
  "축구", "농구", "야구", "배구", "탁구", // 스포츠
  "학교", "도서관", "병원", "식당", "시장", // 장소
  "친구", "가족", "어머니", "아버지", "동생",
  "태양", "달", "별", "하늘", "바람", // 자연
  "봄", "여름", "가을", "겨울", "비",
  "빵", "과자", "아이스크림", "치즈", "피자",
  "시계", "손톱", "가방", "신발", "장갑",
  "창문", "문", "벽", "바닥", "천장",
  "선생님", "학생", "화가", "의사", "요리사", // 직업
  "경찰", "소방관", "군인", "가수", "배우",
  "텔레비전", "신문", "사진", "연극", "노래"
];



const activeWords = new Set();

function getUniqueRandomWord() {
  const candidates = wordList.filter((word) => !activeWords.has(word));
  if (candidates.length === 0) {
    activeWords.clear();
    return getUniqueRandomWord();
  }
  const word = candidates[Math.floor(Math.random() * candidates.length)];
  activeWords.add(word);
  return word;
}

const moles = document.querySelectorAll(".mole");
const words = document.querySelectorAll(".mole-word");
const wordContainer = document.querySelector(".mole-word-container");
const typingArea = document.querySelector(".typing-area");
const timeSpan = document.querySelector(".score-info span:nth-child(2)");
const scoreSpan = document.querySelector(".score-info span:first-child");

let timer = null;
let timeLeft = 60;
let timerStarted = false;
let score = 0;

// 두더지별 hideTimeout 관리
moles.forEach(mole => mole.hideTimeout = null);

// frypan을 .mole-word-container에 추가
function showFrypanForMole(idx) {
  const mole = moles[idx];
  const container = document.querySelector('.mole-word-container');
  let frypan = document.querySelector(`.frypan-img[data-mole="${idx}"]`);
  if (!frypan) {
    frypan = document.createElement('img');
    frypan.src = '/assets/images/frypan.png';
    frypan.className = 'frypan-img';
    frypan.setAttribute('data-mole', idx);
    container.appendChild(frypan);
  }
  // 두더지 위치 계산
  const moleRect = mole.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  frypan.style.left = (moleRect.right - containerRect.left - 75) + 'px';
  frypan.style.top = (moleRect.top - containerRect.top - 100) + 'px';
  frypan.style.opacity = 1;

  // 두더지 인덱스별 scale 적용
  const scales = [2.0, 1.3, 0.9, 1.8, 1.0, 1.6, 1.0, 1.7, 2.0, 1.9];
  frypan.style.setProperty('--frypan-scale', scales[idx]);
}

// 단어 위치 조정 함수 (두더지 기준)
function positionWordAtMole(i) {
  if (!wordContainer || !moles[i] || !words[i]) return;

  const moleRect = moles[i].getBoundingClientRect();
  const containerRect = wordContainer.getBoundingClientRect();

  const scaleX = moleRect.width / moles[i].offsetWidth;
  const scaleY = moleRect.height / moles[i].offsetHeight;

  const left =
    (moleRect.left - containerRect.left) / scaleX + moles[i].offsetWidth / 2;
  const bottom =
    containerRect.height - (moleRect.top - containerRect.top) / scaleY + 10;

  words[i].style.left = `${left}px`;
  words[i].style.bottom = `${bottom}px`;
}

// 점수 애니메이션
function animateScore(oldScore, newScore) {
  const duration = 400;
  const frameRate = 30;
  const totalFrames = Math.round(duration / (1000 / frameRate));
  let frame = 0;

  function update() {
    frame++;
    const progress = frame / totalFrames;
    const current = Math.round(oldScore + (newScore - oldScore) * progress);
    if (scoreSpan) scoreSpan.textContent = `점수: ${current}`;
    if (frame < totalFrames) {
      requestAnimationFrame(update);
    } else {
      if (scoreSpan) scoreSpan.textContent = `점수: ${newScore}`;
    }
  }
  update();
}

// 시간 표시
function updateTimeDisplay() {
  if (timeSpan) {
    timeSpan.textContent = `시간: ${timeLeft}초`;
  }
}

let gameEnded = false;
let moleTimers = []; // 두더지 관련 타이머 추적

function stopGame() {
  if (gameEnded) return;
  gameEnded = true;

  // 타이머 정지
  if (timer) clearInterval(timer);

  // 두더지 관련 타이머 모두 정지
  moleTimers.forEach(t => clearTimeout(t));
  moleTimers = [];

  // 입력창 비활성화
  typingArea.disabled = true;
}

// 두더지 여러 마리 랜덤 등장 (타이머 추적 추가)
function showRandomMoles() {
  moles.forEach((mole, idx) => {
    // 이미 올라와 있는 두더지는 건드리지 않음
    if (!mole.classList.contains("show")) {
      mole.classList.remove("show");
      words[idx].textContent = "";
      words[idx].style.opacity = "1";
      // frypan도 숨김
      const frypan = document.querySelector(`.frypan-img[data-mole="${idx}"]`);
      if (frypan) {
        frypan.classList.remove('hit', 'miss');
        frypan.style.opacity = 0;
        frypan.style.transform = '';
      }
    }
  });

  const count = Math.floor(Math.random() * 2) + 2;
  const indexes = [];
  while (indexes.length < count) {
    const randIdx = Math.floor(Math.random() * moles.length);
    if (!indexes.includes(randIdx)) indexes.push(randIdx);
  }

  indexes.forEach((idx, i) => {
    const delay = i * 500;

    // 두더지 등장 타이머 추적
    const showTimer = setTimeout(() => {
      if (gameEnded) return;
      if (moles[idx].classList.contains("show")) return; // 이미 show면 skip
      moles[idx].classList.add("show");

      // frypan 이미지 컨테이너에 추가 및 위치 조정
      showFrypanForMole(idx);

      const wordTimer = setTimeout(() => {
        if (gameEnded) return;
        const uniqueWord = getUniqueRandomWord();
        words[idx].textContent = uniqueWord;
        words[idx].style.opacity = "1";
        positionWordAtMole(idx);
        updateWordBoxScale(idx);
      }, 800);
      moleTimers.push(wordTimer);

      // 기존 hideTimeout 있으면 취소
      if (moles[idx].hideTimeout) clearTimeout(moles[idx].hideTimeout);

      moles[idx].hideTimeout = setTimeout(() => {
        if (gameEnded) return;
        // 단어를 지우기 전에 activeWords에서 먼저 삭제
        const wordToRemove = normalize(words[idx].textContent);
        if (wordToRemove) activeWords.delete(wordToRemove);

        moles[idx].classList.remove("show", "hit");
        words[idx].textContent = "";
        words[idx].style.opacity = "1";
        moles[idx].hideTimeout = null;

        // frypan 이미지 숨기기
        const frypan = document.querySelector(`.frypan-img[data-mole="${idx}"]`);
        if (frypan) {
          frypan.classList.remove('hit', 'miss');
          frypan.style.opacity = 0;
          frypan.style.transform = '';
        }
      }, 2200 + delay);
    }, delay);
    moleTimers.push(showTimer);
  });
}

// .icon-button 클릭 시 게임 멈춤
document.querySelectorAll('.icon-button').forEach(btn => {
  btn.addEventListener('click', stopGame);
});

// 페널티 표시
function showPenaltyImage() {
  const img = document.createElement("img");
  img.src = "/assets/images/molegame - penalty.png";
  img.alt = "패널티";
  img.className = "penalty-image";
  document.body.appendChild(img);

  setTimeout(() => {
    img.remove();
  }, 8000);
}

function normalize(str) {
  if (!str) return "";
  return str.trim().normalize("NFC");
}

// 화면에 보이는 두더지 중 입력과 일치하는 단어의 인덱스 찾기
function findMatchingVisibleMole(input) {
  for (let i = 0; i < moles.length; i++) {
    if (moles[i].classList.contains("show")) {
      const word = normalize(words[i].textContent);
      if (input === word && word.length > 0) {
        return i;
      }
    }
  }
  return -1;
}

typingArea.addEventListener("keydown", (e) => {
  const text = typingArea.value.trim();

  if (e.key === " ") {
    e.preventDefault();
    if (text.length === 0) return;
  }

  if ((e.key === "Enter" || e.key === " ") && text.length > 0) {
    e.preventDefault();

    const input = normalize(typingArea.value);
    const matchedIdx = findMatchingVisibleMole(input);

    if (matchedIdx !== -1) {
      // 정답 처리 (기존 코드 유지)
      const visibleMole = moles[matchedIdx];
      const wordBox = words[matchedIdx];
      const answer = normalize(wordBox.textContent);

      typingArea.value = "";
      const oldScore = score;
      const addedScore = getScoreByLength(answer);
      score += addedScore;
      animateScore(oldScore, score);

      // 효과음 재생
      const hitAudio = new Audio('/assets/audio/sfx/hitsound.wav');
      hitAudio.play();

      // 단어 즉시 사라짐
      wordBox.textContent = "";

      // 기존 hideTimeout 취소
      if (visibleMole.hideTimeout) clearTimeout(visibleMole.hideTimeout);

      // frypan과 moleImg 참조
      const frypan = document.querySelector(`.frypan-img[data-mole="${matchedIdx}"]`);
      const moleImg = visibleMole.querySelector('.mole-img');

      if (frypan && moleImg) {
        frypan.classList.remove('miss');
        frypan.classList.add('hit');

        // frypan 애니메이션 끝난 후 두더지 회전 시작
        const onFrypanAnimationEnd = (event) => {
          if (event.animationName.includes('frypan-hit')) {
            frypan.removeEventListener('animationend', onFrypanAnimationEnd);

            moleImg.classList.add('rotate'); // 두더지 회전 시작

            // 두더지 회전 애니메이션(0.2초) 끝난 뒤 내려가기 시작
            setTimeout(() => {
              visibleMole.classList.add("hide");  // 내려가면서 hide 추가
              visibleMole.classList.remove("show", "hit");

              // 내려가는 애니메이션 후 0.5초 뒤 회전 제거 및 hide 제거
              setTimeout(() => {
                moleImg.classList.remove('rotate');
                visibleMole.classList.remove("hide");
              }, 500);
            }, 200); // 두더지 회전 애니메이션 시간(0.2초)과 맞춤
          }
        };

        frypan.addEventListener('animationend', onFrypanAnimationEnd);

        // 1초 뒤 frypan 투명도 처리 및 클래스 정리 (기존 유지)
        setTimeout(() => {
          frypan.style.opacity = 0;
          // frypan.classList.remove('hit'); // 필요하면 여기서 제거
        }, 1000);
      } else { // fallback: frypan 또는 moleImg 없으면 즉시 내려감
        visibleMole.classList.add("hide");
        visibleMole.classList.remove("show", "hit");
        const moleImgFallback = visibleMole.querySelector('.mole-img');
        if (moleImgFallback) moleImgFallback.classList.remove('rotate');
        setTimeout(() => {
          visibleMole.classList.remove("hide");
        }, 500);
      }

      // 단어 opacity 초기화
      wordBox.style.opacity = "1";

      if (answer) activeWords.delete(answer);
      visibleMole.hideTimeout = null;
    } else {
      // 오답 처리: 두더지/단어/후라이팬/타이머에 절대 관여하지 않음!
      const laughAudio = new Audio('/assets/audio/sfx/laughsound.mp3');
      laughAudio.play();

      typingArea.value = "";
      showPenaltyImage();
    }
  }
});
  


// 입력 시작시 타이머 시작
typingArea.addEventListener("input", () => {
  if (!timerStarted && typingArea.value.trim().length > 0) {
    startTimer();
  }
});

// 창 크기 조정 시 단어 위치 및 크기 업데이트
let lastDevicePixelRatio = window.devicePixelRatio;

window.addEventListener("resize", () => {
  if (window.devicePixelRatio !== lastDevicePixelRatio) {
    lastDevicePixelRatio = window.devicePixelRatio;
    moles.forEach((mole, idx) => {
      if (mole.classList.contains("show")) {
        positionWordAtMole(idx);
        updateWordBoxScale(idx);
        showFrypanForMole(idx); // frypan 위치도 재조정
      }
    });
  } else {
    moles.forEach((mole, idx) => {
      if (mole.classList.contains("show")) {
        positionWordAtMole(idx);
        updateWordBoxScale(idx);
        showFrypanForMole(idx); // frypan 위치도 재조정
      }
    });
  }
});

updateTimeDisplay();

function updateWordBoxScale(idx) {
  const mole = moles[idx];
  const word = words[idx];
  if (!mole || !word) return;

  const rect = mole.getBoundingClientRect();
  word.style.width = rect.width + "px";
  word.style.height = Math.max(25, rect.height * 0.3) + "px";
  word.style.fontSize = Math.max(12, rect.height * 0.18) + "px";
}

// 점수 계산 함수
function getScoreByLength(word) {
  const len = word.length;
  if (len >= 7) return 70;
  if (len === 6) return 60;
  if (len === 5) return 50;
  if (len === 4) return 40;
  if (len === 3) return 30;
  if (len === 2) return 20;
  if (len === 1) return 10;
  return 0;
}

function startTimer() {
  if (timerStarted || gameEnded) return;
  timerStarted = true;
  updateTimeDisplay();
  timer = setInterval(() => {
    timeLeft--;
    updateTimeDisplay();
    if (timeLeft <= 0) {
      clearInterval(timer);
      timeSpan.textContent = "시간: 0초";
      stopGame();
      alert("게임 종료!");
    }
  }, 1000);
}

// 모달 버튼 이벤트 등록
document.querySelector('.continue-btn').addEventListener('click', () => {
  const pauseDialog = document.querySelector('dialog[data-type="pause"]');
  if (pauseDialog) pauseDialog.close();
  gameEnded = false;
  typingArea.disabled = false;
  timerStarted = false;
  startTimer();
  setTimeout(() => {
    typingArea.focus();
  }, 0);
});

document.querySelector('.retry-btn').addEventListener('click', () => {
  const pauseDialog = document.querySelector('dialog[data-type="pause"]');
  if (pauseDialog) pauseDialog.close();

  document.querySelectorAll('.penalty-image').forEach(img => img.remove());

  gameEnded = false;
  timerStarted = false;
  score = 0;
  timeLeft = 60;
  updateTimeDisplay();
  if (scoreSpan) scoreSpan.textContent = `점수: 0`;
  typingArea.value = '';
  typingArea.disabled = false;
  moles.forEach((mole, idx) => {
    mole.classList.remove("show", "hit");
    words[idx].textContent = "";
    words[idx].style.opacity = "1";
    if (mole.hideTimeout) clearTimeout(mole.hideTimeout);
    mole.hideTimeout = null;
    // frypan 이미지 숨기기
    const frypan = document.querySelector(`.frypan-img[data-mole="${idx}"]`);
    if (frypan) {
      frypan.classList.remove('hit', 'miss');
      frypan.style.opacity = 0;
      frypan.style.transform = '';
    }
  });
  moleTimers.forEach(t => clearTimeout(t));
  moleTimers = [];
  showRandomMoles();
  setTimeout(() => {
    typingArea.focus();
  }, 0);
});

document.querySelector('.main-btn').addEventListener('click', () => {
  window.location.href = '/src/pages/game-landing/whack-landing.html';
});



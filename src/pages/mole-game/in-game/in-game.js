import audioManager from '/src/scripts/audiomanager.js';
import { handleWhackPause } from '/src/components/modal/pause-modal/whack-pause.js';

// === 전역 변수 ===
let moles = document.querySelectorAll('.mole');
let words = document.querySelectorAll('.mole-word');
let wordContainer = document.querySelector('.mole-word-container');
let typingArea = document.querySelector('.typing-area');
let timeSpan = document.querySelector('.score-info span:nth-child(2)');
let scoreSpan = document.querySelector('.score-info span:first-child');

const wordList = [
  '사과',
  '바나나',
  '포도',
  '딸기',
  '자두',
  '고양이',
  '강아지',
  '토끼',
  '곰',
  '펭귄',
  '물고기',
  '코끼리',
  '호랑이',
  '원숭이',
  '사자',
  '자동차',
  '버스',
  '기차',
  '비행기',
  '지하철',
  '책상',
  '의자',
  '연필',
  '지우개',
  '노트',
  '컴퓨터',
  '마우스',
  '키보드',
  '모니터',
  '전화기',
  '라면',
  '김밥',
  '삼겹살',
  '불고기',
  '햄버거',
  '감자',
  '고구마',
  '수박',
  '오이',
  '당근',
  '커피',
  '우유',
  '주스',
  '물',
  '차',
  '축구',
  '농구',
  '야구',
  '배구',
  '탁구',
  '학교',
  '도서관',
  '병원',
  '식당',
  '시장',
  '친구',
  '가족',
  '어머니',
  '아버지',
  '동생',
  '태양',
  '달',
  '별',
  '하늘',
  '바람',
  '봄',
  '여름',
  '가을',
  '겨울',
  '비',
  '빵',
  '과자',
  '아이스크림',
  '치즈',
  '피자',
  '시계',
  '손톱',
  '가방',
  '신발',
  '장갑',
  '창문',
  '문',
  '벽',
  '바닥',
  '천장',
  '선생님',
  '학생',
  '화가',
  '의사',
  '요리사',
  '경찰',
  '소방관',
  '군인',
  '가수',
  '배우',
  '텔레비전',
  '신문',
  '사진',
  '연극',
  '노래',
];
const activeWords = new Set();

let timer = null;
let timeLeft = 60;
let timerStarted = false;
let score = 0;
let gameEnded = false;
let moleTimers = [];
let showMolesInterval = null; // 루프용 타이머 변수

// === 오디오 설정 ===
let bgmVolume = localStorage.getItem('bgmVolume');
if (bgmVolume === null) bgmVolume = 0.3;
else bgmVolume = Number(bgmVolume);

let sfxVolume = localStorage.getItem('sfxVolume');
if (sfxVolume === null) sfxVolume = 0.2;
else sfxVolume = Number(sfxVolume);

audioManager.setSource('/assets/audio/bgm/whack-Twelve-Speed-Slynk.mp3');
audioManager.audio.volume = bgmVolume;
audioManager.play();

const hitAudio = new Audio('/assets/audio/sfx/hitsound.mp3');
const laughAudio = new Audio('/assets/audio/sfx/laughsound.mp3');

// 효과음의 원래 볼륨 저장
hitAudio.defaultVolume = sfxVolume;
laughAudio.defaultVolume = sfxVolume;

hitAudio.volume = sfxVolume;
laughAudio.volume = sfxVolume;

// audiomanager에 등록
audioManager.setSfx({ hitAudio, laughAudio });

audioManager.setUI({
  iconSelector: '#soundIcon',
  buttonSelector: '#soundToggleBtn',
});

// --- 유틸 함수 ---
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

function normalize(str) {
  if (!str) return '';
  return str.trim().normalize('NFC');
}

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

// --- DOM 조작 및 UI 함수 ---
function showFrypanForMole(idx) {
  const mole = moles[idx];
  if (!wordContainer) return;

  let frypan = document.querySelector(`.frypan-img[data-mole="${idx}"]`);
  if (!frypan) {
    frypan = document.createElement('img');
    frypan.src = '/assets/images/frypan.png';
    frypan.className = 'frypan-img';
    frypan.setAttribute('data-mole', idx);
    wordContainer.appendChild(frypan);
  }
  const moleRect = mole.getBoundingClientRect();
  const containerRect = wordContainer.getBoundingClientRect();

  frypan.style.left = moleRect.right - containerRect.left - 75 + 'px';
  frypan.style.top = moleRect.top - containerRect.top - 100 + 'px';
  frypan.style.opacity = 1;

  const scales = [2.0, 1.3, 0.9, 1.8, 1.0, 1.6, 1.0, 1.7, 2.0, 1.9];
  frypan.style.setProperty('--frypan-scale', scales[idx]);
}

function positionWordAtMole(i) {
  if (!wordContainer || !moles[i] || !words[i]) return;

  const moleRect = moles[i].getBoundingClientRect();
  const containerRect = wordContainer.getBoundingClientRect();

  const scaleX = moleRect.width / moles[i].offsetWidth;
  const scaleY = moleRect.height / moles[i].offsetHeight;

  const left = (moleRect.left - containerRect.left) / scaleX + moles[i].offsetWidth / 2;
  const bottom = containerRect.height - (moleRect.top - containerRect.top) / scaleY + 10;

  words[i].style.left = `${left}px`;
  words[i].style.bottom = `${bottom}px`;
}

function updateWordBoxScale(idx) {
  const mole = moles[idx];
  const word = words[idx];
  if (!mole || !word) return;

  const rect = mole.getBoundingClientRect();
  word.style.width = rect.width + 'px';
  word.style.height = Math.max(25, rect.height * 0.3) + 'px';
  word.style.fontSize = Math.max(12, rect.height * 0.18) + 'px';
}

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

function updateTimeDisplay() {
  if (timeSpan) timeSpan.textContent = `시간: ${timeLeft}초`;
}

function showPenaltyImage() {
  const img = document.createElement('img');
  img.src = '/assets/images/molegame - penalty.png';
  img.alt = '패널티';
  img.className = 'penalty-image';

  // 게임 컨테이너 내부에 추가 (body 대신)
  const gameContainer = document.querySelector('.mole-game-container');
  if (gameContainer) {
    gameContainer.appendChild(img);
  } else {
    document.body.appendChild(img);
  }

  setTimeout(() => {
    if (img.parentNode) {
      img.parentNode.removeChild(img);
    }
  }, 8000);
}

// --- 주요 게임 기능 ---
function findMatchingVisibleMole(input) {
  for (let i = 0; i < moles.length; i++) {
    if (moles[i].classList.contains('show')) {
      const word = normalize(words[i].textContent);
      if (input === word && word.length > 0) return i;
    }
  }
  return -1;
}

function showRandomMoles() {
  // 기존에 show 중인 두더지 초기화
  moles.forEach((mole, idx) => {
    if (!mole.classList.contains('show')) {
      mole.classList.remove('show');
      words[idx].textContent = '';
      words[idx].style.opacity = '0';

      const frypan = document.querySelector(`.frypan-img[data-mole="${idx}"]`);
      if (frypan) {
        frypan.classList.remove('hit', 'miss');
        frypan.style.opacity = 0;
        frypan.style.transform = '';
      }
    }
  });

  const count = 4;
  const indexes = [];
  while (indexes.length < count) {
    const randIdx = Math.floor(Math.random() * moles.length);
    if (!indexes.includes(randIdx)) indexes.push(randIdx);
  }

  indexes.forEach((idx) => {
    const delay = Math.floor(Math.random() * 1200); // 0~1200ms 랜덤 딜레이

    const showTimer = setTimeout(() => {
      if (gameEnded) return;
      if (moles[idx].classList.contains('show')) return;

      moles[idx].classList.add('show');

      showFrypanForMole(idx);

      // 두더지 등장 시 단어 지정 및 위치 조정
      const wordTimer = setTimeout(() => {
        if (gameEnded) return;
        const uniqueWord = getUniqueRandomWord();
        words[idx].textContent = uniqueWord;
        words[idx].style.opacity = '1';
        positionWordAtMole(idx);
        updateWordBoxScale(idx);
      }, 800);
      moleTimers.push(wordTimer);

      // 두더지 hideTimeout 예약 + hideEndTime 저장
      if (moles[idx].hideTimeout) clearTimeout(moles[idx].hideTimeout);
      const hideDelay = 2200 + delay;
      moles[idx].hideEndTime = Date.now() + hideDelay;
      moles[idx].hideTimeout = setTimeout(() => {
        if (gameEnded) return;
        const wordToRemove = normalize(words[idx].textContent);
        if (wordToRemove) activeWords.delete(wordToRemove);

        moles[idx].classList.remove('show', 'hit');
        words[idx].textContent = '';
        words[idx].style.opacity = '0';
        moles[idx].hideTimeout = null;

        const frypan = document.querySelector(`.frypan-img[data-mole="${idx}"]`);
        if (frypan) {
          frypan.classList.remove('hit', 'miss');
          frypan.style.opacity = 0;
          frypan.style.transform = '';
        }
      }, hideDelay);
    }, delay);

    moleTimers.push(showTimer);
  });
}

function pauseGame() {
  if (gameEnded) return;
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  if (showMolesInterval) {
    clearInterval(showMolesInterval);
    showMolesInterval = null;
  }
  moleTimers.forEach(clearTimeout);
  moleTimers = [];

  // 각 두더지 hideTimeout를 클리어하고 남은 시간 계산
  moles.forEach((mole) => {
    if (mole.hideTimeout) {
      clearTimeout(mole.hideTimeout);
      mole.pauseRemain = mole.hideEndTime - Date.now();
      mole.hideTimeout = null;
    } else {
      mole.pauseRemain = 0;
    }
  });

  typingArea.disabled = true;

  const pauseDialog = document.querySelector('dialog[data-type="pause"]');
  if (pauseDialog) {
    handleWhackPause(pauseDialog, {
      continue: onContinueClick,
      retry: onRetryClick,
      main: onMainClick,
    });
    // pauseDialog.show();
  }
}

function stopGame() {
  if (gameEnded) return;
  gameEnded = true;

  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  if (showMolesInterval) {
    clearInterval(showMolesInterval);
    showMolesInterval = null;
  }

  moleTimers.forEach(clearTimeout);
  moleTimers = [];

  typingArea.disabled = true;
  localStorage.setItem('moleGameScore', score);

  // 결과 페이지 로드
  window.loadHTML('/src/pages/mole-game/mole-game-result/mole-game-result.html');
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
      timer = null;
      timeSpan.textContent = '시간: 0초';
      stopGame();
    }
  }, 1000);
}

function handleCorrectAnswer(matchedIdx) {
  const visibleMole = moles[matchedIdx];
  const wordBox = words[matchedIdx];
  const answer = normalize(wordBox.textContent);

  typingArea.value = '';
  const oldScore = score;
  const addedScore = getScoreByLength(answer);
  score += addedScore;
  animateScore(oldScore, score);

  hitAudio.play();

  wordBox.textContent = '';

  if (visibleMole.hideTimeout) clearTimeout(visibleMole.hideTimeout);

  const frypan = document.querySelector(`.frypan-img[data-mole="${matchedIdx}"]`);
  const moleImg = visibleMole.querySelector('.mole-img');

  if (frypan && moleImg) {
    frypan.classList.remove('miss');
    frypan.classList.add('hit');

    frypan.style.opacity = '1'; // 후라이팬 보이도록 opacity 조절

    wordBox.classList.add('rotate');

    const onFrypanAnimationEnd = (event) => {
      if (event.animationName.includes('frypan-hit')) {
        frypan.removeEventListener('animationend', onFrypanAnimationEnd);

        moleImg.classList.add('rotate');

        setTimeout(() => {
          visibleMole.classList.add('hide');
          visibleMole.classList.remove('show', 'hit');
          wordBox.style.opacity = '0';

          setTimeout(() => {
            moleImg.classList.remove('rotate');
            visibleMole.classList.remove('hide');
            wordBox.classList.remove('rotate');
            wordBox.style.opacity = '0';

            // 후라이팬 숨기기
            frypan.style.opacity = '0';
            frypan.classList.remove('hit');
          }, 500);
        }, 200);
      }
    };
    frypan.addEventListener('animationend', onFrypanAnimationEnd);
  } else {
    visibleMole.classList.add('hide');
    visibleMole.classList.remove('show', 'hit');
    const moleImgFallback = visibleMole.querySelector('.mole-img');
    if (moleImgFallback) moleImgFallback.classList.remove('rotate');
    setTimeout(() => {
      visibleMole.classList.remove('hide');
    }, 500);
  }

  wordBox.style.opacity = '1';

  if (answer) activeWords.delete(answer);

  visibleMole.hideTimeout = null;
}

function handleWrongAnswer() {
  laughAudio.play();

  typingArea.value = '';
  showPenaltyImage();
}

// === 이벤트 핸들러 모음 ===
function onTypingKeyDown(e) {
  const text = typingArea.value.trim();

  if (e.key === ' ') {
    e.preventDefault();
    if (text.length === 0) return;
  }

  if ((e.key === 'Enter' || e.key === ' ') && text.length > 0) {
    e.preventDefault();

    const input = normalize(typingArea.value);
    const matchedIdx = findMatchingVisibleMole(input);

    if (matchedIdx !== -1) {
      handleCorrectAnswer(matchedIdx);
    } else {
      handleWrongAnswer();
    }
  }
}

function onTypingInput() {
  if (!timerStarted && typingArea.value.trim().length > 0) {
    startTimer();
  }
}

function onPauseButtonClick() {
  pauseGame();
}

// === 여기에서 중요한 부분 ===
function onContinueClick() {
  gameEnded = false;
  typingArea.disabled = false;
  timerStarted = false;
  startTimer();

  if (showMolesInterval) clearInterval(showMolesInterval);
  showMolesInterval = setInterval(() => {
    if (!gameEnded) showRandomMoles();
  }, 4000);

  moles.forEach((mole, idx) => {
    if (mole.pauseRemain > 0) {
      mole.hideEndTime = Date.now() + mole.pauseRemain;
      mole.hideTimeout = setTimeout(() => {
        const wordToRemove = normalize(words[idx].textContent);
        if (wordToRemove) activeWords.delete(wordToRemove);

        mole.classList.remove('show', 'hit');
        words[idx].textContent = '';
        words[idx].style.opacity = '0';
        mole.hideTimeout = null;

        const frypan = document.querySelector(`.frypan-img[data-mole="${idx}"]`);
        if (frypan) {
          frypan.classList.remove('hit', 'miss');
          frypan.style.opacity = 0;
          frypan.style.transform = '';
        }
      }, mole.pauseRemain);
      mole.pauseRemain = 0;
    }
  });

  setTimeout(() => typingArea.focus(), 0);
}

function onRetryClick() {
  document.querySelectorAll('.penalty-image').forEach((img) => img.remove());

  gameEnded = false;
  timerStarted = false;
  score = 0;
  timeLeft = 60;
  updateTimeDisplay();
  animateScore(0, 0);
  typingArea.value = '';
  typingArea.disabled = false;

  moles.forEach((mole, idx) => {
    mole.classList.remove('show', 'hit');
    words[idx].textContent = '';
    words[idx].style.opacity = '1';
    if (mole.hideTimeout) clearTimeout(mole.hideTimeout);
    mole.hideTimeout = null;

    const frypan = document.querySelector(`.frypan-img[data-mole="${idx}"]`);
    if (frypan) {
      frypan.classList.remove('hit', 'miss');
      frypan.style.opacity = 0;
      frypan.style.transform = '';
    }
  });
  moleTimers.forEach(clearTimeout);
  moleTimers = [];
  showRandomMoles();

  if (showMolesInterval) clearInterval(showMolesInterval);
  showMolesInterval = setInterval(() => {
    if (!gameEnded) showRandomMoles();
  }, 4000);

  setTimeout(() => typingArea.focus(), 0);
}

function onMainClick() {
  window.loadHTML('/src/pages/game-landing/whack-landing.html');
}

function onWindowResize() {
  moles.forEach((mole, idx) => {
    if (mole.classList.contains('show')) {
      positionWordAtMole(idx);
      updateWordBoxScale(idx);
      showFrypanForMole(idx);
    }
  });
}

// === 초기화 함수 ===
function initializeGame() {
  if (showMolesInterval) {
    clearInterval(showMolesInterval);
    showMolesInterval = null;
  }

  timerStarted = false;
  gameEnded = false;
  timeLeft = 60;
  score = 0;
  updateTimeDisplay();
  animateScore(0, 0);

  moles.forEach((mole) => {
    if (mole.hideTimeout) clearTimeout(mole.hideTimeout);
    mole.hideTimeout = null;
    mole.classList.remove('show', 'hit', 'hide');
  });

  words.forEach((word) => {
    word.textContent = '';
    word.style.opacity = '1';
  });

  document.querySelectorAll('.frypan-img').forEach((fp) => {
    fp.classList.remove('hit', 'miss');
    fp.style.opacity = 0;
    fp.style.transform = '';
  });

  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  moleTimers.forEach(clearTimeout);
  moleTimers = [];

  words.forEach((_, idx) => {
    positionWordAtMole(idx);
    updateWordBoxScale(idx);
  });

  showRandomMoles();

  showMolesInterval = setInterval(() => {
    if (!gameEnded) showRandomMoles();
  }, 4000);

  attachEventListeners();

  typingArea.value = '';
  typingArea.disabled = false;
  typingArea.focus();

  window.removeEventListener('resize', onWindowResize);
  window.addEventListener('resize', onWindowResize);
}

// 이벤트 리스너 바인딩 함수
function attachEventListeners() {
  typingArea.removeEventListener('keydown', onTypingKeyDown);
  typingArea.removeEventListener('input', onTypingInput);

  typingArea.addEventListener('keydown', onTypingKeyDown);
  typingArea.addEventListener('input', onTypingInput);

  // pause 모달 버튼은 whack-pause.js에서만 바인딩

  const iconButtons = document.querySelectorAll('.icon-group .icon-button');
  const pauseBtn = iconButtons[1]; // 두 번째 버튼 (일시정지)
  if (pauseBtn) {
    pauseBtn.removeEventListener('click', onPauseButtonClick);
    pauseBtn.addEventListener('click', onPauseButtonClick);
  }
  const soundIconBtn = document.getElementById('soundToggleBtn');
  if (soundIconBtn) {
    soundIconBtn.removeEventListener('click', audioManager.toggleSound);
    soundIconBtn.addEventListener('click', audioManager.toggleSound);
  }
}

// 초기 실행
initializeGame();

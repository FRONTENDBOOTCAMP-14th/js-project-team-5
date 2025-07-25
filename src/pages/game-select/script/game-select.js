const bgmToggleBtn = document.getElementById('bgmToggleBtn');
const bgmIcon = document.getElementById('bgmIcon');

// 배경음악 설정
const BGM_AUDIO = new Audio('/assets/audio/bgm/[산성비]Disco Heart - Coyote Hearing.mp3');
BGM_AUDIO.loop = true;
BGM_AUDIO.volume = 0.5;
BGM_AUDIO.play();

let isBgmPlaying = true;

bgmToggleBtn.addEventListener('click', () => {
  isBgmPlaying = !isBgmPlaying;

  if (isBgmPlaying) {
    BGM_AUDIO.play();
    bgmIcon.src = '/assets/icons/sound-on.svg';
    bgmIcon.alt = '음악 켜짐';
  } else {
    BGM_AUDIO.pause();
    bgmIcon.src = '/assets/icons/sound-off.svg';
    bgmIcon.alt = '음악 꺼짐';
  }
});

// 뒤로가기 아이콘 클릭 로직

const BACK_BTN = document.getElementById('back-btn');

function goBack() {
  history.back();
}

BACK_BTN.addEventListener('click', goBack);

BACK_BTN.addEventListener('keydown', function (e) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    goBack();
  }
});

//modal

const modalOpenBtn = document.querySelector('.modal-open');
const modalDialog = document.querySelector('dialog.modal');
const closeBtn = document.querySelector('.modal-close-button');

if (modalOpenBtn && modalDialog) {
  // 모달 열기
  modalOpenBtn.addEventListener('click', () => {
    modalDialog.showModal();
  });

  // 모달 닫기 (닫기 버튼 클릭)
  closeBtn.addEventListener('click', () => {
    modalDialog.close();
  });

  // 모달 바깥 영역 클릭 시 닫기 (dialog 기본 기능)
  modalDialog.addEventListener('click', (e) => {
    // dialog 클릭인데 내부 modal-inner 클릭이 아니면 닫기
    if (e.target === modalDialog) {
      modalDialog.close();
    }
  });

  const settingBtn = document.getElementById('setting-btn');
  const modalOpenImg = settingBtn.querySelector('.modal-open');

  settingBtn.addEventListener('keydown', function (e) {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      modalOpenImg.click(); // 이미지 클릭 이벤트로 모달 열기
    }
  });

  // ESC키로 닫기 (dialog 기본 동작이지만, 원하는 경우 직접 처리 가능)
  // modalDialog.addEventListener('keydown', (e) => {
  //   if (e.key === 'Escape') {
  //     modalDialog.close();
  //   }
  // });
}

// slider

const RANGE = document.getElementById('bgm-range');
const PROGRESS_FILL = document.querySelector('.progress-fill');

// 기존 BGM_AUDIO 객체 사용
function updateBarAndVolume() {
  const value = parseInt(RANGE.value, 10);
  // 프로그레스바 연동
  PROGRESS_FILL.style.width = value + '%';
  // 0만 왼쪽만 라운드, 20 이상은 양쪽 라운드
  if (value === 0) {
    PROGRESS_FILL.style.borderRadius = '3.125rem 0 0 3.125rem';
  } else {
    PROGRESS_FILL.style.borderRadius = '3.125rem';
  }
  // BGM_AUDIO 볼륨 연동 (0~1로 변환)
  BGM_AUDIO.volume = value / 100;
}

updateBarAndVolume();
RANGE.addEventListener('input', updateBarAndVolume);

// toggle

const DEV_RADIO = document.getElementById('dev');
const NORMAL_RADIO = document.getElementById('normal');
const TOGGLE_RADIO = document.querySelector('.toggle-radio');

DEV_RADIO.addEventListener('change', function () {
  if (DEV_RADIO.checked) {
    TOGGLE_RADIO.classList.add('dev-checked');
    TOGGLE_RADIO.classList.remove('normal-checked');
  }
});

NORMAL_RADIO.addEventListener('change', function () {
  if (NORMAL_RADIO.checked) {
    TOGGLE_RADIO.classList.add('normal-checked');
    TOGGLE_RADIO.classList.remove('dev-checked');
  }
});

document.querySelectorAll('.toggle-radio .btn').forEach((label) => {
  label.addEventListener('keydown', function (e) {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      const radioId = label.getAttribute('for');
      const radio = document.getElementById(radioId);
      if (radio) {
        radio.checked = true;
        radio.dispatchEvent(new Event('change', { bubbles: true }));
        radio.focus();
      }
    }
  });
});

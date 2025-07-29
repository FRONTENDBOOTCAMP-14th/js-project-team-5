import audioManager from '/src/scripts/audiomanager.js';

audioManager.setSource('/assets/audio/bgm/acidrain-DiscoHeart-Coyote Hearing.mp3'); // 각자 필요한 배경음악 경로//
audioManager.audio.volume = 0.3;
audioManager.play();

audioManager.setUI({
  iconSelector: '#soundIcon',
  buttonSelector: '#soundToggleBtn',
});


const bgmRange = document.getElementById('bgm-range');
const progressFill = bgmRange?.parentElement.querySelector('.progress-fill');

function updateProgressFill(value) {
  if (progressFill) {
    progressFill.style.width = `${value}%`;
  }
}

if (bgmRange) {
  // 초기값 반영
  updateProgressFill(bgmRange.value);

  bgmRange.addEventListener('input', (e) => {
    const value = e.target.value;
    audioManager.audio.volume = value / 100;
    updateProgressFill(value);
  });
}

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

  const settingBtn = document.querySelector('.icon-button');
  const modalOpenImg = settingBtn.querySelector('.modal-open');

  settingBtn.addEventListener('keydown', function (e) {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      modalOpenImg.click(); // 이미지 클릭 이벤트로 모달 열기
    }
  });
}






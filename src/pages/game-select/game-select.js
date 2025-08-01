<<<<<<< HEAD
import audioManager from "/src/scripts/audiomanager.js";

audioManager.setSource(
  "/assets/audio/bgm/acidrain-DiscoHeart-Coyote-Hearing.mp3"
); // 각자 필요한 배경음악 경로//

=======
import audioManager from '/src/scripts/audiomanager.js';

audioManager.setSource('/assets/audio/bgm/acidrain-DiscoHeart-Coyote Hearing.mp3'); // 각자 필요한 배경음악 경로//
audioManager.audio.volume = 0.3;
audioManager.play();

audioManager.setUI({
  iconSelector: '#soundIcon',
  buttonSelector: '#soundToggleBtn',
});
>>>>>>> c2c4b36390fee8dbc92f5e44b611b59db353d07d


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
// 페이지 이동 방식이 원페이지에서 이루어졌을 떄 고려하면 맞는 방식이 아닐 수 있기 때문에 추후 다른 방식을 찾을 필요가 있음
// const BACK_BTN = document.getElementById("back-btn");

// function goBack() {
//   history.back();
// }

// BACK_BTN.addEventListener("click", goBack);

// BACK_BTN.addEventListener("keydown", function (e) {
//   if (e.key === "Enter" || e.key === " ") {
//     e.preventDefault();
//     goBack();
//   }
// });

const bgmRange = document.getElementById("bgm-range");
const progressFill = bgmRange?.parentElement.querySelector(".progress-fill");

function updateProgressFill(value) {
  if (progressFill) {
    progressFill.style.width = `${value}%`;
  }
}

if (bgmRange) {
  // 초기값 반영
  updateProgressFill(bgmRange.value);

  bgmRange.addEventListener("input", (e) => {
    const value = e.target.value;
    audioManager.audio.volume = value / 100;
    updateProgressFill(value);
  });
<<<<<<< HEAD
}
=======

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





>>>>>>> c2c4b36390fee8dbc92f5e44b611b59db353d07d

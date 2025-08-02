import audioManager from '/src/scripts/audiomanager.js';

audioManager.setSource('/assets/audio/bgm/acidrain-DiscoHeart-Coyote-Hearing.mp3'); // 각자 필요한 배경음악 경로//

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

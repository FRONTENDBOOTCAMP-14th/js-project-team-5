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

// document.querySelector('.page-move-btn').addEventListener('click', function () {
//   window.location.href = '/home'; // 이동하고 싶은 경로 넣기
// });

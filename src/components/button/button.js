const DEV_RADIO = document.getElementById('dev');
const NORMAL_RADIO = document.getElementById('normal');
const TOGGLE_RADIO = document.querySelector('.toggle-radio');

// 모달(혹은 페이지)이 열릴 때 실행: 저장된 값에 따라 체크
function setCheckedRadioFromStorage() {
  const savedMode = localStorage.getItem('dev-or-normal') || 'normal';
  if (savedMode === 'dev') {
    DEV_RADIO.checked = true;
    TOGGLE_RADIO.classList.add('dev-checked');
    TOGGLE_RADIO.classList.remove('normal-checked');
  } else {
    NORMAL_RADIO.checked = true;
    TOGGLE_RADIO.classList.add('normal-checked');
    TOGGLE_RADIO.classList.remove('dev-checked');
  }
}

document.querySelector('.icon-button').addEventListener('click', function () {
  setCheckedRadioFromStorage();
});

DEV_RADIO.addEventListener('change', function () {
  if (DEV_RADIO.checked) {
    TOGGLE_RADIO.classList.add('dev-checked');
    TOGGLE_RADIO.classList.remove('normal-checked');
    localStorage.setItem('dev-or-normal', 'dev');
  }
});

NORMAL_RADIO.addEventListener('change', function () {
  if (NORMAL_RADIO.checked) {
    TOGGLE_RADIO.classList.add('normal-checked');
    TOGGLE_RADIO.classList.remove('dev-checked');
    localStorage.setItem('dev-or-normal', 'normal');
  }
});

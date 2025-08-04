const DEV_RADIO = document.getElementById('dev');
const NORMAL_RADIO = document.getElementById('normal');
const TOGGLE_RADIO = document.querySelector('.toggle-radio');

function setCheckedRadioFromStorage() {
  // 함수 내부에서 매번 최신 DOM을 참조
  const DEV_RADIO = document.getElementById('dev');
  const NORMAL_RADIO = document.getElementById('normal');
  const TOGGLE_RADIO = document.querySelector('.toggle-radio');
  const savedMode = localStorage.getItem('dev-or-normal') || 'normal';
  if (!DEV_RADIO || !NORMAL_RADIO || !TOGGLE_RADIO) return;
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

const iconBtn = document.querySelector('.icon-button');
if (iconBtn) {
  iconBtn.addEventListener('click', setCheckedRadioFromStorage);
}

if (DEV_RADIO) {
  DEV_RADIO.addEventListener('change', function () {
    if (DEV_RADIO.checked) {
      TOGGLE_RADIO.classList.add('dev-checked');
      TOGGLE_RADIO.classList.remove('normal-checked');
      localStorage.setItem('dev-or-normal', 'dev');
    }
  });
}

if (NORMAL_RADIO) {
  NORMAL_RADIO.addEventListener('change', function () {
    if (NORMAL_RADIO.checked) {
      TOGGLE_RADIO.classList.add('normal-checked');
      TOGGLE_RADIO.classList.remove('dev-checked');
      localStorage.setItem('dev-or-normal', 'normal');
    }
  });
}

// 페이지 진입 시에도 동기화
setCheckedRadioFromStorage();

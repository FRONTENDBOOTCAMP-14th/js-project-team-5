const RANGE = document.getElementById('bgm-range');
const PROGRESS_FILL = document.querySelector('.progress-fill');
const AUDIO = document.getElementById('test-audio');

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
  // 오디오 볼륨 연동 (0~1로 변환)
  AUDIO.volume = value / 100;
}

updateBarAndVolume();
RANGE.addEventListener('input', updateBarAndVolume);



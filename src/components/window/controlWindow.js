(() => {
  const audio = document.getElementById('bg-audio');
  const image = document.querySelector('.window-start-image');
  const screen = document.querySelector('.window-screen-wrapper');

  function unmuteAudioOnce() {
    audio.muted = false;
    audio.play().catch(() => {}); // 해제 후 play 재시도
    document.removeEventListener('click', unmuteAudioOnce);
    document.removeEventListener('keydown', unmuteAudioOnce);
    document.removeEventListener('touchstart', unmuteAudioOnce);
    document.removeEventListener('mousemove', unmuteAudioOnce);
    document.removeEventListener('wheel', unmuteAudioOnce);
    document.removeEventListener('touchmove', unmuteAudioOnce);
    document.removeEventListener('pointerdown', unmuteAudioOnce);
  }

  if (audio && image && screen) {
    audio.muted = true;

    document.addEventListener('click', unmuteAudioOnce);
    document.addEventListener('keydown', unmuteAudioOnce);
    document.addEventListener('touchstart', unmuteAudioOnce);
    document.addEventListener('mousemove', unmuteAudioOnce);
    document.addEventListener('wheel', unmuteAudioOnce);
    document.addEventListener('touchmove', unmuteAudioOnce);
    document.addEventListener('pointerdown', unmuteAudioOnce);
    audio.play().catch((err) => {
      console.warn('자동재생이 차단되었을 수 있습니다:', err);
    });

    // 화면 진행 fallback: 5초 후 화면 강제 전환
    setTimeout(() => {
      image.style.display = 'none';
      screen.style.display = 'flex';
    }, 5000);

    audio.addEventListener('ended', () => {
      image.style.display = 'none';
      screen.style.display = 'flex';
    });
  } else {
    console.warn('audio 또는 image 또는 screen 요소를 찾지 못함');
  }
})();

function updateTime() {
  const now = new Date();
  const hh = now.getHours().toString().padStart(2, '0');
  const mm = now.getMinutes().toString().padStart(2, '0');
  document.getElementById('toolbar-time').textContent = `${hh}:${mm}`;
}
setInterval(updateTime, 1000);
updateTime();

document.querySelectorAll('.window-icon-item').forEach((item) => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.window-icon-item').forEach((el) => {
      el.classList.remove('window-icon-item__selected');
    });

    item.classList.add('window-icon-item__selected');
  });

  item.addEventListener('dblclick', () => {
    const role = item.dataset.role;
    const url = item.dataset.set;

    if (role === 'new-tab') {
      window.open(url, '_blank');
    } else if (role === 'new-page') {
      window.loadHTML('/src/pages/main-start-page/main-start-page.html');
    } else {
      console.warn('알 수 없는 역할:', role);
    }
  });
});

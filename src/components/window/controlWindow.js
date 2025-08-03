(() => {
  const audio = document.getElementById('bg-audio');
  const image = document.querySelector('.window-start-image');
  const screen = document.querySelector('.window-screen-wrapper');

  if (audio && image && screen) {
    audio.play().catch((err) => {
      console.warn('자동재생이 차단되었을 수 있습니다:', err);
    });

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

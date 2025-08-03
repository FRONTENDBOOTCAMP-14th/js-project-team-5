import audioManager from '/src/scripts/audiomanager.js';

const clickSfx = audioManager.sfxList?.clickSfx;
let isPlaying = false;

function playClickAndLoad(url) {
  if (!clickSfx || sessionStorage.getItem('isMuted') === 'true' || isPlaying) {
    setTimeout(() => window.loadHTML(url), 80);
    return;
  }
  isPlaying = true;
  clickSfx.currentTime = 0;
  clickSfx
    .play()
    .catch((err) => {
      if (err && err.name === 'AbortError') return;
      console.error(err);
    })
    .finally(() => {
      isPlaying = false;
      setTimeout(() => {
        clickSfx.pause();
        window.loadHTML(url);
      }, 80);
    });
}

let backButton = document.querySelector('#back-btn');
backButton.addEventListener('click', (e) => {
  e.preventDefault();
  playClickAndLoad('/src/pages/main-start-page/main-start-page.html');
});

document.querySelectorAll('.card-wrapper .card').forEach((card) => {
  card.addEventListener('click', (e) => {
    e.preventDefault();
    const link = card.getAttribute('data-link');
    playClickAndLoad(link);
  });
});

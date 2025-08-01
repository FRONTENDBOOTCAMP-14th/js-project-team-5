import audioManager from '/src/scripts/audiomanager.js';

let backButton = document.querySelector('#back-btn');

backButton.addEventListener('click', () => {
  loadHTML('/src/pages/main-start-page/main-start-page.html');
}
)

audioManager.setSource('/assets/audio/bgm/acidrain-DiscoHeart-Coyote-Hearing.mp3');
audioManager.audio.volume = 0.3;
audioManager.play();

audioManager.setUI({
  iconSelector: '#soundIcon',
  buttonSelector: '#soundToggleBtn',
});



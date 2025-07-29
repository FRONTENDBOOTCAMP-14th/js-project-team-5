import audioManager from '/src/scripts/audiomanager.js';

audioManager.setSource('/assets/audio/bgm/main-XRayVision-Slynk.mp3');
audioManager.audio.volume = 0.3;
audioManager.play();

audioManager.setUI({
  iconSelector: '#soundIcon',
  buttonSelector: '#soundToggleBtn',
});

import audioManager from '../../scripts/audiomanager.js';

document.addEventListener('DOMContentLoaded', () => {
  audioManager.setSource('/assets/audio/bgm/main-XRayVision-Slynk.mp3');
  audioManager.audio.volume = 0.3;

  audioManager.setUI({
    iconSelector: '#soundIcon',
    buttonSelector: '#soundToggleBtn',
  });

  // 사용자가 버튼을 누르면 처음 play 시도
  document.querySelector('#soundToggleBtn').addEventListener('click', () => {
    if (!audioManager.isPlaying()) {
      audioManager.play();
    }
  });
});

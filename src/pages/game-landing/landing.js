import audioManager from '../../scripts/audiomanager.js';

let backButton = document.querySelector('#back-btn');

backButton.addEventListener('click', () => {
  window.loadHTML('/src/pages/game-select/game-select.html');
}
)

document.querySelectorAll('#game-start-card').forEach((card) => {
  card.addEventListener('click', () => {
    const link = card.getAttribute('data-link');
    window.loadHTML(link)
  });
});h

// .landing 요소에서 data-game 값 읽기
const landingDiv = document.querySelector('.landing');
const gameType = landingDiv?.dataset.game;

// 게임별 BGM 파일 매핑
const bgmMap = {
  main: '/assets/audio/bgm/main-XRayVision-Slynk.mp3',
  quiz: '/assets/audio/bgm/quiz-WildPogo-Francis-Preve.mp3',
  defense: '/assets/audio/bgm/defense-Komputo-FrancisPreve.mp3',
  acidrain: '/assets/audio/bgm/acidrain-DiscoHeart-Coyote-Hearing.mp3',
  whack: '/assets/audio/bgm/whack-Twelve-Speed-Slynk.mp3',
};

// 해당 게임의 BGM 경로 선택 (없으면 main BGM)
const bgmSrc = bgmMap[gameType] || bgmMap.main;

audioManager.setSource(bgmSrc);
audioManager.audio.volume = 0.3;
audioManager.play();

audioManager.setUI({
  iconSelector: '#soundIcon',
  buttonSelector: '#soundToggleBtn',
});

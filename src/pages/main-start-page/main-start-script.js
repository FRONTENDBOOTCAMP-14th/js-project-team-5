import { loadHTML } from '/src/components/monitor/controlMonitor.js';
import { clickSfx } from '/src/components/slider/slider.js';

document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault(); // 폼 제출 등 기본 동작 방지
    if (clickSfx) {
      clickSfx.currentTime = 0;
      clickSfx.play();
    }
    loadHTML('/src/pages/game-select/game-select.html');
  }
});

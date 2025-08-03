document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault(); // 폼 제출 등 기본 동작 방지
    window.loadHTML('/src/pages/game-select/game-select.html');
  }
});

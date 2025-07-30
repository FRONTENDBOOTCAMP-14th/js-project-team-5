//다음페이지 이동 
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      loadHTML('/src/pages/game-select/game-select.html');
    }
  });
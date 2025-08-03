let backButton = document.querySelector('#back-btn');
backButton.addEventListener('click', () => {
  window.loadHTML('/src/pages/game-select/game-select.html');
});

document.querySelectorAll('#game-start-card').forEach((card) => {
  card.addEventListener('click', () => {
    const link = card.getAttribute('data-link');

    window.loadHTML(link);
  });
});

let backButton = document.querySelector('#back-btn');
backButton.addEventListener('click', () => {
  window.loadHTML('/src/pages/main-start-page/main-start-page.html');
});

document.querySelectorAll('.card-wrapper .card').forEach((card) => {
  card.addEventListener('click', () => {
    const link = card.getAttribute('data-link');
    window.loadHTML(link);
  });
});

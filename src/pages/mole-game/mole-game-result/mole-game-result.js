export function initializeResultPage() {
  // 점수 표시
  const scoreNumber = document.querySelector('.score-number');
  const scoreRaw = localStorage.getItem('moleGameScore');
  const finalScore = Number(scoreRaw) || 1350;
  if (scoreNumber) scoreNumber.textContent = finalScore.toLocaleString();

  // 버튼 이벤트 연결
  const regameBtn = document.querySelector('.regame.btn');
  const moveMainBtn = document.querySelector('.move-main.btn');

  if (regameBtn) {
    regameBtn.addEventListener('click', () => {
      loadHTML('/src/pages/mole-game/in-game/in-game.html');
    });
  }
  if (moveMainBtn) {
    moveMainBtn.addEventListener('click', () => {
      loadHTML('/src/pages/game-landing/whack-landing.html');
    });
  }
}

initializeResultPage();

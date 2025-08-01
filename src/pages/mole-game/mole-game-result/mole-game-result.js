document.addEventListener('DOMContentLoaded', () => {
  const scoreText = document.querySelector('.score-text');
  const scoreNumber = document.querySelector('.score-number');
  const brownMole = document.querySelector('.brown-mole.fade-target');
  const goldenMole = document.querySelector('.golden-mole.fade-target');
  const buttons = document.querySelectorAll('.button-container button.fade-target');
  const score = localStorage.getItem('moleGameScore') || 0;
  if (scoreNumber) scoreNumber.textContent = score.toLocaleString();
  // 점수 초기화
  if (scoreNumber) scoreNumber.textContent = '0';

  // 초기 상태: opacity 0
  [scoreText, scoreNumber, brownMole, goldenMole, ...buttons].forEach((el) => {
    if (el) el.classList.remove('fade-in');
  });

  setTimeout(() => {
    if (scoreText) scoreText.classList.add('fade-in');
  }, 300);
  setTimeout(() => {
    if (scoreNumber) scoreNumber.classList.add('fade-in');
  }, 900);
  setTimeout(() => {
    if (brownMole) brownMole.classList.add('fade-in');
  }, 1300);
  setTimeout(() => {
    if (goldenMole) goldenMole.classList.add('fade-in');
  }, 1700);

  buttons.forEach((btn, idx) => {
    setTimeout(
      () => {
        btn.classList.add('fade-in');
      },
      2100 + idx * 400
    );
  });

  // 모든 fade-in이 끝난 뒤(마지막 버튼 기준) 카운팅 시작
  const finalScore = 350; // 원하는 임의의 점수로 지정
  const countStartDelay = 2100 + (buttons.length - 1) * 400 + 700;

  setTimeout(() => {
    // 효과음 재생
    const audio = new Audio('/assets/audio/sfx/score.wav');
    audio.play();

    // 카운팅 애니메이션
    const duration = 2000;
    const frameRate = 60;
    const totalFrames = Math.round(duration / (1000 / frameRate));
    let frame = 0;

    function animate() {
      frame++;
      const progress = frame / totalFrames;
      const current = Math.round(finalScore * progress);
      if (scoreNumber) scoreNumber.textContent = current.toLocaleString();
      if (frame < totalFrames) {
        requestAnimationFrame(animate);
      } else {
        if (scoreNumber) scoreNumber.textContent = finalScore.toLocaleString();
      }
    }
    animate();
  }, countStartDelay);
});

window.addEventListener('DOMContentLoaded', () => {
  const scoreNumber = document.querySelector('.score-number');
  const score = localStorage.getItem('moleGameScore') || 0;
  if (scoreNumber) scoreNumber.textContent = score.toLocaleString();
});

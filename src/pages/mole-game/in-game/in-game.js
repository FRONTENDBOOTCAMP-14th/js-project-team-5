const holes = document.querySelectorAll('.mole-hole');

// 구멍마다 두더지 요소 추가
holes.forEach((hole) => {
  const mole = document.createElement('div');
  mole.className = 'mole';
  hole.appendChild(mole);
});

function showRandomMole() {
  // 모든 두더지 숨기기
  document.querySelectorAll('.mole').forEach((mole) => mole.classList.remove('show'));

  // 랜덤 구멍 선택
  const randomIdx = Math.floor(Math.random() * holes.length);
  const mole = holes[randomIdx].querySelector('.mole');
  mole.classList.add('show');

  // 2초 뒤에 사라지기
  setTimeout(() => {
    mole.classList.remove('show');
  }, 2000);
}

// 예시: 1초마다 랜덤 두더지 등장
setInterval(showRandomMole, 1000);

document.querySelectorAll('.mole').forEach((mole) => {
  mole.classList.add('show');
});




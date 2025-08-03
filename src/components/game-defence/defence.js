import { wordList } from './dict.js';

// 1️⃣ 상태 변수
let gameState = 'title'; // 'title' | 'fadeout' | 'game'
let fadeAlpha = 0;
let currentSpeed = 0.5; // 몬스터 기본 이동 속도
let score = 0; // 점수
let timer = 0; // 경과 시간 (초)
let towerHealth = 100; // 타워 체력

let monsters = [];
let attacks = [];
let timerInterval;

// 타워 중심 좌표
const towerX = 800;
const towerY = 400;

// 2️⃣ 캔버스 & 오디오 & UI 참조
const canvas = document.querySelector('.defence-game-frame');
const ctx = canvas.getContext('2d');
canvas.width = 1600;
canvas.height = 800;

const audioTitle = document.getElementById('bg-audio-title');
const audioGame = document.getElementById('bg-audio-game');
const statusBar = document.querySelector('.status-bar');
const typingIn = document.querySelector('.typing-input');

// 초기 숨김
statusBar.style.display = 'none';
typingIn.style.display = 'none';

// 3️⃣ 타이틀 브금 자동 재생
(() => {
  if (audioTitle) {
    audioTitle.volume = 0.5;
    audioTitle.currentTime = 0;
    audioTitle.play().catch((err) => console.warn('타이틀 브금 재생 실패:', err));
  }
})();

// 4️⃣ 이미지 로드
const backgroundImg = new Image();
backgroundImg.src = '/assets/images/defence-main.jpg';
const titleImg = new Image();
titleImg.src = '/assets/images/defence-title.png';
const startBtnImg = new Image();
startBtnImg.src = '/assets/images/defence-start.png';
const exitBtnImg = new Image();
exitBtnImg.src = '/assets/images/defence-exit.png';
const playBgImg = new Image();
playBgImg.src = '/assets/images/defence-play-bg.jpg';
const towerImg = new Image();
towerImg.src = '/assets/images/defence-tower.png';
const monster1Img = new Image();
monster1Img.src = '/assets/images/Monster-1.png';
const monster2Img = new Image();
monster2Img.src = '/assets/images/Monster-2.png';
const monster3Img = new Image();
monster3Img.src = '/assets/images/Monster-3.png';
const attackImg = new Image();
attackImg.src = '/assets/images/defence-attack.png';

let imagesLoaded = 0;
const totalImages = 10;
[backgroundImg, titleImg, startBtnImg, exitBtnImg, playBgImg, towerImg, monster1Img, monster2Img, monster3Img, attackImg].forEach((img) => {
  img.onload = () => {
    if (++imagesLoaded === totalImages) start();
  };
});

// 5️⃣ 버튼 위치
const button = { x: towerX - 150, y: towerY + 40, width: 300, height: 80 };
const exitButton = { x: towerX - 100, y: button.y + 100, width: 200, height: 60 };

// 6️⃣ Monster / Attack 클래스
class Monster {
  constructor(x, y, word, speed, img) {
    this.x = x;
    this.y = y;
    this.word = word;
    this.speed = speed;
    this.score = word.length * 10 || 100;
    this.img = img;
    this.isHit = false;
    this.fadeAlpha = 1;
  }
  update(tx, ty) {
    if (this.isHit) return;
    const dx = tx - this.x,
      dy = ty - this.y;
    const d = Math.hypot(dx, dy);
    if (d > 0) {
      this.x += (dx / d) * this.speed;
      this.y += (dy / d) * this.speed;
    }
  }
  draw(ctx) {
    let size = 64;
    if (this.img === monster2Img) size *= 1.5;
    else if (this.img === monster3Img) size *= 2;

    ctx.save();
    // 좌측 몬스터는 좌우 반전
    if (this.x < towerX) {
      ctx.translate(this.x, this.y);
      ctx.scale(-1, 1);
      if (this.isHit) {
        this.fadeAlpha -= 0.03;
        ctx.globalAlpha = Math.max(this.fadeAlpha, 0);
      }
      ctx.drawImage(this.img, -size / 2, -size / 2, size, size);
    } else {
      if (this.isHit) {
        this.fadeAlpha -= 0.03;
        ctx.globalAlpha = Math.max(this.fadeAlpha, 0);
      }
      ctx.drawImage(this.img, this.x - size / 2, this.y - size / 2, size, size);
    }
    ctx.restore();

    ctx.fillStyle = 'black';
    ctx.font = '16px KIMM, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(this.word, this.x, this.y - size / 2 - 8);
  }
  isDead() {
    return this.isHit && this.fadeAlpha <= 0;
  }
}

class Attack {
  constructor(sx, sy, tx, ty) {
    this.x = sx;
    this.y = sy;
    this.tx = tx;
    this.ty = ty;
    this.speed = 12;
    this.done = false;
  }
  update() {
    const dx = this.tx - this.x,
      dy = this.ty - this.y;
    const d = Math.hypot(dx, dy);
    if (d < this.speed) {
      this.done = true;
      return;
    }
    this.x += (dx / d) * this.speed;
    this.y += (dy / d) * this.speed;
  }
  draw(ctx) {
    const size = 32;
    ctx.drawImage(attackImg, this.x - size / 2, this.y - size / 2, size, size);
  }
}

// 7️⃣ 게임 시작 후 초기화
function start() {
  render();
  typingIn.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    const val = e.target.value.trim();
    e.target.value = '';
    if (!val) return;

    const targets = monsters.filter((m) => !m.isHit && m.word === val);
    if (!targets.length) return;

    // 가장 가까운 타겟 찾기
    let closest = targets[0];
    let minD = Math.hypot(closest.x - towerX, closest.y - towerY);
    targets.slice(1).forEach((m) => {
      const d = Math.hypot(m.x - towerX, m.y - towerY);
      if (d < minD) {
        closest = m;
        minD = d;
      }
    });

    // 히트 처리
    closest.isHit = true;
    launchAttack(closest);
    addScore(closest.score);

    // 몬스터2 추가 1마리
    if (closest.img === monster2Img) {
      const extra = monsters
        .filter((m) => !m.isHit && m.img === monster1Img)
        .sort((a, b) => Math.hypot(a.x - towerX, a.y - towerY) - Math.hypot(b.x - towerX, b.y - towerY))
        .slice(0, 1);
      extra.forEach((m) => {
        m.isHit = true;
        launchAttack(m);
        addScore(m.score);
      });
    }

    // 몬스터3 추가 3마리 + 속도 증가
    if (closest.img === monster3Img) {
      currentSpeed += 0.2;
      const extra3 = monsters
        .filter((m) => !m.isHit && m.img === monster1Img)
        .sort((a, b) => Math.hypot(a.x - towerX, a.y - towerY) - Math.hypot(b.x - towerX, b.y - towerY))
        .slice(0, 3);
      extra3.forEach((m) => {
        m.isHit = true;
        launchAttack(m);
        addScore(m.score);
      });
    }
  });
}

// 8️⃣ 몬스터 소환 & 점수
function spawnMonster1() {
  const R = 1000;
  const ang =
    Math.random() < 0.5
      ? Math.random() * (Math.PI / 2) - Math.PI / 4 // 오른쪽 -45° ~ +45°
      : Math.random() * (Math.PI / 2) + (Math.PI * 3) / 4; // 왼쪽 135° ~ 225°
  const x = towerX + Math.cos(ang) * R;
  const y = towerY + Math.sin(ang) * R;
  const w = wordList[Math.floor(Math.random() * wordList.length)];
  monsters.push(new Monster(x, y, w, currentSpeed, monster1Img));
}
function spawnMonster2() {
  const R = 1000;
  const ang =
    Math.random() < 0.5
      ? Math.random() * (Math.PI / 2) - Math.PI / 4 // 오른쪽 -45° ~ +45°
      : Math.random() * (Math.PI / 2) + (Math.PI * 3) / 4; // 왼쪽 135° ~ 225°
  const x = towerX + Math.cos(ang) * R;
  const y = towerY + Math.sin(ang) * R;
  const w1 = wordList[Math.floor(Math.random() * wordList.length)];
  const w2 = wordList[Math.floor(Math.random() * wordList.length)];
  monsters.push(new Monster(x, y, w1 + w2, currentSpeed * 2, monster2Img));
}
function spawnMonster3() {
  const R = 1000;
  const ang =
    Math.random() < 0.5
      ? Math.random() * (Math.PI / 2) - Math.PI / 4 // 오른쪽 -45° ~ +45°
      : Math.random() * (Math.PI / 2) + (Math.PI * 3) / 4; // 왼쪽 135° ~ 225°
  const x = towerX + Math.cos(ang) * R;
  const y = towerY + Math.sin(ang) * R;
  const w1 = wordList[Math.floor(Math.random() * wordList.length)];
  const w2 = wordList[Math.floor(Math.random() * wordList.length)];
  const w3 = wordList[Math.floor(Math.random() * wordList.length)];
  const w4 = wordList[Math.floor(Math.random() * wordList.length)];
  monsters.push(new Monster(x, y, w1 + w2 + w3 + w4, currentSpeed * 0.5, monster3Img));
}

function startMonsterSpawnLoop() {
  setInterval(() => {
    if (gameState === 'game') spawnMonster1();
  }, 2000);
  setInterval(() => {
    if (gameState === 'game') spawnMonster2();
  }, 10000);
  setInterval(() => {
    if (gameState === 'game') spawnMonster3();
  }, 30000);
  timerInterval = setInterval(() => {
    if (gameState === 'game') {
      timer++;
      statusBar.querySelectorAll('span')[1].textContent = `시간: ${timer}초`;
    }
  }, 1000);
}

function launchAttack(mon) {
  attacks.push(new Attack(towerX, towerY, mon.x, mon.y));
}
function addScore(pt) {
  score += pt;
  statusBar.querySelectorAll('span')[0].textContent = `점수: ${score}`;
}

// 9️⃣ 렌더링 루프
function render() {
  ctx.clearRect(0, 0, 1600, 800);

  if (gameState === 'title') {
    ctx.drawImage(backgroundImg, 0, 0, 1600, 800);
    ctx.drawImage(titleImg, 400, -50, 800, 600);
    ctx.drawImage(startBtnImg, button.x, button.y, button.width, button.height);
    ctx.drawImage(exitBtnImg, exitButton.x, exitButton.y, exitButton.width, exitButton.height);
  } else if (gameState === 'fadeout') {
    ctx.drawImage(backgroundImg, 0, 0, 1600, 800);
    ctx.drawImage(titleImg, 400, -50, 800, 600);
    ctx.drawImage(startBtnImg, button.x, button.y, button.width, button.height);
    ctx.drawImage(exitBtnImg, exitButton.x, exitButton.y, exitButton.width, exitButton.height);
    fadeAlpha += 0.02;
    if (fadeAlpha >= 1) {
      gameState = 'game';
      statusBar.style.display = 'flex';
      typingIn.style.display = 'inline-block';
      typingIn.focus();
      startMonsterSpawnLoop();
    }
    ctx.fillStyle = `rgba(0,0,0,${fadeAlpha})`;
    ctx.fillRect(0, 0, 1600, 800);
  } else {
    // 배경 & 타워
    ctx.drawImage(playBgImg, 0, 0, 1600, 800);
    ctx.drawImage(towerImg, towerX - 64, towerY - 64, 128, 128);

    // 🔴 타워 체력바
    const barW = 150,
      barH = 10;
    ctx.fillStyle = 'grey';
    ctx.fillRect(towerX - barW / 2, towerY - 80, barW, barH);
    ctx.fillStyle = 'red';
    ctx.fillRect(towerX - barW / 2, towerY - 80, barW * (towerHealth / 100), barH);

    // 몬스터 업데이트 & 충돌
    for (let i = monsters.length - 1; i >= 0; i--) {
      const m = monsters[i];
      m.update(towerX, towerY);

      // 타워에 닿으면 데미지 & 제거
      const dist = Math.hypot(m.x - towerX, m.y - towerY);
      if (!m.isHit && dist < m.speed) {
        let dmg = 0;
        if (m.img === monster1Img) dmg = 5;
        else if (m.img === monster2Img) dmg = 10;
        else if (m.img === monster3Img) {
          dmg = 20;
          currentSpeed += 0.1; // 충돌 후에도 속도 증가
        }
        towerHealth = Math.max(0, towerHealth - dmg);
        monsters.splice(i, 1);
        continue;
      }

      m.draw(ctx);
      if (m.isDead()) monsters.splice(i, 1);
    }

    // 공격 이펙트
    for (let i = attacks.length - 1; i >= 0; i--) {
      attacks[i].update();
      attacks[i].draw(ctx);
      if (attacks[i].done) attacks.splice(i, 1);
    }
  }

  requestAnimationFrame(render);
}

// 10️⃣ 클릭 이벤트 처리
canvas.addEventListener('click', (e) => {
  const r = canvas.getBoundingClientRect();
  const mx = ((e.clientX - r.left) / r.width) * 1600;
  const my = ((e.clientY - r.top) / r.height) * 800;

  if (gameState === 'title' && mx >= button.x && mx <= button.x + button.width && my >= button.y && my <= button.y + button.height) {
    gameState = 'fadeout';
    fadeAlpha = 0;
    statusBar.querySelectorAll('span')[1].textContent = `시간: ${timer}초`;
    audioTitle.pause();
    audioGame.volume = 0.5;
    audioGame.currentTime = 0;
    audioGame.play().catch(() => {});
  }

  if (mx >= exitButton.x && mx <= exitButton.x + exitButton.width && my >= exitButton.y && my <= exitButton.y + exitButton.height) {
    alert('게임 종료');
  }
});

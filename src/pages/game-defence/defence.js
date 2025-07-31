import { wordList } from './dict.js';

//상태 변수
let gameState = 'title'; // 'title' | 'fadeout' | 'game' | 'gameover'
let fadeAlpha = 0;
let score = 0;
let timer = 0;
let towerHealth = 100;
let finalScore = 0;
let finalTime = 0; // 초 단위
let monsters = [];
let attacks = [];
let timerInterval;
let spawnInterval1;
let spawnInterval2;
let spawnInterval3;
let currentSpeed = 0.5;
let gameOverButtons = [];

//타워 중심 좌표
const towerX = 800;
const towerY = 400;

//참조
const canvas = document.querySelector('.defence-game-frame');
const ctx = canvas.getContext('2d');
canvas.width = 1600;
canvas.height = 800;

const audioTitle = document.getElementById('bg-audio-title');
const audioGame = document.getElementById('bg-audio-game');
const statusBar = document.querySelector('.status-bar');
const typingIn = document.querySelector('.typing-input');

//초기 숨김
statusBar.style.display = 'none';
typingIn.style.display = 'none';

//타이틀 브금 자동 재생
(() => {
  if (audioTitle) {
    audioTitle.volume = 0.5;
    audioTitle.currentTime = 0;
    audioTitle.play().catch((err) => console.warn('타이틀 브금 재생 실패:', err));
  }
})();

//이미지 전체 로드
const images = {};
const toLoad = [
  ['background', '/assets/images/defence-main.jpg'],
  ['title', '/assets/images/defence-title.png'],
  ['startBtn', '/assets/images/defence-start.png'],
  ['exitBtn', '/assets/images/defence-exit.png'],
  ['playBg', '/assets/images/defence-play-bg.jpg'],
  ['tower', '/assets/images/defence-tower.png'],
  ['m1', '/assets/images/Monster-1.png'],
  ['m2', '/assets/images/Monster-2.png'],
  ['m3', '/assets/images/Monster-3.png'],
  ['attack', '/assets/images/defence-attack.png'],
  ['gameOver', '/assets/images/defence-game-over.jpg'],
];
let loaded = 0;
toLoad.forEach(([key, src]) => {
  const img = new Image();
  img.src = src;
  img.onload = () => {
    images[key] = img;
    if (++loaded === toLoad.length) start();
  };
});

//타이틀 버튼 위치
const button = { x: towerX - 150, y: towerY + 40, width: 300, height: 80 };
const exitButton = { x: towerX - 100, y: button.y + 100, width: 200, height: 60 };

//몬스터 클래스
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
    if (this.img === images.m2) size *= 1.5;
    else if (this.img === images.m3) size *= 2;
    ctx.save();
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
    ctx.font = '20px KIMM, sans-serif';
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
    ctx.drawImage(images.attack, this.x - size / 2, this.y - size / 2, size, size);
  }
}

//게임 시작
function start() {
  render();
  typingIn.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    const val = e.target.value.trim();
    e.target.value = '';
    if (!val) return;
    const targets = monsters.filter((m) => !m.isHit && m.word === val);
    if (!targets.length) return;
    // 가장 가까운 타겟
    let closest = targets[0];
    let minD = Math.hypot(closest.x - towerX, closest.y - towerY);
    targets.slice(1).forEach((m) => {
      const d = Math.hypot(m.x - towerX, m.y - towerY);
      if (d < minD) {
        closest = m;
        minD = d;
      }
    });
    // 히트
    closest.isHit = true;
    launchAttack(closest);
    addScore(closest.score);
    // 추가 처리
    if (closest.img === images.m2) {
      const extra = monsters
        .filter((m) => !m.isHit && m.img === images.m1)
        .sort((a, b) => Math.hypot(a.x - towerX, a.y - towerY) - Math.hypot(b.x - towerX, b.y - towerY))
        .slice(0, 1);
      extra.forEach((m) => {
        m.isHit = true;
        launchAttack(m);
        addScore(m.score);
      });
    }
    if (closest.img === images.m3) {
      currentSpeed += 0.2;
      const extra3 = monsters
        .filter((m) => !m.isHit && m.img === images.m1)
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

//몬스터 소환 함수
function spawnMonster(type) {
  const R = 1000;
  const ang = Math.random() < 0.5 ? Math.random() * (Math.PI / 2) - Math.PI / 4 : Math.random() * (Math.PI / 2) + (Math.PI * 3) / 4;
  const x = towerX + Math.cos(ang) * R;
  const y = towerY + Math.sin(ang) * R;
  let word = wordList[Math.floor(Math.random() * wordList.length)];
  let speed = currentSpeed;
  let img = images.m1;
  if (type === 2) {
    speed = currentSpeed * 2;
    img = images.m2;
  }
  if (type === 3) {
    word += wordList[Math.floor(Math.random() * wordList.length)] + wordList[Math.floor(Math.random() * wordList.length)] + wordList[Math.floor(Math.random() * wordList.length)];
    speed = currentSpeed / 2;
    img = images.m3;
  }
  monsters.push(new Monster(x, y, word, speed, img));
}

function startMonsterSpawnLoop() {
  spawnInterval1 = setInterval(() => {
    if (gameState === 'game') spawnMonster(1);
  }, 2000);
  spawnInterval2 = setInterval(() => {
    if (gameState === 'game') spawnMonster(2);
  }, 10000);
  spawnInterval3 = setInterval(() => {
    if (gameState === 'game') spawnMonster(3);
  }, 30000);
  timerInterval = setInterval(() => {
    if (gameState === 'game') {
      timer++;
      const spans = statusBar.querySelectorAll('span');
      spans[1].textContent = `시간: ${timer}초`;
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

//게임 오버
function gameOver() {
  gameState = 'gameover';
  finalScore = score;
  finalTime = timer;
  score = 0;
  timer = 0;
  towerHealth = 100;
  currentSpeed = 0.5;
  monsters = [];
  attacks = [];
  statusBar.querySelectorAll('span')[0].textContent = `점수: ${score}`;
  clearInterval(timerInterval);
  clearInterval(spawnInterval1);
  clearInterval(spawnInterval2);
  clearInterval(spawnInterval3);
  typingIn.style.display = 'none';
}

// 화면 랜더링
function render() {
  if (gameState === 'title') {
    ctx.clearRect(0, 0, 1600, 800);
    ctx.drawImage(images.background, 0, 0, 1600, 800);
    ctx.drawImage(images.title, 400, -50, 800, 600);
    ctx.drawImage(images.startBtn, button.x, button.y, button.width, button.height);
    ctx.drawImage(images.exitBtn, exitButton.x, exitButton.y, exitButton.width, exitButton.height);

    if (statusBar && statusBar.style.display !== 'none') statusBar.style.display = 'none';
    if (statusBar && typingIn.style.display !== 'none') typingIn.style.display = 'none';
  } else if (gameState === 'fadeout') {
    fadeAlpha += 0.02;
    if (fadeAlpha >= 1) {
      gameState = 'game';

      if (statusBar && statusBar.style.display !== 'flex') statusBar.style.display = 'flex';
      if (statusBar && typingIn.style.display !== 'inline-block') typingIn.style.display = 'inline-block';
      typingIn.focus();
      startMonsterSpawnLoop();
    }
    ctx.fillStyle = `rgba(0,0,0,${fadeAlpha})`;
    ctx.fillRect(0, 0, 1600, 800);
  } else if (gameState === 'game') {
    ctx.clearRect(0, 0, 1600, 800);
    ctx.drawImage(images.playBg, 0, 0, 1600, 800);
    ctx.drawImage(images.tower, towerX - 64, towerY - 64, 128, 128);
    // 체력바
    const barW = 150,
      barH = 10;
    ctx.fillStyle = 'grey';
    ctx.fillRect(towerX - barW / 2, towerY - 80, barW, barH);
    ctx.fillStyle = 'red';
    ctx.fillRect(towerX - barW / 2, towerY - 80, barW * (towerHealth / 100), barH);
    // 몬스터
    for (let i = monsters.length - 1; i >= 0; i--) {
      const m = monsters[i];
      m.update(towerX, towerY);
      const dist = Math.hypot(m.x - towerX, m.y - towerY);
      if (!m.isHit && dist < m.speed) {
        let dmg = m.img === images.m1 ? 5 : m.img === images.m2 ? 10 : 20;
        towerHealth = Math.max(0, towerHealth - dmg);
        if (towerHealth <= 0) {
          gameOver();
          requestAnimationFrame(render);
          return;
        }
        monsters.splice(i, 1);
        continue;
      }
      m.draw(ctx);
      if (m.isDead()) monsters.splice(i, 1);
    }
    for (let i = attacks.length - 1; i >= 0; i--) {
      attacks[i].update();
      attacks[i].draw(ctx);
      if (attacks[i].done) attacks.splice(i, 1);
    }
  } else if (gameState === 'gameover') {
    ctx.clearRect(0, 0, 1600, 800);
    ctx.drawImage(images.gameOver, 0, 0, 1600, 800);
    ctx.fillStyle = '#ff3333';
    ctx.textAlign = 'center';
    ctx.font = 'bold 48px KIMM, sans-serif';
    ctx.fillText('최종 점수', 800, 250);
    ctx.font = 'bold 72px KIMM, sans-serif';
    ctx.fillText(finalScore, 800, 320);
    ctx.font = 'bold 48px KIMM, sans-serif';
    ctx.fillText('버틴 시간', 800, 400);
    const min = Math.floor(finalTime / 60),
      sec = finalTime % 60;
    ctx.font = 'bold 64px KIMM, sans-serif';
    ctx.fillText(`${min}분 ${sec}초`, 800, 470);
    // 버튼
    const btnW = 220,
      btnH = 60,
      btnY = 560;
    const xs = [800 - btnW * 1.6, 800 - btnW / 2, 800 + btnW * 0.6];
    ['리더보드 등록', '다시하기', '메인화면'].forEach((txt, i) => {
      const x = xs[i];
      ctx.fillStyle = 'white';
      ctx.fillRect(x, btnY, btnW, btnH);
      ctx.fillStyle = '#ff3333';
      ctx.font = 'bold 24px KIMM, sans-serif';
      ctx.fillText(txt, x + btnW / 2, btnY + 38);
    });
    gameOverButtons = xs.map((x, i) => ({ x, y: btnY, w: btnW, h: btnH, action: i === 0 ? 'leaderboard' : i === 1 ? 'retry' : 'main' }));
  }

  requestAnimationFrame(render);
}

//버튼 클릭 등
canvas.addEventListener('click', (e) => {
  const r = canvas.getBoundingClientRect();
  const mx = ((e.clientX - r.left) / r.width) * 1600;
  const my = ((e.clientY - r.top) / r.height) * 800;

  if (gameState === 'title') {
    if (mx >= button.x && mx <= button.x + button.width && my >= button.y && my <= button.y + button.height) {
      gameStart();
    }
    if (mx >= exitButton.x && mx <= exitButton.x + exitButton.width && my >= exitButton.y && my <= exitButton.y + exitButton.height) {
      alert('게임 종료');
    }
  } else if (gameState === 'gameover') {
    gameOverButtons.forEach((btn) => {
      if (mx >= btn.x && mx <= btn.x + btn.w && my >= btn.y && my <= btn.y + btn.h) {
        if (btn.action === 'retry') {
          gameStart();
        }
        if (btn.action === 'main') {
          audioGame.pause();
          audioTitle.volume = 0.5;
          audioTitle.currentTime = 0;
          audioTitle.play().catch((err) => console.warn('타이틀 브금 재생 실패:', err));
          gameState = 'title';
        }
        if (btn.action === 'leaderboard') alert('리더보드 등록 기능은 준비 중입니다.');
      }
    });
  }
});

function gameStart() {
  gameState = 'fadeout';
  fadeAlpha = 0;
  statusBar.querySelectorAll('span')[1].textContent = `시간: ${timer}초`;
  audioTitle.pause();
  audioGame.volume = 0.5;
  audioGame.currentTime = 0;
  audioGame.play().catch(() => {});
}

import { setupPauseDialogClickHandler } from './pause-util.js';
import { gameStart, 
  goToMainMenu, 
  pauseGame, 
  resumeGame  } from '/src/pages/game-defence/defence.js';

/**
 * 디펜스(Defense) 게임에서 일시정지 모달의 버튼 클릭 핸들러를 설정한다.
 *
 * 이 함수는 pause 모달('<dialog>' 요소)에 대해 디펜스 게임 전용 pause 로직을 바인딩하며,
 * 버튼 클릭 시 수행할 동작을 'setupPauseDialogClickHandler'를 통해 등록한다.
 *
 * 각 버튼의 동작은 다음과 같다.
 * - '.continue-btn': 게임을 계속 진행
 * - '.retry-btn': 게임을 처음부터 다시 시작
 * - '.main-btn': 메인 화면으로 이동
 *
 * @param {HTMLDialogElement} dialog - 일시정지 모달 '<dialog>' 요소
 */
export function handleDefensePause(dialog) {
  // ① Pause 버튼 클릭 시 pauseGame() → 모달 열기
  document.querySelectorAll('.modal-open[data-type="pause"]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      pauseGame();
      dialog.showModal();
    });
  });

  // ② 모달 버튼 핸들러
  setupPauseDialogClickHandler(dialog, {
    continue: () => {
      // 모달 닫히면 다시 인터벌 재시작
      resumeGame();
    },
    retry: () => {
      gameStart();      // gameStart() 내부에서 gameOver(false) → 클리어 + 재시작
    },
    main: () => {
      goToMainMenu();   // goToMainMenu() 내부에서 gameOver(false)
    },
  });
}
import { handleQuizPause } from './pause-modal/quiz-pause.js';
import { handleDefensePause } from './pause-modal/defense-pause.js';
import { handleAcidRainPause } from './pause-modal/acidrain-pause.js';
import { handleWhackPause } from './pause-modal/whack-pause.js';

/**
 * 현재 게임의 타입(`data-game` 속성)을 기준으로 적절한 일시정지 모달 핸들러를 호출합니다.
 *
 * 이 함수는 `<body>` 요소의 `data-game` 속성을 읽어, 각 게임별 pause 핸들러
 * (`handleWhackPause`, `handleQuizPause`, `handleDefensePause`, `handleAcidRainPause`)를 호출합니다.
 *
 * - 게임 타입이 지정되지 않은 경우, 경고 로그를 출력하고 종료됩니다.
 * - 지원하지 않는 게임 타입의 경우, 에러를 발생시킵니다.
 *
 * @param {HTMLDialogElement} dialog - 일시정지 모달 `<dialog>` 요소
 *
 * @throws {Error} 알 수 없는 게임 타입이 지정된 경우 예외를 발생시킵니다.
 */
export function handlePauseModal(dialog) {
  // 1. 게임 타입 확인 (acidrain, defense, whack, quiz)
  const gameType = document.body.dataset.game;
  if (!gameType) {
    console.warn('게임 타입이 지정되지 않았습니다.');
    return;
  }

  switch (gameType) {
    case 'whack':
      handleWhackPause(dialog);
      break;
    case 'quiz':
      handleQuizPause(dialog);
      break;
    case 'defense':
      handleDefensePause(dialog);
      break;
    case 'acidrain':
      handleAcidRainPause(dialog);
      break;
    default:
      throw new Error(`Unknown pause modal type: ${gameType}`);
  }
}

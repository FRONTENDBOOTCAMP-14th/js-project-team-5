import { setupPauseDialogClickHandler } from './pause-util.js';

/**
 * 일시정지 모달의 버튼 클릭 핸들러를 바인딩한다.
 * @param {HTMLDialogElement} dialog - 일시정지 모달 <dialog> 요소
 * @param {Object} handlers - { continue, retry, main } 핸들러 객체
 */
export function handleAcidRainPause(dialog, handlers) {
  setupPauseDialogClickHandler(dialog, handlers);
}

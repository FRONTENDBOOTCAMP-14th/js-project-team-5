import { setupPauseDialogClickHandler } from './pause-util.js';

/**
 * 산성비(Acid Rain) 게임에서 일시정지 모달의 버튼 클릭 핸들러를 설정한다.
 *
 * 이 함수는 pause 모달('<dialog>' 요소)에 대해 산성비 게임 전용 pause 로직을 바인딩하며,
 * 버튼 클릭 시 수행할 동작을 'setupPauseDialogClickHandler'를 통해 등록한다.
 *
 * 각 버튼의 동작은 다음과 같다.
 * - '.continue-btn': 게임을 계속 진행
 * - '.retry-btn': 게임을 처음부터 다시 시작
 * - '.main-btn': 메인 화면으로 이동
 *
 * @param {HTMLDialogElement} dialog - 일시정지 모달 '<dialog>' 요소
 */
/**
 * 산성비(Acid Rain) 게임에서 일시정지 모달의 버튼 클릭 핸들러를 바인딩한다.
 * @param {HTMLDialogElement} dialog - 일시정지 모달 <dialog> 요소
 * @param {Object} handlers - { continue, retry, main } 핸들러 객체
 */
export function handleAcidRainPause(dialog, handlers) {
  setupPauseDialogClickHandler(dialog, handlers);
}

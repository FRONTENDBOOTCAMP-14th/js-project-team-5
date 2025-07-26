/**
 * 일시정지 모달(dialog)에 클릭 이벤트 핸들러를 등록한다.
 *
 * 세 가지 버튼에 대한 처리를 담당한다.
 * - '.continue-btn': 게임 계속하기
 * - '.retry-btn': 게임 다시 시작
 * - '.main-btn': 메인 화면으로 이동
 *
 * 이미 이벤트 리스너가 등록된 경우, 중복 등록을 방지한다.
 *
 * @param {HTMLDialogElement} dialog - 클릭 이벤트를 처리할 '<dialog>' 요소
 * @param {Object} handlers - 각 버튼에 대응하는 콜백 핸들러 객체
 * @param {Function} [handlers.continue] - '.continue-btn' 클릭 시 호출될 함수
 * @param {Function} [handlers.retry] - '.retry-btn' 클릭 시 호출될 함수
 * @param {Function} [handlers.main] - '.main-btn' 클릭 시 호출될 함수
 */
export function setupPauseDialogClickHandler(dialog, handlers) {
  // 이미 이벤트 리스너가 등록된 상태라면 중복 방지
  if (dialog.dataset.listenerAttached === 'true') return;

  // 이벤트 리스너가 등록되었음을 표시
  dialog.dataset.listenerAttached = 'true';

  dialog.addEventListener('click', (e) => {
    const target = e.target;
    if (!target.matches('.continue-btn, .retry-btn, .main-btn')) return;
    e.preventDefault();

    if (target.matches('.continue-btn') && handlers.continue) {
      handlers.continue();
      dialog.close();
    } else if (target.matches('.retry-btn') && handlers.retry) {
      handlers.retry();
      dialog.close();
    } else if (target.matches('.main-btn') && handlers.main) {
      handlers.main();
      dialog.close();
    }
  });
}

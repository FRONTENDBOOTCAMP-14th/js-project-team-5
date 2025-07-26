/**
 * 설정 모달의 이벤트 핸들러를 등록한다.
 * - 닫기 버튼(.exit-button) 클릭 시 모달을 닫고 inert 해제 및 메인 화면으로 이동한다.
 * @param {HTMLDialogElement} dialog - 설정 모달(dialog) 요소
 */
export function handleSettingsModal(dialog) {
  const exitBtn = dialog.querySelector('.exit-button');
  if (exitBtn) {
    exitBtn.addEventListener('click', () => {
      dialog.close(); // 모달 닫기 및 inert 해제
      // 게임 종료 및 메인 화면 이동 로직 추가
      window.location.href = '/'; // 임시로 루트로 이동하게 해둠.
    });
  }
}

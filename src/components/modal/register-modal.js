/**
 * 닉네임 등록 모달 핸들러
 * --------------------------------------------------
 * - 모달 내부 `#nickname-register-form`을 찾아 `submit` 이벤트를 가로챕니다.
 * - 입력값(`#nickname-input`)을 trim 후 닉네임이 비어 있지 않으면
 *   ▶ TODO: 서버 전송 등 등록 로직 실행
 *   ▶ 폼 리셋 → 모달 닫기
 *
 * @param {HTMLDialogElement} dialog  닉네임 등록 `<dialog>` 요소
 */
export function handleRegisterModal(dialog) {
  // 닉네임 입력 폼 처리 (존재하는 경우만)
  const form = dialog.querySelector('#nickname-register-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const input = form.querySelector('#nickname-input');
      const nickname = input?.value.trim();

      if (nickname) {
        // 닉네임이 유효한 경우 처리
        // 여기에 닉네임 등록 로직 추가
        // 예: 서버에 닉네임 전송 등

        form.reset(); // 입력 폼 초기화
        dialog.close();
      }
    });
  }
}

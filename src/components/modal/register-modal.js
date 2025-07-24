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

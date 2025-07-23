{
  const modalContainers = document.querySelectorAll('.modal-container');

  modalContainers.forEach((container) => {
    const openButton = container.querySelector('.modal-open');
    const dialog = container.querySelector('dialog.modal');

    if (!openButton || !dialog) return;

    // 모달 열기 버튼
    openButton.addEventListener('click', () => {
      dialog.showModal();
    });

    // 모달 닫기 버튼 (이벤트 위임)
    dialog.addEventListener('click', (e) => {
      const closeButton = e.target.closest('.modal-close-button');
      if (closeButton) {
        dialog.close();
      }
    });

    // 닉네임 입력 폼 처리 (존재하는 경우만)
    const form = dialog.querySelector('#nickname-register-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        const input = form.querySelector('#nickname-input');
        const nickname = input?.value.trim();

        if (nickname) {
          form.reset();
          dialog.close();
        }
      });
    }
  });
}

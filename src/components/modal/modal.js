import { handleCommonModal } from './common-modal.js';
import { handlePauseModal } from './pause-modal.js';
import { handleRegisterModal } from './register-modal.js';

const modalOpenButtons = document.querySelectorAll('.modal-open');

// 모든 모달 열기 버튼 처리
modalOpenButtons.forEach((button) => {
  // 우선 data-type이 있는 경우
  const type = button.dataset.type;
  const subtype = button.dataset.subtype;

  if (!type) return;

  // 해당 타입의 모달 찾기
  const dialog = document.querySelector(`dialog.modal[data-type="${type}"]`);
  if (!dialog) return;

  // 열기 이벤트
  button.addEventListener('click', () => {
    // 공통 모달일 경우 subtype 처리
    if (type === 'common' && subtype) {
      dialog.dataset.subtype = subtype;
    }

    dialog.showModal();

    // 타입에 따른 JS 분기 처리
    switch (type) {
      case 'common':
        handleCommonModal(dialog, subtype);
        break;
      case 'pause':
        handlePauseModal(dialog);
        break;
      case 'register':
        handleRegisterModal(dialog);
        break;
    }
  });

  // 닫기 버튼 처리 (한 번만 바인딩)
  if (!dialog.dataset.closeBound) {
    dialog.addEventListener('click', (e) => {
      const closeBtn = e.target.closest('.modal-close-button');
      if (closeBtn) dialog.close();
    });
    dialog.dataset.closeBound = 'true';
  }
});

import { handleDescriptionModal } from './description.js';
import { handleScoreboardModal } from './scoreboard.js';
import { handleSettingsModal } from './settings.js';
import { handlePauseModal } from './pause-modal.js';
import { handleRegisterModal } from './register-modal.js';

{
  const modalOpenButtons = document.querySelectorAll('.modal-open');

  // 모든 모달 열기 버튼 처리
  modalOpenButtons.forEach((button) => {
    // data-type이 있는 경우
    const type = button.dataset.type;

    if (!type) return;

    // 해당 타입의 모달 찾기
    const dialog = document.querySelector(`dialog.modal[data-type="${type}"]`);
    if (!dialog) return;

    // 열기 이벤트
    button.addEventListener('click', () => {
      // 다이얼로그를 열기 전의 포커스된 요소를 저장 (닫힐 때 복원용)
      const previouslyFocusedElement = document.activeElement;

      dialog.show();
      trapFocus(dialog); // 포커스 트랩 추가

      // 타입에 따른 JS 분기 처리
      switch (type) {
        case 'description':
          handleDescriptionModal(dialog);
          break;
        case 'scoreboard':
          handleScoreboardModal(dialog);
          break;
        case 'settings':
          handleSettingsModal(dialog);
          break;
        case 'pause':
          handlePauseModal(dialog);
          break;
        case 'register':
          handleRegisterModal(dialog);
          break;
      }
      // 다이얼로그가 닫힐 때 포커스 복원
      // 'close' 이벤트는 dialog.close()에 의해 발생하거나, Escape 키를 누를 때 발생
      // dialog.show()로 열었을 때는 Escape 키로 닫히지 않으므로, trapFocus에서 Escape를 처리해야 한다.
      dialog.addEventListener(
        'close',
        () => {
          if (previouslyFocusedElement && typeof previouslyFocusedElement.focus === 'function') {
            previouslyFocusedElement.focus();
          }
        },
        { once: true }
      ); // 한 번만 실행되도록
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
}

/**
 * 포커스 가능한 요소를 반환한다.
 *
 * @param {HTMLElement} element - 포커스를 찾을 기준 요소
 * @returns {HTMLElement[]} - 포커스 가능한 요소 배열
 */
function getFocusableElements(element) {
  const selector = ['button:not([disabled])', '[href]', 'input:not([disabled])', 'select:not([disabled])', 'textarea:not([disabled])', '[tabindex]:not([tabindex="-1"]):not([disabled])'].join(',');

  const elements = element.querySelectorAll(selector);

  // 화면에 실제 보이는 요소만 필터링
  const visibleElements = Array.from(elements).filter((el) => {
    return el.offsetWidth > 0 || el.offsetHeight > 0;
  });

  return visibleElements;
}

/**
 * keydown 핸들러를 생성한다.
 *
 * @param {HTMLElement} firstEl 첫 포커스 요소
 * @param {HTMLElement} lastEl 마지막 포커스 요소
 * @param {HTMLDialogElement} dialog 대상 모달
 * @returns {Function} keydown 이벤트 핸들러
 */
function createKeydownHandler(firstEl, lastEl, dialog) {
  return function handleKeydown(e) {
    if (e.key === 'Tab') {
      const isForward = !e.shiftKey;

      if (isForward && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      } else if (!isForward && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      }
    }
  };
}

/**
 * 다이얼로그 닫힘 핸들러를 생성한다.
 *
 * @param {HTMLDialogElement} dialog 대상 모달
 * @param {Function} keydownHandler keydown 이벤트 핸들러
 * @param {HTMLElement} [prevFocusedEl] 이전 포커스 복원용 요소
 * @returns {Function} close 이벤트 핸들러
 */
function createCloseHandler(dialog, keydownHandler, prevFocusedEl) {
  return function handleClose() {
    dialog.removeEventListener('keydown', keydownHandler);
    dialog.removeEventListener('close', handleClose);

    if (prevFocusedEl && typeof prevFocusedEl.focus === 'function') {
      prevFocusedEl.focus();
    }
  };
}

/**
 * 포커스를 trap하고, Escape 키로 닫기 및 포커스 복원까지 처리
 *
 * @param {HTMLDialogElement} dialog 대상 모달
 */
function trapFocus(dialog) {
  const focusableElements = getFocusableElements(dialog);
  if (focusableElements.length === 0) return;

  const firstEl = focusableElements[0];
  const lastEl = focusableElements[focusableElements.length - 1];

  const prevFocusedEl = document.activeElement;

  // 렌더 후 포커스 이동
  requestAnimationFrame(() => {
    firstEl.focus();
  });

  const keydownHandler = createKeydownHandler(firstEl, lastEl, dialog);
  const closeHandler = createCloseHandler(dialog, keydownHandler, prevFocusedEl);

  dialog.addEventListener('keydown', keydownHandler);
  dialog.addEventListener('close', closeHandler);
}

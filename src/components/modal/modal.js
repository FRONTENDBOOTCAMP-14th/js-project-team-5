import { handleDescriptionModal } from './description.js';
import { handleScoreboardModal } from './scoreboard.js';
import { handleSettingsModal } from './settings.js';
import { handlePauseModal } from './pause-modal.js';
import { handleRegisterModal } from './register-modal.js';

{
  const modalOpenButtons = document.querySelectorAll('.modal-open');

  modalOpenButtons.forEach((button) => {
    const type = button.dataset.type;
    if (!type) return;

    const dialog = document.querySelector(`dialog.modal[data-type="${type}"]`);
    if (!dialog) return;

    button.addEventListener('click', () => {
      const previouslyFocusedElement = document.activeElement;

      dialog.show();
      trapFocus(dialog); // 포커스 트랩 + 모니터 요소 inert 처리

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

      dialog.addEventListener(
        'close',
        () => {
          if (previouslyFocusedElement?.focus) {
            previouslyFocusedElement.focus();
          }
        },
        { once: true }
      );
    });

    // 닫기 버튼 처리
    if (!dialog.dataset.closeBound) {
      dialog.addEventListener('click', (e) => {
        const closeBtn = e.target.closest('.modal-close-button');
        if (closeBtn) dialog.close();
      });
      dialog.dataset.closeBound = 'true';
    }
  });
}

// trapFocus 관련 전역 변수
const trapFocusState = {
  dialog: null,
  firstEl: null,
  lastEl: null,
  prevFocusedEl: null,
};

/**
 * 모달에 포커스 트랩을 적용하고, 모니터 프레임 내 모달 외 요소를 inert 처리한다.
 * @param {HTMLDialogElement} dialog - 포커스 트랩을 적용할 모달(dialog) 요소
 */
function trapFocus(dialog) {
  // 포커스 가능한 요소 찾기
  const selector = ['button:not([disabled])', '[href]', 'input:not([disabled])', 'select:not([disabled])', 'textarea:not([disabled])', '[tabindex]:not([tabindex="-1"]):not([disabled])'].join(',');
  const focusableElements = Array.from(dialog.querySelectorAll(selector)).filter((el) => el.offsetWidth > 0 || el.offsetHeight > 0);
  if (focusableElements.length === 0) return;

  trapFocusState.dialog = dialog;
  trapFocusState.firstEl = focusableElements[0];
  trapFocusState.lastEl = focusableElements[focusableElements.length - 1];
  trapFocusState.prevFocusedEl = document.activeElement;

  document.body.classList.add('modal-opened');

  requestAnimationFrame(function () {
    trapFocusState.firstEl.focus();
  });

  // 모니터 내 모달 외 요소 inert 처리
  const container = dialog.closest('.monitor-frame');
  if (container) {
    Array.from(container.children).forEach((el) => {
      if (!el.contains(dialog)) {
        el.setAttribute('inert', '');
      }
    });
  }

  dialog.addEventListener('keydown', trapFocusKeydownHandler);
  dialog.addEventListener('close', trapFocusCloseHandler);
  document.addEventListener('focusin', trapFocusFocusInHandler);
}

/**
 * Tab 키를 눌렀을 때 포커스가 모달 내부에서만 순환되도록 처리한다.
 * @param {KeyboardEvent} e - 키보드 이벤트 객체
 */
function trapFocusKeydownHandler(e) {
  if (e.key === 'Tab') {
    const isForward = !e.shiftKey;
    if (isForward && document.activeElement === trapFocusState.lastEl) {
      e.preventDefault();
      trapFocusState.firstEl.focus();
    } else if (!isForward && document.activeElement === trapFocusState.firstEl) {
      e.preventDefault();
      trapFocusState.lastEl.focus();
    }
  }
}

/**
 * 포커스가 모달 내부에 없으면 강제로 첫 번째 포커스 가능한 요소로 이동시킨다.
 */
function trapFocusFocusInHandler() {
  if (trapFocusState.dialog && !trapFocusState.dialog.contains(document.activeElement)) {
    trapFocusState.firstEl.focus();
  }
}

/**
 * 모달이 닫힐 때 포커스 트랩, inert 처리, body 클래스 등을 해제하고 이전 포커스를 복원한다.
 */
function trapFocusCloseHandler() {
  trapFocusState.dialog.removeEventListener('keydown', trapFocusKeydownHandler);
  trapFocusState.dialog.removeEventListener('close', trapFocusCloseHandler);
  document.removeEventListener('focusin', trapFocusFocusInHandler);

  // inert 해제
  const container = trapFocusState.dialog.closest('.monitor-frame');
  if (container) {
    Array.from(container.children).forEach((el) => {
      el.removeAttribute('inert');
    });
  }
  document.body.classList.remove('modal-opened');

  if (trapFocusState.prevFocusedEl?.focus) {
    trapFocusState.prevFocusedEl.focus();
  }

  trapFocusState.dialog = null;
  trapFocusState.firstEl = null;
  trapFocusState.lastEl = null;
  trapFocusState.prevFocusedEl = null;
}

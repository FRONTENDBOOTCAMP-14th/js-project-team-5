import { handleDescriptionModal } from './common-modal-content/description.js';
import { handleSettingsModal } from './common-modal-content/settings.js';
import { handleScoreboardModal } from './common-modal-content/scoreboard.js';

/**
 * 공통 모달 컨트롤러
 * - 모달 제목을 subtype에 맞춰 갱신한 뒤, 각 서브타입 전용 핸들러를 호출한다.
 *
 * @param {HTMLDialogElement} dialogEl  대상 모달 요소
 * @param {'description'|'settings'|'scoreboard'} subtype  모달 종류
 */
export function handleCommonModal(dialogEl, subtype) {
  // subtype에 따라 모달 내용 처리
  const titleEl = dialogEl.querySelector('.modal-title');

  const titleMap = {
    description: '게임 설명',
    settings: '설정',
    scoreboard: '점수판',
  };

  if (titleEl && subtype && titleMap[subtype]) {
    titleEl.textContent = titleMap[subtype];
  }

  switch (subtype) {
    case 'description':
      handleDescriptionModal(dialogEl);
      break;
    case 'scoreboard':
      handleScoreboardModal(dialogEl);
      break;
    case 'settings':
      handleSettingsModal(dialogEl);
      break;
    default:
      console.warn('알 수 없는 공통 모달 subtype:', subtype);
  }
}

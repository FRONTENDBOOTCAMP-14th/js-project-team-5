import { handleDescriptionModal } from './common-modal-content/description.js';
import { handleSettingsModal } from './common-modal-content/settings.js';
import { handleScoreboardModal } from './common-modal-content/scoreboard.js';

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

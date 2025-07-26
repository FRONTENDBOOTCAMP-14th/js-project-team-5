import { setupPauseDialogClickHandler } from './pause-util.js';

/**
 * 디펜스(Defense) 게임에서 일시정지 모달의 버튼 클릭 핸들러를 설정한다.
 *
 * 이 함수는 pause 모달('<dialog>' 요소)에 대해 디펜스 게임 전용 pause 로직을 바인딩하며,
 * 버튼 클릭 시 수행할 동작을 'setupPauseDialogClickHandler'를 통해 등록한다.
 *
 * 각 버튼의 동작은 다음과 같다.
 * - '.continue-btn': 게임을 계속 진행
 * - '.retry-btn': 게임을 처음부터 다시 시작
 * - '.main-btn': 메인 화면으로 이동
 *
 * @param {HTMLDialogElement} dialog - 일시정지 모달 '<dialog>' 요소
 */
export function handleDefensePause(dialog) {
  // console.log는 디버깅용으로 사용
  // 분기와 이벤트 리스너가 잘 작동하는지 확인하고,
  // 기존에 있던 console.log는 제거하고 필요한 로직만 남기기
  setupPauseDialogClickHandler(dialog, {
    continue: () => {
      console.log('디펜스 계속하기');
      // 디펜스 계속하기 로직
    },
    retry: () => {
      console.log('디펜스 다시하기');
      // 디펜스 다시하기 로직
    },
    main: () => {
      console.log('디펜스 메인 화면으로 이동');
      // 메인 화면 이동 로직
    },
  });
}

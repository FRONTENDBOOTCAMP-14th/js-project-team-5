import { setupPauseDialogClickHandler } from './pause-util.js';

/**
 * 두더지 잡기(Whack-a-Mole) 게임에서 일시정지 모달의 버튼 클릭 핸들러를 설정합니다.
 *
 * 이 함수는 pause 모달(dialog)에 대해 게임별 pause 로직을 바인딩하며,
 * 버튼 클릭 시 실행될 콜백 함수를 `setupPauseDialogClickHandler`를 통해 등록합니다.
 *
 * 각 버튼의 동작은 다음과 같습니다:
 * - `.continue-btn`: 게임을 계속 진행
 * - `.retry-btn`: 게임을 처음부터 다시 시작
 * - `.main-btn`: 메인 화면으로 이동
 *
 * @param {HTMLDialogElement} dialog - 일시정지 모달 `<dialog>` 요소
 */
export function handleWhackPause(dialog) {
  // console.log는 디버깅용으로 사용
  // 분기와 이벤트 리스너가 잘 작동하는지 확인하고,
  // 기존에 있던 console.log는 제거하고 필요한 로직만 남기기
  setupPauseDialogClickHandler(dialog, {
    continue: () => {
      console.log('두더지 잡기 계속하기');
      // 두더지 잡기 계속하기 로직
    },
    retry: () => {
      console.log('두더지 잡기 다시하기');
      // 두더지 잡기 다시하기 로직
    },
    main: () => {
      console.log('두더지 잡기 메인 화면으로 이동');
      // 메인 화면 이동 로직
    },
  });
}

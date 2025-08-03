import audioManager from '/src/scripts/audiomanager.js';

/**
 * 설정 모달의 이벤트 핸들러를 등록한다.
 * - 닫기 버튼(.exit-button) 클릭 시 모달을 닫고 inert 해제 및 메인 화면으로 이동한다.
 * @param {HTMLDialogElement} dialog - 설정 모달(dialog) 요소
 */
export function handleSettingsModal(dialog) {
  const exitBtn = dialog.querySelector('.exit-button');
  if (exitBtn) {
    exitBtn.addEventListener('click', () => {
      // 모든 오디오(BGM, SFX) 멈추기
      audioManager.pause(); // BGM 정지
      if (audioManager.sfxList) {
        Object.values(audioManager.sfxList).forEach((sfx) => {
          sfx.pause && sfx.pause();
          sfx.currentTime = 0;
        });
      }
      // 모달 닫기
      dialog.close();
      // 닫힌 후에만 loadHTML 실행 (close 이벤트 1회성 바인딩)
      dialog.addEventListener(
        'close',
        () => {
          loadHTML('/src/components/window/window.html');
        },
        { once: true }
      );
    });
  }
}

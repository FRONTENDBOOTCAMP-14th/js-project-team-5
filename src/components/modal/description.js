/**
 * 게임 설명 모달을 열 때 내용을 채워 넣는다.
 * 1) <body data-game=""> 값으로 게임 타입 확인
 * 2) /data/game-info.json에서 설명 문자열 fetch
 * 3) **강조**·줄바꿈을 HTML 요소로 변환해 .modal-content에 삽입
 *
 * @param {HTMLDialogElement} dialog - description 모달
 */
export function handleDescriptionModal(dialog) {
  // 1. 게임 타입 확인 (acidrain, defense, whack, quiz)
  const gameType = document.body.dataset.game;
  if (!gameType) {
    console.warn('게임 타입이 지정되지 않았습니다.');
    return;
  }

  // 2. 설명 텍스트가 담긴 JSON 파일 경로 (정적 파일로 fetch 요청)
  // game-info.json의 파일 위치가 public/data/game-info.json이기 때문에 정적 파일이라 fetch로 불러옴
  const GAME_INFO_URL = `/data/game-info.json`;
  fetch(GAME_INFO_URL)
    .then((response) => {
      console.log('게임 설명 파일을 불러오는 중:', GAME_INFO_URL);
      return response.json();
    })
    .then((gameInfo) => {
      // 3. 불러온 JSON에서 현재 게임 타입에 해당하는 설명 텍스트 추출
      const descriptionText = gameInfo[gameType];
      if (!descriptionText) {
        console.warn(`게임 타입 "${gameType}"에 대한 설명이 없습니다.`);
        return;
      }

      // 4. 모달 내부 콘텐츠 삽입 대상 요소 찾기
      const contentEl = dialog.querySelector('.modal-content');
      if (!contentEl) {
        console.warn('모달 콘텐츠 요소를 찾을 수 없습니다.');
        return;
      }

      // 5. 기존 내용 비우기 (다이얼로그를 열때마다 내용이 쌓이지 않도록)
      contentEl.replaceChildren();

      // 6. 가져온 게임 설명 텍스트를 \n\n을 기준으로 단락 나누기
      const paragraphs = descriptionText.split('\n\n');

      // 7. 각 단락을 <p>로 감싸고, 내부 줄바꿈(\n)은 <br>로 처리
      paragraphs.forEach((paragraph, index) => {
        const p = document.createElement('p');
        p.style.fontSize = '1.5rem';
        p.style.lineHeight = '1.6'; // 또는 '24px', '2rem'도 가능

        // 단락 내 줄바꿈을 위해 \n을 <br>로 변환
        const lines = paragraph.split('\n');
        lines.forEach((line, index) => {
          const parsed = parseEmphasisText(line);
          p.appendChild(parsed);
          if (index < lines.length - 1) {
            p.appendChild(document.createElement('br'));
          }
        });
        // 완성된 <p> 태그를 콘텐츠 영역에 추가
        contentEl.appendChild(p);

        // 문단 사이(p태그 사이) 줄 간격 확보를 위해 <br> 추가 (마지막 문단은 제외)
        if (index < paragraphs.length - 1) {
          contentEl.appendChild(document.createElement('br'));
        }
      });
    })
    .catch((error) => {
      // 8. fetch 또는 JSON 파싱 중 에러 발생 시 로그 출력
      console.error('게임 설명 파일을 불러오는 중 오류 발생:', error);
      return;
    });
}

/**
 * 텍스트 내의 **강조 텍스트**를 <strong> 요소로 변환하여 DocumentFragment로 반환하는 함수
 *
 * @param {string} text - **로 감싸진 강조 구문이 포함된 텍스트
 * @returns {DocumentFragment} - 강조 구문이 <strong> 요소로 감싸져 포함된 DocumentFragment
 */
function parseEmphasisText(text) {
  const fragment = document.createDocumentFragment();
  const parts = text.split(/(\*\*.*?\*\*)/);

  parts.forEach((part) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const strong = document.createElement('strong');
      strong.textContent = part.slice(2, -2);
      fragment.appendChild(strong);
    } else {
      fragment.appendChild(document.createTextNode(part));
    }
  });

  return fragment;
}

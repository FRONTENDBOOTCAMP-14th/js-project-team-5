// 점수판 모달을 위한 더미 데이터
const dummyScoreData = [
  { nickname: '일이삼사오육칠팔구십일', score: 3500 },
  { nickname: '홍길동', score: 3400 },
  { nickname: '김코딩', score: 3300 },
  { nickname: 'JS마스터', score: 3200 },
  { nickname: '라이언', score: 3100 },
];

/**
 * 점수판 모달을 동적으로 생성하고 렌더링하는 함수
 * @param {HTMLDialogElement} dialogEl - 점수판 모달(dialog) 요소
 */
export function handleScoreboardModal(dialogEl) {
  // 모달 내부 콘텐츠 영역을 찾고 초기화
  const contentEl = dialogEl.querySelector('.modal-content');
  contentEl.innerHTML = ''; // 이전 내용 제거

  // 테이블 요소 생성 및 클래스 지정 (스타일은 modal.css에서 정의)
  const table = document.createElement('table');
  table.classList.add('scoreboard-table');

  // 점수 데이터 순회하며 각 행(tr) 구성
  dummyScoreData.forEach((user, index) => {
    const rank = getRankLabel(index + 1); // 순위 라벨 생성 (ex. 1st, 2nd)

    // 행(tr) 요소 생성
    const tr = document.createElement('tr');

    // 순위 셀
    const rankTd = document.createElement('td');
    rankTd.textContent = rank;

    // 닉네임 셀
    const nicknameTd = document.createElement('td');
    nicknameTd.textContent = user.nickname;

    // 점수 셀
    const scoreTd = document.createElement('td');
    scoreTd.textContent = `${user.score.toLocaleString()} 점`; // 3,500처럼 천 단위 구분

    // 행에 셀 추가 후 테이블에 추가
    tr.append(rankTd, nicknameTd, scoreTd);
    table.appendChild(tr);
  });

  // 완성된 테이블을 모달 콘텐츠 영역에 추가
  contentEl.appendChild(table);
}

/**
 * 순위에 맞는 서수 접미사(st, nd, rd, th)를 붙여 반환하는 함수
 * @param {number} n - 순위 숫자 (1, 2, 3, ...)
 * @returns {string} - "1st", "2nd", "3rd", "4th" 등 서수 형식 문자열
 */
function getRankLabel(n) {
  // 예외 처리: 11~13은 무조건 "th"
  if (n % 100 >= 11 && n % 100 <= 13) return `${n}th`;

  // 일반적인 서수 처리
  switch (n % 10) {
    case 1:
      return `${n}st`;
    case 2:
      return `${n}nd`;
    case 3:
      return `${n}rd`;
    default:
      return `${n}th`;
  }
}

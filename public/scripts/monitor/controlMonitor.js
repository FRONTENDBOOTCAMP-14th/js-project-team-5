// controlMonitor.js

function loadHTML(url) {
  fetch(url)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`불러오기 실패: ${res.status}`);
      }
      return res.text();
    })
    .then((html) => {
      const container = document.querySelector('.monitor-frame');
      if (container) {
        container.innerHTML = html;
      } else {
        console.warn('monitor-frame을 찾을 수 없습니다.');
      }
    })
    .catch((err) => {
      console.error(err);
    });
}

// 전역으로 노출
window.loadHTML = loadHTML;

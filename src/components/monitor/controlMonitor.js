// src/controlMonitor.js

let cleanupTasks = [];
let previousPage = null;

// 전역 API 훅킹: setInterval, requestAnimationFrame, addEventListener 자동 수집
function hookGlobalAPIs() {
  const originalSetInterval = window.setInterval;
  window.setInterval = function (...args) {
    const id = originalSetInterval(...args);
    cleanupTasks.push(() => clearInterval(id));
    return id;
  };

  const originalRAF = window.requestAnimationFrame;
  window.requestAnimationFrame = function (callback) {
    const id = originalRAF(callback);
    cleanupTasks.push(() => cancelAnimationFrame(id));
    return id;
  };

  const originalAddEventListener = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function (type, listener, options) {
    cleanupTasks.push(() => this.removeEventListener(type, listener, options));
    return originalAddEventListener.call(this, type, listener, options);
  };
}

// 이전 페이지의 타이머·이벤트 정리
function clearCleanupTasks() {
  cleanupTasks.forEach((fn) => {
    try {
      fn();
    } catch (e) {
      console.warn('정리 중 오류:', e);
    }
  });
  cleanupTasks = [];
}

// 모니터 그룹 스케일링
function scaleMonitorGroup() {
  const wrapper = document.querySelector('.monitor-frame-wrapper');
  const group = document.querySelector('.monitor-frame-group');
  if (!wrapper || !group) return;

  const designWidth = 1660;
  const designHeight = 920;
  const scaleX = wrapper.clientWidth / designWidth;
  const scaleY = wrapper.clientHeight / designHeight;
  const scale = Math.min(scaleX, scaleY);
  group.style.transform = `scale(${scale})`;
}

window.addEventListener('resize', scaleMonitorGroup);
window.addEventListener('DOMContentLoaded', scaleMonitorGroup);

/**
 * SPA 방식으로 HTML + CSS + JS 로드
 * @param {string} url - 불러올 HTML 경로
 * @param {Function} [onLoaded] - 페이지 로드 완료 콜백
 */
export function loadHTML(url, onLoaded) {
  const container = document.querySelector('.monitor-frame');
  if (!container) return;

  const currentPage = container.getAttribute('data-current-page');
  if (currentPage) previousPage = currentPage;

  clearCleanupTasks();
  container.innerHTML = '';
  container.setAttribute('data-current-page', url);

  fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error(`불러오기 실패: ${res.status}`);
      return res.text();
    })
    .then((html) => {
      container.innerHTML = html;

      // CSS 파일 동적 로드
      const cssLinks = Array.from(container.querySelectorAll('link[rel="stylesheet"]'));
      const loadCSS = Promise.all(
        cssLinks.map(
          (link) =>
            new Promise((res, rej) => {
              const el = document.createElement('link');
              el.rel = 'stylesheet';
              el.href = link.href;
              el.onload = res;
              el.onerror = rej;
              document.head.appendChild(el);
            })
        )
      );

      loadCSS
        .then(() => {
          // JS 파일 동적 로드 (controlMonitor.js 제외)
          const scriptTags = Array.from(container.querySelectorAll('script')).filter((s) => !s.src.includes('controlMonitor.js'));

          return Promise.all(
            scriptTags.map(
              (oldScript) =>
                new Promise((res, rej) => {
                  const newScript = document.createElement('script');
                  newScript.type = oldScript.type || 'text/javascript';
                  if (oldScript.src) {
                    const urlObj = new URL(oldScript.src, location.href);
                    urlObj.searchParams.set('_ts', Date.now());
                    newScript.src = urlObj.toString();
                  } else {
                    newScript.textContent = oldScript.textContent;
                  }
                  newScript.onload = res;
                  newScript.onerror = rej;
                  document.body.appendChild(newScript);
                })
            )
          );
        })
        .then(() => {
          hookGlobalAPIs();
          if (typeof onLoaded === 'function') onLoaded();
        })
        .catch(console.error);
    })
    .catch(console.error);
}

/** 뒤로 가기 */
export function goBack() {
  if (previousPage) {
    loadHTML(previousPage);
  } else {
    console.warn('뒤로 갈 페이지가 없습니다.');
  }
}

// 최초 IIFE 실행은 한 번만
if (!window.__cmInitialized) {
  window.__cmInitialized = true;
  (() => {
    if (!previousPage) {
      previousPage = '/src/components/booting/booting.html';
      loadHTML(previousPage);
    }
  })();
}

// 전역으로 노출
window.loadHTML = loadHTML;
window.goBack = goBack;

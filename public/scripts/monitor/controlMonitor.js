let cleanupTasks = [];

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

function loadHTML(url) {
  const container = document.querySelector('.monitor-frame');
  if (!container) return;

  // 이전 페이지 클린업
  clearCleanupTasks();
  container.innerHTML = '';

  fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error(`불러오기 실패: ${res.status}`);
      return res.text();
    })
    .then((html) => {
      container.innerHTML = html;

      const scripts = container.querySelectorAll('script');
      scripts.forEach((oldScript) => {
        const newScript = document.createElement('script');
        if (oldScript.src) {
          newScript.src = oldScript.src;
        } else {
          newScript.textContent = oldScript.textContent;
        }
        newScript.type = oldScript.type || 'text/javascript';
        document.body.appendChild(newScript);
      });

      // 다음 페이지 JS에서 실행되는 setInterval, addEventListener 등 감시 시작
      hookGlobalAPIs();
    })
    .catch(console.error);
}

window.loadHTML = loadHTML;
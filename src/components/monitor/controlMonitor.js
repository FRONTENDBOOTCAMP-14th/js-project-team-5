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

function scaleMonitorGroup() {
  const wrapper = document.querySelector('.monitor-frame-wrapper');
  const group = document.querySelector('.monitor-frame-group');

  if (!wrapper || !group) return;

  // 실측 기준: 프레임 외곽 사이즈 1660x860 + 넥 여유 포함 약 920px
  const designWidth = 1660;
  const designHeight = 920;

  const scaleX = wrapper.clientWidth / designWidth;
  const scaleY = wrapper.clientHeight / designHeight;
  const scale = Math.min(scaleX, scaleY);

  group.style.transform = `scale(${scale})`;
}

window.addEventListener('resize', scaleMonitorGroup);
window.addEventListener('DOMContentLoaded', scaleMonitorGroup);

function removeDynamicScripts() {
  console.log('안된다?');
  document.querySelectorAll('script[data-dynamic]').forEach((el) => el.remove());
}

export function loadHTML(url) {
  const container = document.querySelector('.monitor-frame');
  if (!container) return;

  clearCleanupTasks();
  container.innerHTML = '';

  fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error(`불러오기 실패: ${res.status}`);
      return res.text();
    })
    .then((html) => {
      container.innerHTML = html;

      const scripts = Array.from(container.querySelectorAll('script'));
      scripts.forEach((s) => s.remove());

      scripts.forEach((oldScript) => {
        const newScript = document.createElement('script');
        newScript.type = oldScript.type || 'text/javascript';

        if (oldScript.src) {
          const scriptURL = new URL(oldScript.src, location.href);
          scriptURL.searchParams.set('_ts', Date.now());
          newScript.src = scriptURL.toString();
        } else {
          newScript.textContent = oldScript.textContent;
        }

        document.body.appendChild(newScript);
      });

      hookGlobalAPIs();
    })
    .catch(console.error);
}

window.loadHTML = loadHTML;

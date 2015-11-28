const utils = {};

let running = false;

window.raf = (function () {
  if (window.requestAnimationFrame) return window.requestAnimationFrame;

  return function (cb) {
    window.setTimeout(cb, 100);
  };
})();

utils.throttle = function (cb) {
  return () => {
    if (running) return;
    running = true;

    window.raf(() => {
      cb.apply();
      running = false;
    });
  };
};

export default utils;

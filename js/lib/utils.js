import $ from 'jquery';
import Modernizr from 'modernizr';

const utils = {};

let running = false;

(function wait () {
  if (window.requestAnimationFrame) return window.requestAnimationFrame;

  return function (cb) {
    window.setTimeout(cb, 100);
  };
})();

utils.replaceSVG = function () {
  // If SVG is not supported replace it with png version
  if (!Modernizr.svg) {
    $('img[src*="svg"]').attr('src', () => {
      return $(this).attr('src').replace('.svg', '.png');
    });
  }
};

utils.throttle = function (cb) {
  return () => {
    if (running) return;
    running = true;

    wait(() => {
      cb.apply();
      running = false;
    });
  };
}

export default utils;

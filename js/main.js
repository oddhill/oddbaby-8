// Import libs
import $ from 'jquery';
import utils from 'lib/utils';

(function () {
  // Run when DOM is ready
  $(function () {
    // If SVG is not supported replace it with png version
    utils.replaceSVG();
  });

  // Run when DOM is changed
  Drupal.behaviors.ODDBABY = {
    attach() {

    }
  };
})();

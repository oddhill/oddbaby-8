import enquire from 'enquire.js';

const responsive = {};

responsive.init = function () {
  // See http://wicky.nillia.ms/enquire.js for docs.
  enquire.register('screen and (max-width:800px)', {
    match() {},
    unmatch() {}
  });
};

export default responsive;

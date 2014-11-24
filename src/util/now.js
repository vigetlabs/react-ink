var now = Date.now || function() {
  return +new Date();
};

if (typeof performance !== 'undefined' && performance.now) {
  now = performance.now.bind(performance);
}

module.exports = now;

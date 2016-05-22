define([], function () {


  function range() {
    var args = Array.prototype.slice.call(arguments, 0);
    var start, n, step;
    switch (args.length) {
      case 1:
        start = 0;
        n = args.shift();
        step = 1;
        break;
      case 2:
        start = args.shift();
        n = args.shift();
        step = 1;
        break;
      case 3:
        start = args.shift();
        n = args.shift();
        step = args.shift();
        break;
    }

    var rng = [];
    for (var i = 0; i < n; i++, start += step) {
      rng.push(start);
    }
    return rng;
  }

  return range;

});
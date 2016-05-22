define(["./size",
  "../lib/random"],function (size, random) {

  function sameArray(a1, a2) {
    // if the other array is a falsy value, return
    if (!a1 || !a2) {
      return false;
    }

    // compare lengths - can save a lot of time
    if (a1.length != a2.length) {
      return false;
    }

    for (var i = 0, l = a1.length; i < l; i++) {
      // Check if we have nested arrays
      if (a1[i] instanceof Array && a2[i] instanceof Array) {
        // recurse into the nested arrays
        if (!sameArray(a1[i], a2[i])) {
          return false;
        }
      } else if (a1[i] != a2[i]) {
        // Warning - two different object instances will never be equal: {x:20} != {x:20}
        return false;
      }
    }
    return true;
  }

  function makeRnd(dist) {
    // paramList can be found in src/lib/random.js
    var paramList = random.paramList[dist];
    return function () {
      var args = Array.prototype.slice.call(arguments, 0);
      var params = {};
      for (var i = 0; i < paramList.length; i++) {
        params[paramList[i]] = args.shift();
        if (sameArray(size(params[paramList[i]]), [
          [1, 1]
        ])) {
          params[paramList[i]] = params[paramList[i]][0][0];
        }
      }
      var user_dim = [];
      if (args.length === 1 && args[0] instanceof Array) {
        user_dim = args[0][0];
      } else {
        for (var j = 0; j < args.length; j++) {
          if (args instanceof Array) {
            user_dim.push(args[j][0][0]);
          } else {
            user_dim.push(args[j]);
          }
        }
      }
      return generateRandom(dist, params, user_dim);
    };
  }

  function generateRandom(dist, params, user_dim) {

    var dim = [1];
    var param_matrix = false;
    var param_checked = false;


    // Make sure the passed params are Numbers or arrays of the same size
    for (var param in params) {
      if (params[param] instanceof Array) {
        // if we've already determined that the parameters are NOT matrices
        if (param_checked && !param_matrix) {
          throw new Error("Dimension mismatch between parameters");
        }
        // if this is the first param and it is a matrix
        if (!param_matrix) {
          param_matrix = true;
          dim = size(params[param])[0];
          // if this is not the first param and it is a matrix
        } else {
          if (!sameArray(dim, size(params[param])[0])) {
            throw new Error("Dimension mismatch between parameters");
          }
        }
        param_checked = true;
      } else if (param_matrix) {
        throw new Error("Dimension mismatch between parameters");
      }
    }

    // If we have m, n, ... parameters, those will dictate the size of
    // the output array.
    if (user_dim.length > 0) {
      //check that the dimensions of the parameters match those of the m,n,... arguments
      if (param_matrix && !sameArray(dim, user_dim)) {
        throw new Error("Dimension mismatch");
      }
      dim = user_dim.slice(0);
    }

    // Recursive function to create an [n,m,...] array

    function makeDim(ary, dim) {
      var i;

      for (i = 0; i < dim[0]; i++) {
        if (dim.length === 1) {
          ary.push(random(dist, params));
        } else {
          ary.push([]);
          makeDim(ary[ary.length - 1], dim.slice(1));
        }
      }
    }

    var out = [];
    makeDim(out, dim);
    if (out[0] instanceof Array) {
      return out;
    } else {
      return [out];
    }
  }

  var normrnd = makeRnd('normal');
  normrnd.shortHelp = "Generates normally distributed random numbers.";
  normrnd.help = "#Random Number Generator -- Normal Distribution\n\
Generates normally distributed random numbers.\n\n\
## Syntax\n\
```\n\
R = normrnd(mu,sigma)\n\
R = normrnd(mu,sigma,m,n)\n\
R = normrnd(mu,sigma,[m,n])\n\
```\n\n\
## References\n\n\
1. Normal Distribution; Wikipedia; [http://en.wikipedia.org/wiki/Normal_distribution](http://en.wikipedia.org/wiki/Normal_distribution)\n\n";

  var binornd = makeRnd('binomial');
  binornd.shortHelp = "Generates random numbers from a binomial distribution.";
  binornd.help = "#Random Number Generator -- Binomial Distribution\n\
Generates random numbers from a binomial distribution.\n\n\
## Syntax\n\
```\n\
R = binornd(N,P)\n\
R = binornd(N,P,m,n)\n\
R = binornd(N,P,[m,n])\n\
```\n\n\
## References\n\n\
1. Binomial Distribution; Wikipedia; [http://en.wikipedia.org/wiki/Binomial_distribution](http://en.wikipedia.org/wiki/Binomial_distribution)\n\n";

  var poissrnd = makeRnd('poisson');
  poissrnd.shortHelp = "Generates random numbers from a poisson distribution.";
  poissrnd.help = "#Random Number Generator -- Poisson Distribution\n\
Generates random numbers from a poisson distribution.\n\n\
## Syntax\n\
```\n\
R = poissrnd(lambda)\n\
R = poissrnd(lambda,m,n)\n\
R = poissrnd(lambda,[m,n])\n\
```\n\n\
## References\n\n\
1. Poisson Distribution; Wikipedia; [http://en.wikipedia.org/wiki/Poisson_distribution](http://en.wikipedia.org/wiki/Poisson_distribution)\n\n";

  var gamrnd = makeRnd('gamma');
  gamrnd.shortHelp = "Generates random numbers from a gamma distribution.";
  gamrnd.help = "#Random Number Generator -- Gamma Distribution\n\
Generates random numbers from a gamma distribution.\n\n\
## Syntax\n\
```\n\
R = gamrnd(A,B)\n\
R = gamrnd(A,B,m,n)\n\
R = gamrnd(A,B,[m,n])\n\
```\n\n\
## References\n\n\
1. Gamma Distribution; Wikipedia; [http://en.wikipedia.org/wiki/Gamma_distribution](http://en.wikipedia.org/wiki/Gamma_distribution)\n\n";

  var betarnd = makeRnd('beta');
  betarnd.shortHelp = "Generates random numbers from a beta distribution.";
  betarnd.help = "#Random Number Generator -- Beta Distribution\n\
Generates random numbers from a beta distribution.\n\n\
## Syntax\n\
```\n\
R = betarnd(A,B)\n\
R = betarnd(A,B,m,n)\n\
R = betarnd(A,B,[m,n])\n\
```\n\n\
## References\n\n\
1. Beta Distribution; Wikipedia; [http://en.wikipedia.org/wiki/Beta_distribution](http://en.wikipedia.org/wiki/Beta_distribution)\n\n";


  function rand(n, m) {


    var sz1, sz2;
    sz1 = n[0][0];

    if (m && m.length == 1 && m[0].length == 1) {
      sz2 = m[0][0];
    } else {
      if (n[0].length > 1) {
        sz2 = n[0][1];
      } else {
        sz2 = sz1;
      }
    }
    var out = [];
    for (var i = 0; i < sz1; i++) {
      out.push([]);
      for (var j = 0; j < sz2; j++) {
        out[i].push(numeric.seedrandom.random());
      }
    }
    // out = numeric.random([sz1, sz2]);

    return out;
  }

  rand.shortHelp = "Generates uniformly distributed random numbers.";
  rand.help = "#Random Number Generator -- Uniform Distribution\n\
Generates uniformly distributed random numbers.\n\n\
## Syntax\n\
```\n\
R = rand(n)\n\
R = rand(m,n)\n\
R = rand([m,n])\n\
```\n\n\
## References\n\n\
1. Uniform Distribution (Continuous); Wikipedia; [http://en.wikipedia.org/wiki/Uniform_distribution_(continuous)](http://en.wikipedia.org/wiki/Uniform_distribution_(continuous))\n\n";


  return {
    rand: rand,
    normrnd: normrnd,
    binord: binornd,
    poissrnd: poissrnd,
    gamrnd: gamrnd,
    betarnd: betarnd
  };

});
define(["./distributions"], function (distributions) {

  var sample = {
    beta: function (o) {
      return distributions.beta.sample(o.alpha, o.beta);
    },
    centralF: function (o) {
      return distributions.centralF.sample(o.df1, o.df2);
    },
    cauchy: function (o) {
      return distributions.cauchy.sample(o.local, o.scale);
    },
    chisquare: function (o) {
      return distributions.chisquare.sample(o.dof);
    },
    exponential: function (o) {
      return distributions.exponential.sample(o.rate);
    },
    gamma: function (o) {
      return distributions.gamma.sample(o.shape, o.scale);
    },
    invgamma: function (o) {
      return distributions.invgamma.sample(o.shape, o.scale);
    },
    lognormal: function (o) {
      return distributions.lognormal.sample(o.mu, o.sigma);
    },
    normal: function (o) {
      return distributions.normal.sample(o.mean, o.std);
    },
    studentt: function (o) {
      return distributions.studentt.sample(o.dof);
    },
    weibull: function (o) {
      return distributions.weibull.sample(o.scale, o.shape);
    },
    uniform: function (o) {
      return distributions.uniform.sample(o.a, o.b);
    },
    binomial: function (o) {
      return (function (n, p) {
        var x = 0;
        for (var i = 0; i < n; i++) {
          if (Math.random() < p) {
            x++;
          }
        }
        return x;
      })(o.n, o.p);
    },
    poisson: function (o) {
      return distributions.poisson.sample(o.l);
    },
    triangular: function (o) {
      return distributions.triangular.sample(o.a, o.b, o.c);
    }
  };

  function random(dist, params) {
    // var distributions = Object.keys(sample);

    if (!dist || 'string' !== typeof dist) {
      dist = 'uniform';
    }

    if (!(dist in sample)) {
      throw new Error("Unrecognized distribution: " + dist);
    }

    // TODO: Error handling and help stuff
    return sample[dist](params);
  }

  random.paramList = {
    beta: ['alpha', 'beta'],
    centralF: ['df1', 'df2'],
    cauchy: ['local', 'scale'],
    chisquare: ['dof'],
    exponential: ['rate'],
    gamma: ['shape', 'scale'],
    invgamma: ['shape', 'scale'],
    lognormal: ['mu', 'sigma'],
    normal: ['mean', 'std'],
    studentt: ['dof'],
    weibull: ['scale', 'shape'],
    uniform: ['a', 'b'],
    binomial: ['n', 'p'],
    poisson: ['l'],
    triangular: ['a', 'b', 'c']
  };

  return random;

});



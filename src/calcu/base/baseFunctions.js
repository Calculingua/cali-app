define([
    "./predict",
    "./display",
    "./ztest2",
  "./ztest",
  "./ttest2",
  "./ttest",
  "./readtable",
  "./polyfit",
  "./polyval",
  './zeros',
  './ylim',
  './ylabel',
  './xlim',
  './xlabel',
  './vectfunc',
  './var',
  './times',
  './tan',
  './sum',
  './std',
  './sqrtm',
  './sin',
  './rng',
  './rand',
  './prod',
  './pi',
  './mode',
  './mldivide',
  './min',
  './median',
  './max',
  './log',
  './legend',
  './isEqual',
  "./bar",
  "./plot",
  "./scatter",
  "./ones",
  "./axis",
  "./acos",
  "./asin",
  "./atan",
  "./chi2",
  "./clear",
  "./corrcoef",
  "./cos",
  "./cov",
  "./cross",
  "./crosstab",
  "./csvread",
  "./csvwrite",
  "./cumprod",
  "./cumsum",
  "./diff",
  "./dot",
  "./e-wise-expon",
  "./expm",
  "./eye",
  "./fitlm",
    "./grp2idx",
  "./help",
  "./hist",
  "./inv",
  "./mpower",
  "./plus",
  "./unique",
  "./mean",
  "./minus",
  "./mtimes",
  "./reshape",
  "./repmat",
  "./size",
  "./transpose",
  "./binomial",
  "./normal",
    "./round",
    "./ceil",
    "./floor",
    "./anova"
], function (predict,display,ztest2, ztest, ttest2, ttest, readtable, polyfit, polyval, zeros, ylim, ylabel, xlim, xlabel, vectfunc, varFunc, times, tan, sum, std, sqrtm, sin, rng, rand, prod, pi, mode, mldivide, min, median, max, log, legend, isEqual, bar, plot, scatter, ones, axis, acos, asin, atan, chi2, clear, corrcoef, cos, cov, cross, crosstab, csvread, csvwrite, cumprod, cumsum, diff, dot, eWiseExpon, expm, eye, fitlm, grp2idx, help, hist, inv, mpower, plus, unique, mean, minus, mtimes, reshape, repmat, size, transpose, binomial, normal, round, ceil, floor, anova) {

    return  {
        acos: acos,
        asin: asin,
        atan: atan,
        axis: axis,
        ones: ones,
        bar: bar,
        plot: plot,
        scatter: scatter,
        chi2cdf: chi2.chi2cdf,
        chi2pdf: chi2.chi2pdf,
        chi2inv: chi2.chi2inv,
        chi2stat: chi2.chi2stat,
        chi2gof: chi2.chi2gof,
        chi2rnd: chi2.chi2rnd,
        chi2ind: chi2.chi2ind,
        clear: clear,
        corrcoef: corrcoef,
        cos: cos,
        cov: cov,
        cross: cross,
        crosstab: crosstab,
        csvread: csvread,
        csvwrite: csvwrite,
        cumprod: cumprod,
        cumsum: cumsum,
        diff: diff,
        display: display,
        dot: dot,
        power: eWiseExpon.power,
        exp: eWiseExpon.exp,
        sqrt: eWiseExpon.sqrt,
        expm: expm,
        eye: eye,
        fitlm: fitlm,
        grp2idx: grp2idx,
        help: help,
        hist: hist.hist,
        plothist: hist.plothist,
        inv: inv,
        mpower: mpower,
        plus: plus,
        unique: unique,
        mean: mean,
        minus: minus,
        mtimes: mtimes,
        predict: predict,
        reshape: reshape,
        repmat: repmat,
        size: size,
        transpose: transpose,
        binocdf: binomial.binocdf,
        binopdf: binomial.binopdf,
        binoinv: binomial.binoinv,
        normcdf: normal.normcdf,
        normpdf: normal.normpdf,
        norminv: normal.norminv,
        legend: legend,
        log: log.log,
        log10: log.log10,
        log2: log.log2,
        max: max,
        median: median,
        min: min,
        mldivide: mldivide,
        mode: mode,
        pi: pi,
        prod: prod,
        polyfit: polyfit,
        polyval: polyval,
        rand: rand.rand,
        normrnd: rand.normrnd,
        binornd: rand.binord,
        poissrnd: rand.poissrnd,
        gamrnd: rand.gamrnd,
        betarnd: rand.betarnd,
        rng: rng,
        sin: sin,
        sqrtm: sqrtm,
        std: std,
        sum: sum,
        tan: tan,
        times: times,
        ttest: ttest,
        ttest2: ttest2,
        var: varFunc,
        vectfunc: vectfunc,
        xlabel: xlabel,
        xlim: xlim,
        ylabel: ylabel,
        ylim: ylim,
        zeros: zeros,
        isEqual: isEqual,
        readtable: readtable,
        ztest: ztest,
        ztest2: ztest2,
          round: round,
          ceil: ceil,
          floor: floor,
        anova1: anova.anova1
      };


});
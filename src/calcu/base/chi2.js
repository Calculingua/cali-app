define([
    "jStat", 
    "numeric", 
    "../mType/HashTable",
    "../lib/Matrix",
    "../lib/chi2"
    ], function (jStat, numeric, HashTable, Matrix, chi2lib) {

    var chi2 = {
        cdf: jStat.chisquare.cdf,
        pdf: jStat.chisquare.pdf,
        inv: jStat.chisquare.inv,
        mean: jStat.chisquare.mean,
        median: jStat.chisquare.median,
        mode: jStat.chisquare.mode,
        sample: jStat.chisquare.sample,
        variance: jStat.chisquare.variance,

    };


    function chi2cdf(x, df) {
        var out = chi2.cdf( x, df );
        if ('undefined' === typeof out.length) {
            out = [[out]];
        }
        return out;
    }
    function chi2pdf(x, df) {
        var out = chi2.pdf( x, df );
        if ('undefined' === typeof out.length) {
            out = [[out]];
        }
        return out;
    }
    function chi2inv(P, df) {
        var out = chi2.inv(P, df);
        if ('undefined' === typeof out.length) {
            out = [[out]];
        }
        return out;
    }
    function chi2stat(df, callback) {
        var m, v;
        try {
            m = chi2.mean(df);
            v = chi2.variance(df);
            callback(null, [[m]], [[v]]);
        } catch(e) {
            callback(e);
        }
    }
    chi2stat.async = true;

    function chi2gof() {
        var opts = {
            nbins: null,
            ctrs: null,
            edges: null,
            cdf: null,
            expected: null,
            nparams: null,
            emin: null,
            frequency: null,
            alpha: 0.05,
        };

        var alpha = 0.05;
        var bins = [];


        var i = 0;
        var params = {};
        var args = Array.prototype.slice.call(arguments, 0);
        var callback = args.pop();
        var X = args.shift();


        try {
            // if ('undefined' === typeof X.length || X.length < 2) return null;
            var arg;
            if (args.length % 2 === 0) {
                while (i<args.length) {
                    arg = (args[i].toLowerCase) ? args[i].toLowerCase() : args[i];
                    params[arg] = args[i+1];
                    i+=2;
                }
            } else {
                throw new Error("Operator Error :: CHI2GOF : Each argument key must have a corresponding value.");
            }

            if ('alpha' in params) {
                alpha = params.alpha;
            }

            // Bin the values in X according to nbins, ctrs, or edges
            // TODO: use histogram here.  For now, bins = X
            bins = X;


            var N = bins[0].length;
            var df = N - 1;
            var E;

            // Determine the expected frequencies according to 'cdf' or 'expected'
            // if neither has been specified, assume equal likelihood
            // TODO: implement cdf if specified
            if ('expected' in params) {
                if (params.expected.length !== N) {
                    throw new Error("Operator Error :: CHI2GOF : `Expected` array must be the same size as the input array or same number of bins.");
                }
                E = params.expected;
            } else if ('cdf' in params) {
                // TODO: implement this
                E = numeric.rep([N], numeric.sum(bins)/N);
            }else {
                E = numeric.rep([N], numeric.sum(bins)/N);
            }

            // TODO: implement EMin
            // TODO: implement frequency

            // Calculate the chi-squared statistic
            var x2=0;
            for (i=0;i<N; i++) {
                x2 += Math.pow((bins[0][i]-E[i]), 2) / E[i];
            }

            var p = 1 - chi2cdf(x2, df);
            var h = (p<alpha) ? 1 : 0;
            var stats = {
                chi2stat: [[x2]],
                df: [[df]],
                edges: [[]],
                O: bins,
                E: E
            };
            var res = new HashTable(stats);


            callback(null, [[h]], [[p]], res);
        } catch(e) {
            callback(e);
        }

    }
    chi2gof.async = true;

    function chi2rnd(n, df) {
        var out = [];
        for (var i=0; i<n; i++) {
            out.push(chi2.inv(Math.random(), df));
        }
        return [out];
    }

    // [chi2Stat, pValue] = chi2ind(frequecyTable)
    function chi2ind(freqTable, callback) {
        var table, df, x2, pValue;
        try {
            table = new Matrix(freqTable);
            df = (table.shape[0]-1) * (table.shape[1]-1);
            x2 = chi2lib.chi2Ind(freqTable);
            pValue = chi2lib.chi2p(x2, df);

            callback(null, [[x2]], [[pValue]]);
        } catch(e) {
            callback(e);
        }
    }
    chi2ind.async = true;



    chi2cdf.shortHelp = "Computes the chi-square cdf at each of the values in x.";

    chi2pdf.shortHelp = "Computes the chi-square pdf at each of the values in X.";

    chi2inv.shortHelp = "Computes the inverse of the chi-square cdf.";

    chi2stat.shortHelp = "Returns the mean of and variance for the chi-square distribution.";

    chi2gof.shortHelp = "Returns a chi-square goodness-of-fit test decision.";

    chi2rnd.shortHelp = "Generates and array of N random numbers from the chi-square distribution.";

    chi2ind.shortHelp = "Chi-square statistic and pvalue for a frequency table.";

	
    chi2cdf.help = "# chi2cdf(X, df) \n \
Computes the chi-square cdf at each of the values in X using the corresponding degrees of freedom in df.\n\n";

    chi2pdf.help = "# chi2pdf(X, df) \n \
Computes the chi-square pdf at each of the values in X using the corresponding degrees of freedom in df.\n\n";

    chi2inv.help = "# chi2inv(P, df) \n \
Computes the inverse of the chi-square cdf with degrees of freedom specified by df for the corresponding probabilities in P.\n\n";

    chi2stat.help = "# chi2stat(df) \n \
Returns the mean of and variance for the chi-square distribution with degrees of freedom parameters specified by df.\n\n";

    chi2gof.help = "# Chi-square goodness-of-fit test \n \
Returns a chi-square goodness-of-fit test decision.\n\n\
## Syntax\n\
```\n\
h = chi2gof(x);\n\
h = chi2gof(x,Name,Value);\n\
[h,p] = chi2gof(___);\n\
[h,p,stats] = chi2gof(___);\n\
```\n\n\
## Description \n\
The chi-square goodness-of-fit tests the null hypothesis that the data (x) comes from a normal distribution.\
`h` is the test result, which takes on one of two values:\n\
0 - The null hypothesis is NOT rejected\n\
1 - the null hypothesis is rejected at the 5% (default) significance level\n\
### Inputs\n\
- `x` -- test data as a vector. \n\
- `Name/Value` -- Keyword/value pair to adjust the behavior of the test. \n\n\
- - `alpha` -- Test significance level. Defaults to 0.05  \n\n\
### Outputs\n\
This is a multi-output function, with the following outputs:\n\n\
- `h` -- the pass/fail of the null hypothesis.\n\
- `p` -- the p-value of the test data.\n\
- `ci` -- the confidence interval.\n\
- `stats` -- an object that include statistics of the test data.  The object has the following fields: \
`chi2stat` is the chi-square-statistic, `df` is the number of degrees of freedom, `edges` is a vector of the\
bin edges after pooling, `O` is a vector of observed counts for each bin, and `E` is a vector of expected\
counts for each bin. \n\n\
## Examples\n\
1. Testing pass/fail of the null hypothesis (the sample comes from a normal distribution).\n\
```\n\
x = [212, 147, 103, 50, 46, 42];\n\
[h, p, stats] = chi2gof(x)\n\
% h = 1 Therefore reject the null hypothesis\n\
% p = 0 (actually, a very small number truncated to 0)\n\
% stats.chi2stat = 235.42\n\
```\n\n\
## References\n\n\
1. Pearson's chi-squared test; Wikipedia;  [http://en.wikipedia.org/wiki/Pearson%27s_chi-squared_test](http://en.wikipedia.org/wiki/Pearson%27s_chi-squared_test)\n";


    chi2rnd.help = "# chi2rnd(N, df) \n \
generates and array of N random numbers from the chi-square distribution with degrees of freedom parameters specified by df.\n\n";

/////////////////////////////
// CHI-SQUARE INDEPENDENCE //
/////////////////////////////
    chi2ind.help = "# Chi-square test of independence \n \
Returns the chi-sqare statistic and the pValue for an n&times;m frequency table.\n\n\
## Syntax\n\
```\n\
chi2stat = chi2ind(X);\n\
[chi2stat, p] = chi2ind(X);\n\
```\n\n\
## Description \n\
Returns the chi-sqare statistic and the pValue for an n&times;m frequency table.  \
The frequency table is an n&times;m Matrix where the elements represent a frequency count\
of (<row-label>, <col-label>) pairs.\n\n\
### Inputs\n\
- `X` -- Frequency table: an n&times;m Matrix. \n\n\
### Outputs\n\
This is a multi-output function, with the following outputs:\n\n\
- `chi2stat` -- the chi-squared statistic.\n\
- `p` -- the p-value of of chi2stat.\n\n\
## Examples\n\
1. Get the chi-2 statistic and p-value for a frequency table.\n\
```\n\
X = [1, 6, 7; 5, 5, 2; 11, 7, 6];\n\
[chi2, p] = chi2ind(X);\n\
% X = [[1, 6, 7]\n\
%      [5, 5, 2]\n\
%      [11, 7, 6]]\n\
% chi2 = 7.5449\n\
% p = 0.10974\n\
% stats.chi2stat = 235.42\n\
```\n\n\
## See also\n\n\
- crosstab()\n\n\
## References\n\n\
1. Pearson's chi-squared test; Wikipedia;  [http://en.wikipedia.org/wiki/Pearson%27s_chi-squared_test](http://en.wikipedia.org/wiki/Pearson%27s_chi-squared_test)\n";



    var out = {
	    chi2cdf: chi2cdf,
	    chi2pdf: chi2pdf,
	    chi2inv: chi2inv,
	    chi2stat: chi2stat,
	    chi2gof:  chi2gof,
	    chi2rnd: chi2rnd,
        chi2ind: chi2ind,
    };
	return out;
});
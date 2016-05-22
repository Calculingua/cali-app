define([
    "../lib/chi2", 
    "../lib/grouping",
    "../lib/Matrix"
], function (chi2, grouping, Matrix) {
    
    function crosstab() {
        var mat, err;
        var args = Array.prototype.slice.call(arguments, 0);
        var callback = args.pop();
        
        // args comes in as an array of arrays-of-arrays (or an array of 2d arrays)
        // This is the case even if the underlying data is a vector (eg [[1,2,3,4]] )
        // convert to a normal array for lib.crosstab
        function formatVector(vec) {
            mat = new Matrix(vec);
            if (mat.isRowVector()) {
                return mat.toArray()[0];
            } else if (mat.isColumnVector()) {
                return mat.transpose().toArray()[0];
            } else {
                throw new Error("Crosstab: arguments must be row- or column-vectors.");
            }
        }

        try {
            args = args.map(formatVector);
        } catch(e) {
            return callback(e);
        }


        var table, x2, df, p, labels;
        try {
            table = grouping.crosstab.apply(null, args);
            x2 = chi2.chi2Ind(table);
            df = (table.shape[0]-1) * (table.shape[1]-1);
            p = chi2.chi2p(x2, df);
            labels = [/*still TODO*/];
        } catch (e) {
            return callback(e);
        }

        callback(null, table.toArray(), [[x2]], [[p]], labels);

        
    }
    crosstab.async = true;

	crosstab.shortHelp = "Computes a cross-tabulation of the variables.";
    crosstab.help = "# crosstab \n \
Computes a cross-tabulation of the variables.\n\n\
## Syntax\n\
```\n\
[table,chi2,p] = crosstab(x, y);\n\
[table,chi2,p] = crosstab(x1,...,xn);\n\
```\n\n\
## Description \n\
Returns a crosstabulation table of the vectors `x` and `y`.  Passing more than two vectors \
will result in a multi-dimensional array where the number of dimensions equals the number \
of vecotrs passed.\n\n\
All input vectors must be of the same length.\n\n\
The index labels for each dimension are sorted list of the distinct values for the \
corresponding vector.  For example, if the first vector argument was `[1,1,5,3,7,5]`, then\
the index labels for the first dimension of the returned crosstabulation table would be \
`[1, 3, 5, 7]`.\n\n\
### Inputs\n\
- `x` -- Input vector \n\
- `y` -- Input vector \n\
- `x1,...,xn` -- multiple input vector (which will result in an n-dimensional table) \n\n\
### Outputs\n\
- `table` -- Matrix or n-dimensional array of numbers where each element represents the number \
of observances for that index.\n\
- `chi2` -- The chi-squared statistic\n\
- `p` -- p-value for the chi-squared statistic\n\n\
## Examples\n\n\
1. Obtaining a crosstabulation table.\n\
```\n\
x = [1, 1, 2, 3, 1];\n\
y = [1, 2, 5, 3, 1];\n\
t = crosstab(x, y)\n\
% t = [[2, 1, 0, 0]\n\
%      [0, 0, 0, 1]\n\
%      [0, 0, 1, 0]]\n\
```\n\
2. Obtaining chi-squared and p-value from research data.\n\
```\n\
A = [1, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 1, 2, 1, 2, 1, 2]\n\
B = [0, 2, 1, 1, 2, 1, 1, 1, 0, 1, 1, 1, 1, 2, 1, 1, 2, 1, 0, 1, 1, 0, 1, 2, 0, 1, 0, 1, 0, 1]\n\
[table, chi2, p] = crosstab(A, B)\n\
% table = [[5, 2,  3]\n\
%          [2, 16, 2]]\n\
% chi2 = 10.171\n\
% p = 0.0061845 \n\
```\n\n\
## References\n\n\
1. Contingency Tables; Wikipedia; [http://en.wikipedia.org/wiki/Contingency_table](http://en.wikipedia.org/wiki/Contingency_table)\n\
2. Pearson's chi-squared test; Wikipedia;  [http://en.wikipedia.org/wiki/Pearson%27s_chi-squared_test](http://en.wikipedia.org/wiki/Pearson%27s_chi-squared_test)\n";

    return crosstab;
});



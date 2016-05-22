define([
    '../lib/Matrix',
    '../lib/grouping',
    '../lib/anova',
],
function(Matrix, grouping, anova) {

    function anova1() {
        var args = Array.prototype.slice.call(arguments, 0);
        var callback = args.pop();

        var X, display = false;

        function grabMatrix(ary) {
            var mat = new Matrix(ary);
            if (mat.shape.length !== 2) {
                throw new Error("anova1: One-way ANOVA requires a 2d matrix");
            }
            return mat;
        }

        try {
            switch (args.length) {
                case 1:
                    X = grabMatrix(args[0]);
                    break;

                case 2:
                    if (args[1] instanceof Array) {
                        X = grouping.grp2matrix(args[0], args[1]);
                    } else if ("string" === typeof args[1]) {
                        X = grabMatrix(args[0]);
                        display = args[1].toLowerCase() === "on";
                    } else {
                        throw new Error("Argument error - second argument is neither a grouping variable nor a string");
                    }
                    break;

                case 3:
                    X = grouping.grp2matrix(args[0], args[1]);
                    display = (args[2].toLowerCase() === "on");
                    break;

                default:
                    throw new Error("Argument error");
            }
        } catch(err) {
            return callback(new Error("anova1: " + err.message));
        }

        var anovaObj = anova.anova1(X);
        return callback(null, [[anovaObj.p]]);

    }
    anova1.async = true;
    anova1.shortHelp = "One-way, balanced ANOVA test";
    anova1.help = '# ANOVA (One-way, Balanced)\n\
Performs a one-way ANOVA test on a balanced matrix,\n\n\
## Syntax\n\
```\n\
p = anova1(X)\n\
p = anova1(X, groups)\n\
```\n\n\
## Description\n\
Performs a one-way, balanced ANOVA test.\n\
This method tests the null hypothesis that the samples in each group are drawn from the same \
population.  If the p-value of the test is less than a threshold value (typically 0.05), then \
the researcher may reject the null hypothesis.\n\n\
"One-way" means that the groups are distinguished by a single factor.\n\
"Balanced" refers to the fact that all groups being tested have the same number of samples.\n\n\
If `X` is a matrix, anova1 treats each column as a group to be tested.\n\
If `X` is a vector, `groups` must be a vector of the same size.  `groups` is a grouping variable which \
labels the corresponding value in `X` as belonging to a unique group.  `groups` can be an array of numbers \
or strings.  \n\n\
For example, the pair of vectors `X = [1,2,3,4,5,6,7,8,9]` and `groups = [1,1,1, 2,2,2, 3,3,3]` would \
identify values 1, 2, and 3 as belonging to one group; 4, 5, and 6 to another group; and 7, 8, and 9 to \
a final group.  The syntax would be:\n\
```\n\
p = anova1([1,2,3,4,5,6,7,8,9], [1,1,1, 2,2,2, 3,3,3]);\n\
```\n\n\
To perform the same ANOVA by passing a matrix to the anova1 function, use the following syntax:\n\
```\n\
p = anova1([1,4,7;2,5,8;3,6,9]);\n\
```\n\n\
## Outputs\n\n\
- `p` -- the p-value of the test data.\n\n\
## Examples\n\
1. Testing pass/fail of the null hypothesis\n\
```\n\
X = [ 24, 14, 11,  7, 19;\n\
      15,  7,  9,  7, 24;\n\
      21, 12,  7,  4, 19;\n\
      27, 17, 13,  7, 15;\n\
      33, 14, 12, 12, 10;\n\
      23, 16, 18, 18, 20 ];\n\
p = anova1(X);\n\
% p = 1.1971e-04\n\
```\n\
\n\
## References\n\
1. Analysis of variance; Wikipedia; [http://en.wikipedia.org/wiki/Analysis_of_variance](http://en.wikipedia.org/wiki/Analysis_of_variance)\n';


    return {
        anova1: anova1,
    };
});
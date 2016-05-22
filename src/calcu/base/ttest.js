define(['../mType/HashTable',
  './transpose',
  './minus',
  './size',
"jStat"], function(HashTable, transpose, minus, size, jStat){
	
	function ttest() {
		
		var args = Array.prototype.slice.call(arguments, 0);
		var callback = args.pop();
		var alpha = 0.05;
		var df, i = 0;
		
		while(i < args.length){
			var key;
			if(typeof args[i][0][0] == "string"){
				key = args.splice(i, 1)[0][0].join("");
				if(key == "Alpha"){
					alpha = args.splice(i, 1)[0][0][0];
				}
				i--;
			}
			i++;
		}
		
		var A = args[0];
		var B = null;
		var m = null;
		
		if(args.length > 1){
			var szA = size(A);
			var szB = size(args[1]);
			if(szA[0][0] == szB[0][0] && szA[0][1] == szB[0][1]){
				B = args[1];
			}else{
				m = args[1];
			}
		}
		
		var X = A;
		if(B !== null){
			X = minus(A, B);
		}
		
		var Xt = transpose(X);
		if(size(Xt)[0][1] == 1){
			Xt = X;
		}
		
		if(m == null){
			m = [[]];
			for(i = 0; i < Xt.length; i++){
				m[0].push(0);
			}
		}
		
		var h = [[]], p = [[]], ci = [[], []], results = {tstats : [[]], df : [[]], sd : [[]]};
		for(i = 0; i < Xt.length; i++){
			// if(m == null)
			var pp = jStat.ttest(m[0][i], Xt[i], 2);
			p[0].push(pp);
			var ciI = jStat.tci(jStat.mean(Xt[i]), alpha, Xt[i]);
			ci[0].push(ciI[0]);
			ci[1].push(ciI[1]);
			results.tstats[0].push(-1 * jStat.tscore( m[0][i], Xt[i] ) );
			results.df[0].push(Xt[i].length - 1);
			results.sd[0].push(jStat.stdev(Xt[i], true));
			h[0].push(pp > alpha ? 0 : 1);
		}
		
		var res = new HashTable(results);
		
		callback(null, h, p, ci, res);
	}

	ttest.async = true;

	ttest.shortHelp = "Computes the one-sample and paired-sample t-test of the test data.";
	ttest.help = "# t-test \n \
Computes the one-sample and the paired-sample t-test of the test data.\n\n\
## Syntax\n\
```\n\
[h, p, ci, stats] = ttest(A, m);\n\
[h, p, ci, stats] = ttest(A, B);\n\
```\n\n\
## Description \n\
Computes the one-sample t-test of the test data `A` against the optional mean value `m`. \
If `m` is not defined, the value defaults to `0`. \n\n\
To compute the paired-sample t-test, input two equal size matrices `A` and `B`.\n\n\
### Inputs\n\
- `A` -- test data. \n\
- `m` -- hypothesized population mean. \n\
- `B` -- test data (used for the paired-sample test). \n\n\
### Outputs\n\
This is a multi-output function, with the following outputs:\n\n\
- `h` -- the pass/fail of the null hypothesis.\n\
- `p` -- the p-value of the test data.\n\
- `ci` -- the confidence interval.\n\
- `stats` -- an object that include statistics of the test data.  The object has the following fields: \
`tstats` is the t-statistic, `df` is the number of degrees of freedom, and `sd` is the standard deviation.\n\n\
## Examples\n\
1. Testing pass/fail of the null hypothesis and a hypothesized mean of 0.\n\
```\n\
x = [1.1; 2.5; 1.8; 1.9; 2.0; 1.9; 2.111];\n\
h = ttest(x)\n\
% h = 1 \n\
```\n\
2. Testing pass/fail with a specified mean.\n\
```\n\
h = ttest(x, 2.0); \n\
% h = 0 \n\
```\n\
3. Testing a paired-sample t-test.\n\
```\n\
y = [1.0; 2.9; 1.9; 1.0; 2.5; 1.5; 2.211];\n\
h = ttest(x, y)\n\
% h = 0 \n\
```\n\
4. Getting the p-value, confidence interval, and statistics.\n\
```\n\
[h, p, ci, stats] = ttest(x, 1.1)\n\
% h = 1, p = 0.002, ci = [1.512; 2.291], stats.tstats = 5.035, stats.df = 6, stats.sd = 0.421\n\
```\n\n\
## References\n\n\
1. Student's t-test; Wikipedia; [http://en.wikipedia.org/wiki/Student's_t-test](http://en.wikipedia.org/wiki/Student's_t-test)\n";


	return ttest;
});
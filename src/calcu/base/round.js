define([], function(){
	
	function round(A, N) {
		
		var out = [];
        var exp = 0; 
        if(typeof N !== "undefined" && typeof N[0] !== "undefined" && typeof N[0][0] !== "undefined"){
            exp = Math.floor(N[0][0]); 
        }
        var mlt = Math.pow(10, exp);
        
        for(var i = 0; i < A.length; i++){
            out.push([]);
            for(var j = 0; j < A[i].length; j++){
                out[i].push(Math.round(A[i][j] * mlt) / mlt);
            }
        }
		
		return out;
	}

	round.shortHelp = "Rounds the input to the nearest value.";
    round.help = "# Round \n \
Rounds the values in matrix A. \n\n\
## Syntax\n\
```\n\
a = round(A);\n\
a = round(A, N);\n\
```\n\n\
## Description \n\
Rounds the value in `A` to the nearest decimal place specified in the optional scalar input `N`. \
If `N` is not defined, the value defaults to `0`. \n\n\
### Inputs\n\
- `A` -- Matrix of values to round. \n\
- `N` -- Scalar value that indicates the decimal place for which to round.  The decimal place is determined by dividing by base\
10 of the value (i.e. `1/10^N`).  Therefore, negative values result in 10's, 100's 1000's place rounding. \n\n\
### Outputs\n\
This is a single output function, with the following:\n\n\
- `a` -- the rounded value of `A`.\n\n\
## Examples\n\
1. Rounding to the nearest whole number.  \n\
```\n\
A = [1.11, 2.52, 1.85; 1.99, 2.01, 1.92];\n\
a = round(A)\n\
% a = [1, 3, 2; 2, 2, 2] \n\
```\n\
2. Rounding to the nearest 1/10 th.\n\
```\n\
a = round(A, 1); \n\
% a = [1.1, 2.5, 1.9; 2.0, 2.0, 1.9] \n\
```\n\
3. Rounding to the nearest 10\n\
```\n\
B = [15; 29; 19; 11; 24.9; 1.5];\n\
b = round(B, -1)\n\
% b = [20; 30; 20; 10; 20; 0] \n\
```\n\n\
## References\n\n\
1. Rounding; Wikipedia; [http://en.wikipedia.org/wiki/Rounding](http://en.wikipedia.org/wiki/Rounding)\n";

	return round;
});
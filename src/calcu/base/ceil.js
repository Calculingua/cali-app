define([], function(){
	
	function ceil(A) {
		
		var out = [];
        
        for(var i = 0; i < A.length; i++){
            out.push([]);
            for(var j = 0; j < A[i].length; j++){
                out[i].push(Math.ceil(A[i][j]));
            }
        }
		
		return out;
	}

	ceil.shortHelp = "Rounds the input toward positive infinity.";
    ceil.help = "# Ceil \n \
Rounds the values in matrix A toward positive infinity. \n\n\
## Syntax\n\
```\n\
a = ceil(A);\n\
```\n\n\
## Description \n\
Rounds the value in `A` to the nearest whole number toward positive infinity. \
\n\n\
### Inputs\n\
- `A` -- Matrix of values to apply the method. \n\
\n\n\
### Outputs\n\
This is a single output function, with the following:\n\n\
- `a` -- the rounded value of `A`.\n\n\
## Examples\n\
1. Applying ceil to a matrix  \n\
```\n\
A = [1.11, 2.52, 1.85; 1.99, 2.01, 1.92];\n\
a = ceil(A)\n\
% a = [2, 3, 2; 2, 3, 2] \n\
```\n\n\
## References\n\n\
1. Rounding; Wikipedia; [http://en.wikipedia.org/wiki/Floor_and_ceiling_functions](http://en.wikipedia.org/wiki/Floor_and_ceiling_functions)\n";

	return ceil;
});
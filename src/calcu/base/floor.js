define([], function(){
	
	function floor(A) {
		
		var out = [];
        
        for(var i = 0; i < A.length; i++){
            out.push([]);
            for(var j = 0; j < A[i].length; j++){
                out[i].push(Math.floor(A[i][j]));
            }
        }
		
		return out;
	}

	floor.shortHelp = "Rounds the input toward negative infinity.";
	floor.help = "# Floor \n \
Rounds the values in matrix A toward negative infinity. \n\n\
## Syntax\n\
```\n\
a = floor(A);\n\
```\n\n\
## Description \n\
Rounds the value in `A` to the nearest whole number toward negative infinity. \
\n\n\
### Inputs\n\
- `A` -- Matrix of values to apply the method. \n\
\n\n\
### Outputs\n\
This is a single output function, with the following:\n\n\
- `a` -- the rounded value of `A`.\n\n\
## Examples\n\
1. Applying floor to a matrix  \n\
```\n\
A = [1.11, 2.52, 1.85; 1.99, 2.01, 1.92];\n\
a = floor(A)\n\
% a = [1, 2, 1; 1, 2, 1] \n\
```\n\n\
## References\n\n\
1. Rounding; Wikipedia; [http://en.wikipedia.org/wiki/Floor_and_ceiling_functions](http://en.wikipedia.org/wiki/Floor_and_ceiling_functions)\n";


	return floor;
});
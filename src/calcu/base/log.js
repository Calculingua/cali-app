define([],function(){
    
    function log(A) {
        
        var out = [];
        var row;
        for(var i in A){
            row = [];
            for(var j in A[i]){
                row.push(Math.log(A[i][j]));
            }
            out.push(row);
        }
        return out;
    }

    function log10(A) {
        // log10() is not implemented in all javascript engines
        var _log10 = (Math.log10) ? Math.log10 : function(x) {
            return Math.log(x)/Math.log(10);
        };
        
        var out = [];
        var row;
        for(var i in A){
            row = [];
            for(var j in A[i]){
                row.push(_log10(A[i][j]));
            }
            out.push(row);
        }
        return out;
    }


    function log2(A) {
        // log2() is not implemented in all javascript engines
        var _log2 = (Math.log2) ? Math.log2 : function(x) {
            return Math.log(x)/Math.log(2);
        };

        var out = [];
        var row;
        for(var i in A){
            row = [];
            for(var j in A[i]){
                row.push(_log2(A[i][j]));
            }
            out.push(row);
        }
        return out;
    }
	
    log.help = "# log(A) \n \
Computes the natural logarithm of each element of 'A'. \n";
    log10.help = "# log10(A) \n \
Computes the logarithm with base 10 of each element of 'A'. \n";
    log2.help = "# log2(A) \n \
Computes the logarithm with base 10 of each element of 'A'. \n";

    log.shortHelp = "Computes the natural logarithm of each element of the input.";
    log10.shortHelp = "Computes the logarithm with base 10 of each element of the input.";
    log2.shortHelp = "Computes the logarithm with base 10 of each element of the input.";

    return {
      log: log,
      log10: log10,
      log2: log2
    };

});
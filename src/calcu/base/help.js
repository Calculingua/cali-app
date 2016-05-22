define([], function(){
	
    var shortHelp = "Gets the help documentation on functions.";
    
	function help() {

        function spaces(n) {
            var out = [];
            for (var i=0; i<n; i++) {
                out.push(' ');
            }
            return out.join('');
        }

		var text = shortHelp;
		var callback = arguments[arguments.length -1];

		if (this.line.length > 1) {

			var command = this.line[1];
			text = "Help document not available for `" + command + "`.  Please contact the developer.";
			this.operators.getFunction(command, function(err, func){
				if(err){
					callback(err);
				}else{
					if(func && func.help){
						text = func.help;
					}else if(func && func.shortHelp){
						text = func.shortHelp;
					}
					callback(null, {text: text});
				}
			});
		}else{
            var helpFuncs = [];
            for (var func in this.operators.funcList) {
                var ht = this.operators.funcList[func].shortHelp || "Help document not available.  Please contact the developer.";
                helpFuncs.push("`" + func + "`" + spaces(10-func.length) + ht);
            }
            var out = helpFuncs.sort(function(a, b){
                if(a > b){
                    return 1;
                }else if(a < b){
                    return -1;
                }else{
                    return 0;
                }
            });
			callback(null, {text: out.join('\n\n') });
		}
	}
	help.async = true;
	
	help.shortHelp = shortHelp;
	help.help = "# help [command] \n\
Help obtains help documentation for any and all commands";

	return help;
});
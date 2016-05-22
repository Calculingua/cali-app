define([],function(){
	
	function pi() {

		if (arguments.length > 0 && arguments[0] != null) {
			throw "Operator Error :: PI : no arguments supported.";
		}

		return [ [ Math.PI ] ];
	}

	pi.shortHelp = "Returns the trigonometric constant PI.";
	pi.help = "# pi \n \
Is the number constant 'Pi' \n";

	return pi;
});
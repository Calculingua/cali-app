define([], function () {
	
	function clear() {

		var clearVars = {};
		if (this.line.length > 1) {
			for ( var i = 1; i < this.line.length; i++) {
				var name = this.line[i];
				switch (name) {
				case "all":
					clearVars = {};
					break;
				case ")":
					break;
				default:
					clearVars[name] = true;
					break;
				}
			}
		}

		var setVars = true;
		for ( var prop in clearVars) {
			setVars = false;
			break;
		}
		if (setVars) {
			clearVars = this.variables;
		}

		for ( var key in clearVars) {
			delete this.variables[key];
		}

		// this.variables = {};
		return null;
	}

	clear.shortHelp = "Clears variables from the workspace.";
	clear.help = "# clear [var, all] \n \
Clears the specified variables from the workspace. If the 'all' keyword \
is used, all of the variables are cleard from the workspace. \n ";

	return clear;
});
(function(){
	function MockDiv() {
		this.html = "";
	}
	MockDiv.prototype.html = function(html) {
		this.html = html;
	};
	MockDiv.prototype.append = function(html) {
		this.html += html;
	};
	
	// create the namspace
	if (typeof window.cali == "undefined") {
		window.cali = {};
	}
	if (typeof window.cali.spec == "undefined") {
		window.cali.spec = {};
	}
	
	if (typeof window.cali.spec.mock == "undefined") {
		window.cali.spec.mock = {};
	}
	// attach the module to the proper place
	window.cali.spec.mock.Div = MockDiv;

})();
define([], function () {

// # Extend
// Adapted from several sources:
// 
// * [Classical Inheritence in Javascript](http://javascript.crockford.com/inheritance.html) by Douglas Crockford
// * [Object Oriented Programming in Javascript](http://mckoss.com/jscript/object.htm) by Mike Koss
// 
// Author : [William Burke](mailto:wburke@calculingua.com)  
// Date : 11/26/2012  


  function extend(parent) {
		this.prototype = Object.create(parent.prototype);
		this.prototype.constructor = parent;

		var d = 0, p = this.prototype;

		this.prototype.uber = function(args) {
			var f = d;
			var t = d;
			var v = parent.prototype;
			if (t) {
				while (t) {
					v = v.constructor.prototype;
					t -= 1;
				}
				f = v.constructor;
			} else {
				f = p.constructor;
			}
			d += 1;
			f.apply(v, arguments);
			// hoist the base properties from v into this
			for ( var prop in v) {
				if (typeof v[prop] != "function") {
					this[prop] = v[prop];
				}
			}
			d -= 1;
			return this;
		};

		return this;
	}

  return extend;

});



define(["../Emitter", "../extend"], function(Emitter, extend){

	function mExpression(_type, _oop, nArgs, _input, _pos) {
		this.uber();
		// type of the variable
		this.type = _type;
		// initialize the order of operations
		this.oop = _oop;
		// this defines the desired number of arguments
		this.nArgs = nArgs;
		// input
		this.pos = _pos;
		// initialize the parent to itself
		this.parent = null;
		// the association
		this.args = [];
	}

  extend.call(mExpression, Emitter);

	mExpression.prototype.SUCCESS = 0;
	mExpression.prototype.ORPHANED_CHILD = 1;
	mExpression.prototype.NO_CHILDREN = 2;
	mExpression.prototype.precision = 1e-9;
	mExpression.prototype.NO_CHILDREN = 2;

	mExpression.prototype.fillFirstArg = function(exp) {
		// if this has a lower OOP
		if (this.oop <= exp.oop) {
			if (!exp.end()) {
				return this.ORPHANED_CHILD;
			}
			this.parent = exp.parent;
			exp.parent = this;
			this.push(exp);
		}
		// if this has a higher OOP
		else {
			var parentArg = exp;
			while (parentArg.oop < this.oop) {
				parentArg = parentArg.end();
				if (!parentArg) {
					return this.NO_CHILDREN;
				}
			}
			parentArg = parentArg.parent.pop();
			this.parent = parentArg.parent;
			parentArg.parent = this;
			this.push(parentArg);
			this.parent.push(this);
		}
		return this.SUCCESS;
	};

	mExpression.prototype.fillSecondArg = function(_input, operators) {
		// store the variables
		if (this.pos < _input.length) {
			var opp = operators.get(_input[this.pos]);
			var x = new opp.expression(_input, this.pos, this, operators);
			this.pos = x.getFinalPosition();
		} else {
			throw ("Expression Error with " + this.type + ": Insufficient number of arguments. ");
		}
	};

	mExpression.prototype.fillFirstArgNumber = function(exp, num, operators) {
		var numToken = [ {
			token : num.toString()
		} ];
		var parentArg = new operators.number.expression(numToken, 0, this, operators);
		this.parent = exp;
		parentArg.parent = this;
		this.parent.push(this);
	};

	mExpression.prototype.end = function() {
		var out = null;
		if (this.args.length == this.nArgs) {
			out = this.args[this.args.length - 1];
		}
		return out;
	};

	mExpression.prototype.pop = function() {
		var out = null;
		if (this.args.length == this.nArgs) {
			out = this.args.pop();
		}
		return out;
	};

	mExpression.prototype.push = function(arg) {
		this.args.push(arg);
	};

	mExpression.prototype.getFinalPosition = function() {
		return this.pos;
	};

	mExpression.prototype.roundToPrecision = function(value) {
		return this.precision * Math.round(value / this.precision);
	};

	mExpression.prototype.interpret = function(opts, callback){
		callback("TODO: not implemented");
	};

	return mExpression;

});
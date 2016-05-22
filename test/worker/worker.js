window = {
	cali: {}
};
cali = window.cali;

// import all scripts used for calculation
importScripts("/lib/cali/cali-sdk.js");
importScripts("/lib/cali/cali-app.js");

function Async(control) {
	
	this.uber();
	var self = this;

	this.send = function() {
		var args = [];
		for (var i = 1; i < arguments.length; i++) {
			args.push(arguments[i]);
		}
		var message = {
			type: arguments[0],
			args: args
		};
		postMessage(message);
	};

	control.onmessage = function(event) {
		var type = event.data.type;
		var args = event.data.args;
		self.emit(type, args);
	};
}
Async.extend(cali.sdk.Emitter);

// -------------- Application ------------------

var async = new Async(self);

var remoteFactory = new cali.remoteMethod.Factory();
remoteFactory.bind(async);

var model = {};
model.data = remoteFactory.create("model.data", [
	"getIt", "setIt"
]);

async.on("setIt", function(val) {
	if (val && val[1]) {
		async.send("log", "setIt with callback");
		model.data.setIt(val[0], function(err, data) {
			async.send("log", "setIt::callback(", err, data, ")");
		});
	} else {
		async.send("log", "setIt without callback");
		model.data.setIt(val[0]);
	}
});

async.on("getIt", function(val) {
	if (val && val[0]) {
		async.send("log", "getIt with callback");
		model.data.getIt(function(err, data) {
			async.send("log", "getIt::callback(", err, data, ")");
		});
	} else {
		async.send("log", "getIt without callback");
		model.data.getIt();
	}
});

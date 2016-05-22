// # Async Command Parser
// Runs the mathematical calculations asynchronously using a Web Worker. 
// 
// Author : [William Burke](wburke@calculingua.com)  
// Date : 11/23/2012  

(function() {

	function Master() {
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
			self.worker.postMessage(message);
		};
		
		this.end = function(){
			this.worker.terminate();
		}
		
		this.worker = new Worker("worker.js");
		this.worker.addEventListener("message", function(event){
			var type = event.data.type;
			var args = event.data.args;
			// console.log("new message:", type, args);
			self.emit(type, args);
		}, false);
		
		this.worker.addEventListener("error", function(event){
			var error = event.message;
			console.error("message error : " + error);
		}, false);
		
	}
	Master.extend(cali.sdk.Emitter);

	window.Master = Master;

})();

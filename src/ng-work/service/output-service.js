define([
], function(){

  function Output($rootScope){
		var self = this;
		this.output = null;
		
		this.outputList = [];
		
		this.register = function(name, controller){
			this.outputList.push({name : name, controller: controller});
			if(name == "history"){
				this.output = this.outputList[this.outputList.length - 1].controller;
			}
		};
		
		this.switch = function(name){
			for(var i = 0; i < self.outputList.length; i++){
				if(self.outputList[i].name == name){
					self.output = self.outputList[i].controller;
					break;
				}
			}
		};
	}
	
	return ["$rootScope", Output];

});
define([
], function(){
	
	function Factory(userData, service){
		var scratchPath = "/app/account/" + userData.username + "/notebook/scratch";
		var model = service.create();
		model.bindNew(scratchPath, "Working")
		.catch(function(){
			console.log("Scratch Page: error binding to new, trying latest.");
			return model.bindLatest(scratchPath);
		})
		.catch(function(err){
			console.error("Scratch Page: error binding to latest. ");
		});
		
		return model;
	}
	
    return ["UserData", "NotebookPageService", Factory];

});
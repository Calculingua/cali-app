define([
  "loggr",
], function (Loggr) {
	
	function Service(userData){
		
		if(userData.username && userData.env != "development"){
			try{
				Loggr.Log.trackUser(userData.username);
			}catch(ex){
				console.log("Could not track user because of error:", ex.toString());
			}
		}
		
		this.log = function(cc, event, data){
			if(userData.env == "development"){
				console.warn("loggr disabled in development.");
			}else{
				try{
					var ttags = "";
					ttags += " " + userData.env;
					Loggr.Log.events.createEvent()
						.source(cc || "")
						.text(event || "" )
						.user(userData.username || "")
						.tags(ttags || "")
						.data(data || "")
						.post();
				}catch(ex){
					console.log("Exception with logging:", ex.toString());
				}
			}
		};
	}

  return ["UserData", Service];

});
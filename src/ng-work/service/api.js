define(function(){
    
    function Service($http, $window){
        this.submitIssue = function(issue){
            return $http.post("/app/userIssue", issue)
            .then(function(reply){
                return reply.data;
            });
        };
		
		this.oauthConnect = function(service){
			return $window.location.replace( "/oauth2/auth?service=" + service);
		};
    }
    
    return ["$http", "$window", Service];
});
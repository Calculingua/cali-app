define(function(){
    
    var notUserCreated = [
        "about.html", "careers.html", "checkEmail.html", "createAccount.html", "developers.html", 
        "features.html", "index.html", "login.html", "passwordReset.html", "pricing.html", "requestReset.html", 
        "roadmap.html", "signup.html", "support.html", "thanks.html"
    ];
    
    function Controller($scope, $window, $timeout, notebookNotifier){
        
        var self = this;
        
        this.trialDays = 15;
        this.proRate = 20;
        this.academicRate = 2;
        this.showPrereg = false;
        
        this.openPrereg = function(){
            
            self.showPrereg = true;
        };
        
        $scope.$on("prereg.modal", function(scope, data){
            self.showPrereg = data;
        });
        
        var show = true;
        for(var i = 0; i < notUserCreated.length; i++){
            var page = notUserCreated[i];
            if($window.location.pathname.indexOf(page) >= 0){
                show = false;
                break;
            }
        }
        
        if(show){
            $timeout(function(){
                notebookNotifier.start();
            }, 1000);
            
        }
    }
    
    return ["$scope", "$window", "$timeout", "NotebookNotiferMdl", Controller];
});
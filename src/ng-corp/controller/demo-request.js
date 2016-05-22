define([], function(){
    
    function Controller(api){
        
        var self = this;
        
        this.name = "";
        this.email = "";
        this.phone = "";
        this.message = {
            class : "",
            text: ""
        };
        
        this.busy = false;
        
        this.submit = function(valid){
            self.message.text = "";
            if(valid){
                self.busy = true;
                api.requestDemo(self.name, self.email, self.phone)
                    .then(function(okay){
                        self.message.text = "You will be contacted shortly.";
                        self.name = "";
                        self.email = "";
                        self.phone = "";
                    })
                    .catch(function(err){
                        self.message.text = "There was a problem with your request." + (err.msg || "");
                    })
                    .finally(function(){
                        self.busy = false;
                    });
            }
        };
        
    }
    
    return ["api", Controller];
});
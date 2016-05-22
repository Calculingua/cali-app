define(function(){
    
    var signup_version = "0.0.2";
    
    function transformName(name) {
        try {
            if (name) {
                var out = name.split(" ");
                return out;
            } else {
                return null;
            }
        } catch (e) {
            console.error("EXCEPTION in transformName : " + e.toString());
            return null;
        }
    }
    
    function Controller($scope, $timeout, $window, api, textInput, urlParams, userInfo){
        
        var self = this;
        
        this.busy = false;
        this.mail = {};
        this.name = textInput.create();
        this.email = textInput.create();
        this.mail.isValid = textInput.transformEmail;
        this.message = { class: "", text: ""};
        
        this.cancel = function(){
            self.name.text = "";
            self.email.text = "";
            self.message = "";
            self.close();
        };
        
        this.close = function(){
            $scope.$emit("prereg.modal", false);
        };
        
        this.submit = function(){
            
            self.busy = true;
            self.message.class = "";
            self.message.text = "";

            var nameOkay = self.name.valid();
            var emailOkay = self.email.valid();

            if (nameOkay && emailOkay) {

              var referral = urlParams.getParams().referral || "";
              // var referral = $location.search()["referral"];
              var data = {
                name: transformName(self.name.text),
                email: self.email.text,
                referral: referral,
                version: signup_version
              };

              api.prereg(data)
                .success(function (data) {
                  self.busy = false;
                  var url;
                  switch (data.message) {
                    case "success":
                      userInfo.setPrereg(data.cnt, data.url);
                      self.message.text = "Congratulations on successfully registering! ";
                      self.message.class = "input-good";
                      url = "thanks.html";
                      if (urlParams.referral) {
                        url += "?" + "referral=" + urlParams.referral;
                      }
                      self.close();
                      $window.parent.location = url;
                      break;
                    case "already registered":
                      self.message.text = "You have already registered with that email address.";
                      self.message.class = "input-bad";
                      break;
                    case "Check your email for registration link":
                      self.message.text = "Congratulations on successfully registering! ";
                      self.message.class = "input-good";
                      url = "/checkEmail.html";
                      if (urlParams.referral) {
                        url += "?" + "referral=" + urlParams.referral;
                      }
                      self.close();
                      $window.parent.location = url;
                      break;
                    default:
                      self.message.text = "There was a problem.  Try again later.";
                      self.message.class = "input-bad";
                      break;
                  }
                })
                .error(function (reason) {
                  self.busy = false;
                  self.message.text = "There was a problem.  Try again later.";
                  self.message.class = "input-bad";
                });
            } else {
                self.busy = false;
                self.message.text = "Check yourself";
                self.message.class = "input-bad";
                $timeout(function () {
                    self.message.class = "";
                    self.message.text = "";
                }, 5000);
            }
        };
        
    }
    
    return ["$scope", "$timeout", "$window", "api", "text-input", "urlParams", "user-info", Controller];
});
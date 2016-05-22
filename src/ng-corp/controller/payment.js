define([
], function () {
	
	var signup_version = "0.0.4";
	
	function Controller($scope, $timeout, $window, userInfo, urlParams, textInput, stripeFactory, api, paymentPlans){
		
		$scope.trialDays = paymentPlans.trialDays;
		$scope.proRate = paymentPlans.proRate;
		$scope.academicRate = paymentPlans.academicRate;
		
		var processPrereg = function(data){
			$scope.message.text = "Processing Pre-Registration...";
			$scope.busy = true;
			$timeout(function(){
				$scope.$apply();
			});
			api.prereg(data)
				.success(function(data){
					$scope.busy = false;
					var url;
					switch (data.message) {
					case "success":
						userInfo.setPrereg(data.cnt, data.url);
						$scope.message.text = "Congratulations on successfully registering! ";
						$scope.message.class = "input-good";
						url = "thanks.html";
						if (urlParams.referral) {
							url += "?" + "referral=" + urlParams.referral;
						}
						$window.parent.location = url;
						break;
					case "already registered":
						$scope.message.text = "You have already registered with that email address.";
						$scope.message.class = "input-bad";
						break;
					case "Check your email for registration link":
						userInfo.setPrereg(data.cnt, data.url);
						$scope.message.text = "Congratulations on successfully registering! ";
						$scope.message.class = "input-good";
						url = "checkEmail.html";
						if (urlParams.referral) {
							url += "?" + "referral=" + urlParams.referral;
						}
						$window.parent.location = url;
						break;
					default:
						$scope.message.text = "There was a problem.  Contact support to resolve it.";
						$scope.message.class = "input-bad";
						break;
					}
				})
				.error(function(reason){
					$scope.busy = false;
					$scope.message.text = "There was a problem. Contact support to resolve it.";
					$scope.message.class = "input-bad";
				});
		};
		
		var stripeSignup = function(token){
			var referral = urlParams.getParams().referral || "";
			var data = {
				name : transformName($scope.name.text),
				email : $scope.email.text,
				referral : referral,
				version : signup_version,
				stripeToken: token
			};
			processPrereg(data);
		};
		
		var trialSignup = function(){
			var referral = urlParams.getParams().referral || "";
			var data = {
				name : transformName($scope.name.text),
				email : $scope.email.text,
				referral : referral,
				version : signup_version,
				trialDays: $scope.trialDays
			};
			processPrereg(data);
		};
		
		userInfo.setPrereg(0, "");
		$scope.busy = false;
		$scope.name = textInput.create();
		$scope.email = textInput.create();
		$scope.email.isValid = textInput.transformEmail;
		$scope.message = { class : "", text : ""};
		
		var transformName = function(name) {
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
		};
		
		$scope.buy = function(){
			submit("buy");
		};
		
		$scope.trial = function(){
			submit("trial");
		};

		var submit = function(type){
			// $scope.busy = true;
			$scope.message.class = "input-good";
            
			
			var nameOkay = $scope.name.valid();
			var emailOkay = $scope.email.valid();
			
			var saleName = "Pro Access";
			var saleDesc = "Professional access for $" + $scope.proRate + "/month";
			var salePrice = $scope.proRate * 100;
			
			var emailSplit = $scope.email.text.split(".");
			if(emailSplit[emailSplit.length - 1] == "edu"){
				saleName = "Academic Access";
				saleDesc = "Academic access for $" + $scope.academicRate + "/month";
				salePrice = $scope.academicRate * 100;
			}
			
			if(nameOkay && emailOkay){
				switch(type){
				case "buy":
					$scope.message.text = "Loading Stripe...";
					try{
						var handler = stripeFactory(stripeSignup);
					    handler.open({
					      name: saleName,
					      description: saleDesc,
					      amount: salePrice,
						  email: $scope.email.text,
						  opened: function(){
							  console.log("opened");
						  },
						  closed: function(){
							  if($scope.message.text == "Loading Stripe..."){
								  $scope.message.text = "";
								  $scope.$apply();
							  }
							  console.log("closed");
						  }
					    });
					}catch(ex){
						console.log("STRIPE: error on loading...");
						$scope.busy = false;
						$scope.message.text = "ERROR: " + ex.toString() + " Please contact support@calculingua.com.";
						$scope.message.class = "input-bad";
					}
					
					break;
				case "trial":
					$scope.message.text = "Authorizing...";
					trialSignup();
					break;
				}
			}else{
				$scope.busy = false;
                $scope.message.text = "Check yourself";
                $scope.message.class = "input-bad";
                $timeout(function(){
                    $scope.message.class = "";
                    $scope.message.text = "";
                }, 5000);
			}
		};
	}

  return ["$scope", "$timeout", "$window", "user-info", "urlParams", "text-input", "StripeFactory", "api", "PaymentPlans", Controller];

});
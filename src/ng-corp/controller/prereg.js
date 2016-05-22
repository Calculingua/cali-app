define([
], function () {


  var signup_version = "0.0.2";

  function Controller($scope, $timeout, $window, userInfo, urlParams, textInput, api) {

    userInfo.setPrereg(0, "");
    $scope.busy = false;
    $scope.name = textInput.create();
    $scope.email = textInput.create();
    $scope.email.isValid = textInput.transformEmail;
    $scope.message = { class: "", text: ""};

    var transformName = function (name) {
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

    $scope.submit = function () {
      $scope.busy = true;
      $scope.message.class = "";
      $scope.message.text = "";

      var nameOkay = $scope.name.valid();
      var emailOkay = $scope.email.valid();

      if (nameOkay && emailOkay) {


        var referral = urlParams.getParams().referral || "";
        var data = {
          name: transformName($scope.name.text),
          email: $scope.email.text,
          referral: referral,
          version: signup_version
        };

        api.prereg(data)
          .success(function (data) {
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
                $scope.message.text = "Congratulations on successfully registering! ";
                $scope.message.class = "input-good";
                url = "checkEmail.html";
                if (urlParams.referral) {
                  url += "?" + "referral=" + urlParams.referral;
                }
                $window.parent.location = url;
                break;
              default:
                $scope.message.text = "There was a problem.  Try again later.";
                $scope.message.class = "input-bad";
                break;
            }
          })
          .error(function (reason) {
            $scope.busy = false;
            $scope.message.text = "There was a problem.  Try again later.";
            $scope.message.class = "input-bad";
          });
      } else {
        $scope.busy = false;
        $scope.message.text = "Check yourself";
        $scope.message.class = "input-bad";
        $timeout(function () {
          $scope.message.class = "";
          $scope.message.text = "";
        }, 5000);
      }
    };
  }

  return ["$scope", "$timeout", "$window", "user-info", "urlParams", "text-input", "api", Controller];



});
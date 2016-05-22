define([
], function () {

  function Controller($scope, $timeout, $sce, $window, urlParams, api, textInput) {
    $scope.busy = false;
    $scope.username = textInput.create();
    $scope.pass0 = textInput.create();
    $scope.pass1 = textInput.create();
    $scope.message = {text: "", class: "", trust: function () {
      return $sce.trustAsHtml($scope.message.text);
    }};

    $scope.submit = function () {

      $scope.busy = true;

      $scope.message.class = "";
      $scope.message.text = "";

      var usernameOk = $scope.username.valid();
      var passOkay = textInput.checkPassword($scope.pass0.text, $scope.pass1.text);
      if (!passOkay) {
        $scope.pass0.class = "text-error";
        $scope.pass1.class = "text-error";
      } else {
        $scope.pass0.class = "";
        $scope.pass1.class = "";
      }

      if (usernameOk && passOkay) {

        var data = {
          userid: $scope.username.text,
          password: $scope.pass0.text
        };

        var key = urlParams.getParams().key || "";

        api.passwordReset(data, key)
          .success(function (data) {
            $scope.busy = false;
            $scope.message.text = "Congratulations on successfully resetting your password! Login any time.";
            $scope.message.class = "input-good";
            var url = "login.html";
            $timeout(function () {
              $window.parent.location = url;
            }, 3000);
          })
          .error(function (data) {
            $scope.busy = false;
            switch (data) {
              case "account not found":
                $scope.message.text = "Your account was not found. Please contact <a href=\"mailto:support@calculingua.com\">Support</a>.";
                $scope.message.class = "input-bad";
                break;
              case "unacceptable password":
                $scope.message.text = "Your password is not acceptable.  It needs to be longer than 6 characters.";
                $scope.message.class = "input-bad";
                break;
              default:
              case "error saving password":
                $scope.message.text = "You are reusing a previous password. Please try again.";
                $scope.message.class = "input-bad";
                break;
            }
          });
      } else {
        $scope.busy = false;
        $scope.message.text = "Check yourself, and try again!  Password must be longer than 6 characters.";
        $scope.message.class = "input-bad";
      }
    };
  }

  return ["$scope", "$timeout", "$sce", "$window", "urlParams", "api", "text-input", Controller];


});
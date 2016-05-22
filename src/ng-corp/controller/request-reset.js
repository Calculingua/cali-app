define([
], function () {

  function Controller($scope, $sce, textInput, api) {
    $scope.busy = false;

    $scope.email = textInput.create();
    $scope.email.isValid = textInput.transformEmail;

    $scope.message = {text: "", class: "", trust: function () {
      return $sce.trustAsHtml($scope.message.text);
    }};

    $scope.submit = function () {
      $scope.busy = true;

      var emailOk = $scope.email.valid();

      if (emailOk) {
        var data = {
          email: $scope.email.text
        };

        api.requestReset(data)
          .success(function (data) {
            $scope.busy = false;
            $scope.message.text = "Check you email for reset instructions.";
            $scope.message.class = "input-good";
          })
          .error(function (data) {
            $scope.busy = false;
            switch (data) {
              case "account not found":
                $scope.message.text = "Userid and/or email not found.";
                $scope.message.class = "input-bad";
                break;
              case "failed sending email":
                $scope.message.text = "There was a problem sending your email. Please contact <a href=\"mailto:support@calculingua.com\">support</a>.";
                $scope.message.class = "input-bad";
                break;
              default:
                $scope.message.html("There was an unknow problem. Please contact <a href=\"mailto:support@calculingua.com\">support</a>.");
                $scope.message.class = "input-bad";
                break;
            }
          });
      } else {
        $scope.busy = false;
        $scope.message.text = "Check yourself, and try again!";
        $scope.message.class = "input-bad";
      }

    };
  }

  return ["$scope", "$sce", "text-input", "api", Controller];



});
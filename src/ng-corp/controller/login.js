define([
], function () {

  function Controller($scope, $window, $timeout, textInput, api) {
    $scope.busy = false;

    $scope.onLogin = function () {

      if ($scope.username.valid() && $scope.password.valid()) {
        $scope.busy = true;
        var data = {
          userid: $scope.username.text,
          password: $scope.password.text,
        };
        api.login(data)
          .success(function (data) {

            if (data.status == "success") {
              $scope.message.class = "input-good";
              $scope.message.text = "Congratulations on successfully signing in!";
              $window.parent.location = "/";
            } else {
              $scope.message.class = "input-bad";
              switch (data.error) {
                case "Password incorrect":
                  $scope.message.text = "Your password was incorrect, please try again.";
                  break;
                case "Username not found":
                  $scope.message.text = "Your username was not found, please try again.";
                  break;
                case "account not active":
                  $scope.message.text = "Your account has be deactivated.";
                  break;
                default:
                  $scope.message.text = "There was a problem with your sign in.  Try again later.";
                  break;
              }
              $timeout(function () {
                $scope.message.class = "";
                $scope.message.text = "";
              }, 5000);
            }
          })
          .error(function (jqXHR, textStatus, errorThrown) {
            $scope.message.text = "The server did not like that, try again.";
            $scope.message.class = "input-bad";
          })
          .finally(function () {
            $scope.busy = false;
            $scope.password.text = "";
          });
      } else {
        $scope.message.text = "Check yourself";
        $scope.message.class = "input-bad";
        $timeout(function () {
          $scope.message.class = "";
          $scope.message.text = "";
        }, 5000);
      }
    };

    $scope.requestReset = function () {
      $window.parent.location = "/requestReset.html";
    };

    $scope.username = textInput.create();
    $scope.password = textInput.create();

    $scope.message = {text: "", class: ""};
  }

  return ["$scope", "$window", "$timeout", "text-input", "api", Controller];



});

define([
], function () {

  function Controller($scope, $window, $location, urlParams, textInput, api, analytics) {
    $scope.busy = true;
    $scope.name = textInput.create();
    $scope.email = textInput.create();
    $scope.email.isValid = textInput.transformEmail;
    $scope.username = textInput.create();
    $scope.pass0 = textInput.create();
    $scope.pass1 = textInput.create();

    var key = urlParams.getParams().key || "";

    $scope.message = {text: "", class: ""};

    api.getRegKey(key)
      .success(function (data) {
        if (data) {
          $scope.email.text = data.email;
          $scope.name.text = data.name.length ? data.name.join(" ") : "";
        }

      })
      .error(function (err) {
        console.error("err");
      })
      .finally(function () {
        $scope.busy = false;
      });

    $scope.submit = function () {
      $scope.busy = true;
      $scope.message.class = "";
      $scope.message.text = "";

      var emailOkay = $scope.email.valid();
      var nameOkay = $scope.name.valid();
      var usernameOkay = $scope.username.valid();
      var passOkay = textInput.checkPassword($scope.pass0.text, $scope.pass1.text);

      if (!passOkay) {
        $scope.pass0.class = "text-error";
        $scope.pass1.class = "text-error";
      } else {
        $scope.pass0.class = "";
        $scope.pass1.class = "";
      }

      if (emailOkay && nameOkay && usernameOkay && passOkay) {

        var data = {
          id: $scope.username.text,
          name: textInput.transformName($scope.name.text),
          email: $scope.email.text,
          password: $scope.pass0.text
        };

        api.register(data, key)
          .success(function (data) {
            $scope.busy = false;
            if (data.status == "success") {
              $scope.message.text = "Congratulations! We're logging you in now.";
              $scope.message.class = "input-good";
              analytics.log("account-creation", "success");
              setTimeout(function () {
                var data = {
                  userid: $scope.username.text,
                  password: $scope.pass0.text,
                };
                api.login(data)
                  .success(function (data) {
                    if (data.status == "success") {
                      $window.parent.location = "/";
                    } else {
                      $scope.message.text = "Something happened with your login.  Try again.";
                      $scope.message.class = "input-bad";
                    }
                  });
              }, 3000);
            } else {
              analytics.log("account-creation", "failure", data.reason);
              switch (data.reason) {
                case "id and email already exist in database":
                  $scope.message.text = "The ID and email address you entered already have an account on Calculingua.";
                  $scope.username.class = "text-error";
                  $scope.email.class = "text-error";
                  $scope.message.class = "input-bad";
                  break;
                case "email already exists in database":
                  $scope.message.text = "The email address you entered is already associated with an account.";
                  $scope.email.class = "text-error";
                  $scope.message.class = "input-bad";
                  break;
                case "id already exists in database":
                  $scope.message.text = "The user id you entered is already taken.  Please try another. ";
                  $scope.username.class = "text-error";
                  $scope.message.class = "input-bad";
                  view.bad_username.show();
                  break;
                case "key not found":
                  $scope.message.text = "You are not currently authorized to register.  Try preregistering first.";
                  $scope.message.class = "input-bad";
                  break;
                default:
                  $scope.message.text = "There was a problem with your preregistraiton.  Try again later.";
                  $scope.message.class = "input-bad";
                  break;
              }
            }
          })
          .error(function (reason) {
            analytics.log("account-creation", "error", reason.toString());
            $scope.busy = false;
            $scope.message.text = "There was a problem with your preregistraiton.  Try again later.";
            $scope.message.class = "input-bad";
          });
      } else {
        $scope.busy = false;
        $scope.message.text = "Check yourself, and try again!";
        $scope.message.class = "input-bad";
      }
    };
  }

  return ["$scope", "$window", "$location", "urlParams", "text-input", "api", "Analytics", Controller];

});
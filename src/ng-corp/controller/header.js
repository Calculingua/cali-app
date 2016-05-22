define([
], function () {

  var proPlan = "beta-pro-20";
  var academicPlan = "beta-academic";

  function Controller($scope, $http, $window, userInfo, stripeFactory, analytics, paymentPlans) {

    $scope.showLoginWindow = false;
    $scope.proRate = paymentPlans.proRate;
    $scope.academicRate = paymentPlans.academicRate;

    $scope.onLoginClick = function () {
      $scope.showLogin = !$scope.showLogin;
    };

    $scope.showLogin = false;

    $scope.disableDropdown = function () {
      var disable = false;
      if ($window.parent.location.pathname == "/login.html") {
        disable = true;
      }
      return disable;
    };

    var stripeSignup = function (token) {
      console.log("token:", token);
      $http.post("/app/account/" + userInfo.username + "/plan", {stripeToken: token})
        .success(function (res) {
          getAccount();
        })
        .error(function (err) {
          console.error("error submitting token:", err);
        });
    };

    $scope.buyNow = function () {
      if ($scope.account.plan == "trial") {

        var saleName = "Pro Access";
        var saleDesc = "Professional access for $" + $scope.proRate + "/month";
        var salePrice = $scope.proRate * 100;

        var emailSplit = $scope.account.email.split(".");
        if (emailSplit[emailSplit.length - 1] == "edu") {
          saleName = "Academic Access";
          saleDesc = "Academic access for $" + $scope.academicRate + "/month";
          salePrice = $scope.academicRate * 100;
        }

        var handler = stripeFactory(stripeSignup);
        handler.open({
          name: saleName,
          description: saleDesc,
          amount: salePrice,
          email: $scope.account.email,
          opened: function () {
            console.log("opened");
          },
          closed: function () {
            console.log("closed");
          }
        });
      }
    };

    var getAccount = function () {
      $http.get("/app/account/" + userInfo.username)
        .then(function (res) {
          var account = res.data;
          $scope.account = account;
          $scope.accountClass = "trial";
          $scope.expiryModal.show = false;
          if (account.plan == "trial") {
            $scope.accountClass = "trial";
            var text;
            var modalText;
            if (account.trialDays === 0) {
              text = "trial";
              modalText = "Your trial is not currently set to expire.";
            } else {
              var n = account.trialDays - ((new Date()).getTime() - (new Date(account.creation_date)).getTime()) / (24 * 3600 * 1000);
              n = Math.ceil(n);
              text = "" + n;
              text += (n > 1) ? " days left" : " day left";
              modalText = "Your trial will expire in " + n;
              modalText += (n > 1) ? " days." : " day.";
              $scope.expiryModal.show = true;
              if (n > 10) {
                $scope.expiryModal.show = false;
              }
              if (n <= 0) {
                modalText = "Your " + account.trialDays + " day trial has expired!";
                text = "expired";
                $scope.expiryModal.force = true;
              }
            }
            $scope.accountText = text;
            $scope.expiryModal.messageText = modalText;

          } else if (/pro/.test(account.plan)) {
            $scope.accountText = "pro";
            $scope.accountClass = "pro";
          } else if (/academic/.test(account.plan)) {
            $scope.accountText = "academic";
            $scope.accountClass = "academic";
          }
        });
    };

    getAccount();

    if (userInfo.username) {
      $scope.loggedIn = true;
      $scope.username = userInfo.username;
      $scope.name = userInfo.name;
    }

    $scope.expiryModal = {};
    $scope.expiryModal.showModal = function () {
      if ($scope.account.plan == "trial") {
        $scope.expiryModal.show = true;
      }
    };
    $scope.expiryModal.show = false;
    $scope.expiryModal.force = false;

    $scope.expiryModal.notNow = function () {
      $scope.expiryModal.show = false;
    };

    $scope.expiryModal.logout = function () {
      $window.location = "/app/logout";
    };
  }

  return ["$scope", "$http", "$window", "user-info", "StripeFactory", "Analytics", "PaymentPlans", Controller];

});
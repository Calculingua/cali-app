define([
  'angular'
], function (angular) {

  function Controller($scope, $window, api, $timeout) {

    // Feedback
    var t = $('#feedback');

    var open = function () {
      t.animate({
        marginRight: "-5",
        height: "300px",
        "opacity": 1
      }).data("showing", true).children("img").siblings().show();
      t.children("img").hide();
    };

    var close = function () {
      t.animate({
        marginRight: "-300px",
        height: "120px",
        "opacity": 0.7
      }).data("showing", false).children("img").siblings().hide();
      t.children("img").show();
    };

    $scope.open = function () {
      open();
    };

    $scope.subjectBad = false;
    $scope.bodyBad = false;

    $scope.cancel = function () {
      close();

      $timeout(function () {
        $scope.subject = "";
        $scope.body = "";
        $scope.subjectBad = false;
        $scope.bodyBad = false;
        $scope.message = "";
      }, 0);

    };

    $scope.submit = function () {
      var subject = $scope.subject;
      var body = $scope.body;

      var submit = true;
      if (!subject) {
        $scope.subjectBad = true;
        submit = false;
      }

      if (!body) {
        $scope.bodyBad = true;
        submit = false;
      }

      if (submit) {
        $scope.subjectBad = false;
        $scope.bodyBad = false;
        $scope.message = "";
        
        var version = ($window.cali && $window.cali.version) ? $window.cali.version : "unknown";

        api.submitIssue({subject: subject, body: body, version: version})
          .then(function (data) {
            $scope.messageClass = "good_indicators";
            $scope.message = "Thanks!";
            $timeout(function () {
              $scope.subject = "";
              $scope.body = "";
              $scope.subjectBad = false;
              $scope.bodyBad = false;
              $scope.message = "";
              $scope.messageClass = "";
              close();
            }, 2000);
          })
          .catch(function (err) {
            $scope.messageClass = "bad_indicators";
            $scope.message = "Check it...";
          });
      } else {
        $scope.messageClass = "bad_indicators";
        $scope.message = "Check it...";
      }
    };
  }

  return ["$scope", "$window", "ApiService", "$timeout", Controller];
});
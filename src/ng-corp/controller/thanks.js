define([
], function () {

  function Controller($scope, $window, userInfo) {

    var dd = userInfo.getPrereg();

    $scope.queueNumber = dd.cnt > 0 ? dd.cnt : null;
    $scope.shareUrl = dd.url || document.location.origin + "/signup.html?referral=fe3f9125-c18b-1bca-b7d7-fb169316a186";

    var twitterPhrase = "Q: What's the most innovative statistical analysis platform?\nA: @calculingua\nThey're accepting beta users:";
    var twitterParams = "url=" + escape($scope.shareUrl) + "&text=" + escape(twitterPhrase);

    function openWindow(url, width, height) {
      width = width || 680;
      height = height || 340;
      $window.open(url, "Share Calculingua", "width=" + width + ", height=" + height);
    }

    $scope.clickTwitter = function () {
      openWindow("http://twitter.com/share?" + twitterParams);
    };

    var linkedinTitle = "Innovative Web-Based Statistical Software";
    var linkedinPhrase = "Calculingua is an innovative web-based statistical analysis platform. They're looking for beta users, and if you sign up using this special URL, you can help me get a free year: " + $scope.shareUrl;
    var linkedinParams = "mini=true" +
      "&url=" + escape($scope.shareUrl) +
      "&title=" + escape(linkedinTitle) +
      "&summary=" + escape(linkedinPhrase);

    $scope.clickLinkedIn = function () {
      openWindow("http://linkedin.com/shareArticle?" + linkedinParams, 600, 494);
    };

    var emailTitle = "Free Year of Web Based Statistical Software";
    var emailPhrase = "I need your help. I signed up for an innovative web-based statistical analysis platform called Calculingua. If you sign up too, then we can both get a free year!  Use this special URL: " + $scope.shareUrl + "\n\nThanks!";
    $scope.emailParams = "subject=" + escape(emailTitle) +
      "&body=" + escape(emailPhrase);

    $scope.message = "the unique url, coming to you in your email.";

    if ($scope.shareUrl) {
      $scope.message = "this unique URL:";
    }
  }

  return ["$scope", "$window", "user-info", Controller];


});
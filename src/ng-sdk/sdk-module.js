define([
  'angular',
  "./directive/enter-press",
  "./service/analytics",
  "./service/loggr",
  "./service/markdown",
  "./service/payment-plans",
  "./service/stripe",
  "./service/urlParams",
  "./service/user-data"
], function (angular, enterPress, Analytics, Loggr, Markdown, PaymentPlans, Stripe, UrlParams, UserData) {

  var caliSDKModule = angular.module("cali-sdk", []);

  caliSDKModule.directive('ngEnter', enterPress.ngEnter);
  caliSDKModule.directive('ngKeyUp', enterPress.ngKeyUp);
  caliSDKModule.directive('ngKeyDown', enterPress.ngKeyDown);

  caliSDKModule.service("Analytics", Analytics);
  caliSDKModule.service("PaymentPlans", PaymentPlans);
  caliSDKModule.service("loggr", Loggr);
  caliSDKModule.service("UserData", UserData);

  caliSDKModule.factory("Markdown", Markdown);
  caliSDKModule.factory("StripeFactory", Stripe);
  caliSDKModule.factory("urlParams", UrlParams);

  return caliSDKModule;

});



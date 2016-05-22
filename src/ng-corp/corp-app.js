define([
  "angular",
  "angularCookies",
  "../ng-sdk/sdk-module",
  "./controller/header",
  "./controller/payment",
  "./controller/login",
  "./controller/password-reset",
  "./controller/prereg",
  "./controller/registration",
  "./controller/request-reset",
  "./controller/thanks",
  "./controller/shell", 
  "./controller/prereg-modal",
  "./controller/demo-request",
  "./service/api",
  "./service/text-input",
  "./service/user-info",
  "./service/hopscotch",
  "./model/notebook-notifier",
  "./service/mobile-detect",
], function (angular, angularCookies, sdkModule, Header, Payment, Login, PasswordReset,Prereg, Registration, RequestReset, Thanks, Shell, PreregModal, DemoRequest, api, TextInput, UserInfo, Hopscotch, NotebookNotifierMld, MobileDetect) {


  var caliCorpModule = angular.module("cali-corp", [angularCookies.name, sdkModule.name]);

  caliCorpModule.config(["$interpolateProvider", "$provide", function ($interpolateProvider, $provide) {
      $interpolateProvider.startSymbol('<%');
      $interpolateProvider.endSymbol('%>');

    }]);
    

  caliCorpModule.controller("header", Header);
  caliCorpModule.controller("payment", Payment);
  caliCorpModule.controller("login", Login);
  caliCorpModule.controller("passwordReset", PasswordReset);
  caliCorpModule.controller("prereg",Prereg);
  caliCorpModule.controller("registration", Registration);
  caliCorpModule.controller("requestReset", RequestReset);
  caliCorpModule.controller("thanks", Thanks);
  caliCorpModule.controller("Shell", Shell);
  caliCorpModule.controller("PreregModal", PreregModal);
  caliCorpModule.controller("DemoRequestCtrl", DemoRequest);

  caliCorpModule.factory("api", api);
  caliCorpModule.factory("text-input", TextInput);
  caliCorpModule.factory("user-info", UserInfo);
  caliCorpModule.factory("hopscotch", Hopscotch);
  caliCorpModule.factory("mobile-detect", MobileDetect);
  
  caliCorpModule.service("NotebookNotiferMdl", NotebookNotifierMld);

  return caliCorpModule;


});


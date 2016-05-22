require.config({
  baseUrl: '../..',
  paths: {
    "ace": "./vendor/ace-builds/src-noconflict/ace",
    "mode-matlab": "./vendor/ace-builds/src-noconflict/mode-matlab",
    "cali-calcu": "./src/calcu",
    "cali-site": "./src",
    "async": "./vendor/async/lib/async",
    "jStat": "./vendor/jstat/dist/jstat",
    "numeric": "./vendor/numericjs/index",
    "marked": "./vendor/marked/lib/marked",
    "jQuery": "./vendor/jquery/dist/jquery",
    "jQuery.parse": "./vendor/jquery.parse/jquery.parse",
    "jQuery.flot": "./vendor/flot/jquery.flot",
    "jQuery.flot.canvas": "./vendor/flot/jquery.flot.canvas",
    "jQuery.flot.legendoncanvas": "./vendor/flot-legendoncanvas/jquery.flot.legendoncanvas",
    "jQuery.flot.axislabels": "./vendor/flot-axislabels/jquery.flot.axislabels",
    "jQuery.flot.orderbars": "./vendor/flot-orderbars/index",
    // "jQuery.flot.symbol": "./vendor/jquery.flot.symbol/index",
    "jQueryUI": "./vendor/jquery-ui/ui/jquery-ui",
    "slickMin": "//cdn.jsdelivr.net/jquery.slick/1.3.6/slick.min",
    "angular": "./vendor/angular/angular",
    "angularCookies": "./vendor/angular-cookies/angular-cookies",
    "canvas2image": "./vendor/canvas2image/canvas2image",
    "foundation": "./vendor/foundation/js/foundation",
    "checkout": "https://checkout.stripe.com/checkout",
    "ui.autocomplete": "./vendor/ui-autocomplete/autocomplete",
    "hopscotch": "./vendor/hopscotch/dist/js/hopscotch",
    "dropbox": "//cdnjs.cloudflare.com/ajax/libs/dropbox.js/0.10.3/dropbox",
    "jQuery.outerHTML": "./vendor/outerhtml/source/outerHTML-2.1.0-min",
    "loggr": "https://api.loggr.net/1/loggr.min.js?l=calculingua&a=0409a04625d54c55bb3d5a6a7c7a30e8",
    "lunr": "./vendor/lunr.js/lunr.min",
    "mobile-detect": "./vendor/mobile-detect/mobile-detect"
  },
  shim: {
    "ace":{
      exports: "ace"
    },
    "mode-matlab":{
      deps: ["ace"],
      exports: "ace",
    },
    "angular": {
      deps: ["jQuery"],
      exports: "angular"
    },
    "angularCookies": {
      deps: ['angular'],
      "init": function () {
        return window.angular.module("ngCookies");
      }
    },
    "async": {
      exports: "async"
    },
    "numeric": {
      exports: "numeric"
    },
    "marked": {
      exports: "marked"
    },
    "jStat": {
      exports: "jStat"
    },
    "jQuery": {
      exports: "$"
    },
    "jQuery.parse": {
      deps: ["jQuery"],
      exports: "$"
    },
    "jQuery.outerHTML": {
      deps: ["jQuery"],
      exports: "$"
    },
    "jQueryUI": {
      deps: ["jQuery"],
      init: function(){
        return $;
      }
    },
    "slickMin": {
      deps: "jQuery"
    },
    "canvas2image": {
      exports: "Canvas2Image"
    },
    "foundation": {
      exports: "Foundation"
    },
    "checkout": {
      exports: "StripeCheckout"
    },
    "ui.autocomplete": {
      deps: ["jQueryUI","angular"],
      "init": function () {
        return window.angular.module("ui.autocomplete");
      }
    },
    "hopscotch": {
      exports: "hopscotch"
    },
    "jQuery.flot": {
      deps: ["jQuery"],
      exports: "$"
    },
    "jQuery.flot.canvas": {
      deps: ["jQuery.flot"],
      exports: "$"
    },
    "jQuery.flot.legendoncanvas": {
      deps: ["jQuery.flot"],
      exports: "$"
    },
    "jQuery.flot.axislabels": {
      deps: ["jQuery.flot"],
      exports: "$"
    },
    "jQuery.flot.orderbars": {
      deps: ["jQuery.flot"],
      exports: "$"
    },
    // "jQuery.flot.symbol": {
    //   deps: ["jQuery.flot"],
    //   exports: "$"
    // },
    "loggr":{
      exports: "Loggr"
    },
    "lunr": {
        exports: "lunr"
    },
    "mobile-detect" : {
        exports: "MobileDetect"
    }
  }
});

require([
    "cali-site/ng-work/work-app",
    "angular",
    "jQueryUI"
  ],
  function (workApp, angular, jQueryUI) {
    angular.bootstrap(document.body, [workApp.name]);
  });

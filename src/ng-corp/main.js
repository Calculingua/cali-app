require.config({
  baseUrl: '../..',
  paths: {
    "cali-calcu": "./src/calcu",
    "cali-site": "./src",
    "async": "./vendor/async/lib/async",
    "jStat": "./vendor/jstat/dist/jstat",
    "numeric": "./vendor/numericjs/index",
    "marked": "./vendor/marked/lib/marked",
    "jQuery": "./vendor/jquery/dist/jquery",
    "jQuery.parse": "./vendor/jquery.parse/jquery.parse",
    "jQueryUI": "./vendor/jquery-ui/ui/jquery-ui",
    "slickMin": "//cdn.jsdelivr.net/jquery.slick/1.3.6/slick.min.js",
    "angular": "./vendor/angular/angular",
    "angular.ui.router": "./vendor/angular-ui-router/release/angular-ui-router.min.js",
    "angularCookies": "./vendor/angular-cookies/angular-cookies",
    "canvas2image": "./vendor/canvas2image/canvas2image",
    "foundation": "./vendor/foundation/js/foundation",
    "checkout": "https://checkout.stripe.com/checkout",
    "ui.autocomplete": "./vendor/ui-autocomplete/autocomplete",
    "loggr": "https://api.loggr.net/1/loggr.min.js?l=calculingua&a=0409a04625d54c55bb3d5a6a7c7a30e8",
    "hopscotch": "./vendor/hopscotch/dist/js/hopscotch",
    "jquery.cookie": "./vendor/jquery.cookie/jquery.cookie",
    "foundation.abide": "./vendor/foundation/js/foundation/foundation.abide",
    "foundation.accordion": "./vendor/foundation/js/foundation/foundation.accordion", 
    "foundation.alert": "./vendor/foundation/js/foundation/foundation.alert",
    "foundation.clearing": "./vendor/foundation/js/foundation/foundation.clearing",
    "foundation.dropdown": "./vendor/foundation/js/foundation/foundation.dropdown",
    "foundation.equalizer": "./vendor/foundation/js/foundation/foundation.equalizer",
    "foundation.interchange": "./vendor/foundation/js/foundation/foundation.interchange",
    "foundation.joyride": "./vendor/foundation/js/foundation/foundation.joyride",
    "foundation.magellan": "./vendor/foundation/js/foundation/foundation.magellan",
    "foundation.offcanvas": "./vendor/foundation/js/foundation/foundation.offcanvas",
    "foundation.orbit": "./vendor/foundation/js/foundation/foundation.orbit",
    "foundation.reveal": "./vendor/foundation/js/foundation/foundation.reveal",
    "foundation.slider": "./vendor/foundation/js/foundation/foundation.slider",
    "foundation.tab": "./vendor/foundation/js/foundation/foundation.tab",
    "foundation.toolbar": "./vendor/foundation/js/foundation/foundation.toolbar",
    "foundation.topbar": "./vendor/foundation/js/foundation/foundation.topbar",
    "mobile-detect": "./vendor/mobile-detect/mobile-detect"
  },
  shim: {
    "angular": {
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
    "jQueryUI": {
      deps: ["jQuery"],
      exports: "$"
    },
    "slickMin": {
      deps: "jQuery"
    },
    "canvas2image": {
      exports: "Canvas2Image"
    },
    "foundation": {
        deps: ['jQuery'],
        exports: "foundation"
    },
    "checkout": {
      exports: "StripeCheckout"
    },
    "ui.autocomplete": {
      deps: ['angular', "jQueryUI"],
      "init": function () {
        console.log("loading ui.autocomplete", $.parents);
        return window.angular.module("ui.autocomplete");
      }
    },
    "loggr":{
      exports: "Loggr"
    },
    "hopscotch": {
      exports: "hopscotch"
    },
    "jquery.cookie": ["jquery"],
    "foundation.abide": ["foundation"],
    "foundation.accordion": ["foundation"],
    "foundation.alert": ["foundation"],
    "foundation.clearing": ["foundation"],
    "foundation.dropdown": ["foundation"],
    "foundation.equalizer": ["foundation"],
    "foundation.interchange": ["foundation"],
    "foundation.joyride": ["foundation", "jquery.cookie"],
    "foundation.magellan": ["foundation"],
    "foundation.offcanvas": ["foundation"],
    "foundation.orbit": ["foundation"],
    "foundation.reveal": ["foundation"],
    "foundation.slider": ["foundation"],
    "foundation.tab": ["foundation"],
    "foundation.toolbar": ["foundation"],
    "foundation.topbar": ["foundation"],
    "mobile-detect" : {
        exports: "MobileDetect"
    }
  }
});

require([
  "cali-site/ng-corp/corp-app",
  "angular",
  "jQuery",
  "foundation" 
], function (corpApp, angular, $, foundation) {
    $(document).foundation();
  angular.bootstrap(document.body, [corpApp.name]);
  
  $('#myModal').foundation('reveal', 'open');
});

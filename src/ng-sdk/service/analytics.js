define([
], function () {

  var hostName = "auto";

  (function (i, s, o, g, r, a, m) {
    i.GoogleAnalyticsObject = r;
    i[r] = i[r] || function () {
      (i[r].q = i[r].q || []).push(arguments);
    }, (i[r].l = 1 * new Date());
    a = s.createElement(o);
      m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m);
  })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

  function Service($window, userData, loggr) {

    var on = true;
    if (typeof ga !== "undefined" && userData.ga) {
      console.log("ANALYTICS: using ga code:", userData.ga);
      try {
        ga('create', userData.ga, hostName);
        ga('require', 'displayfeatures');
        ga('send', 'pageview');
        console.log("ANALYTICS: started.");
      } catch (ex) {
        console.log("ANALYTICS: Error starting Google Analytics -- ", ex.toString());
        on = false;
        console.log("ANALYTICS: not started.");
      }
    } else {
      on = false;
      console.log("ANALYTICS: not started.");
    }

    this.log = function (event, action, data) {
      loggr.log(event, action, data);
      if (on) {
        ga('send', 'event', event, action, data);
      } else {
        console.log("logging: " + event + " -- " + action + ((data) ? (" == " + data) : ""));
      }

    };

    this.track = function (callback) {
      if (on) {
        if (callback) {
          ga('send', 'pageview', $window.parent.location, {'hitCallback': callback});
        } else {
          ga('send', 'pageview', $window.parent.location);
        }

        console.log("ANALYTICS: tracking:", $window.parent.location);
      }
    };
  }

  return ["$window", "UserData", "loggr", Service];


});
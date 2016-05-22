define([
], function () {

  function Service($cookies) {
    var ser = {};

    ser.avatarUrl = $cookies.avatar || null;
    ser.username = $cookies.username || null;
    ser.name = $cookies.name || null;
    ser.accountStatus = $cookies.accountStatus || null;
    ser.trialExpires = new Date($cookies.trialExpires || null);

    ser.getPrereg = function () {
      return {cnt: $cookies.cnt, url: $cookies.url};
    };

    ser.setPrereg = function (cnt, url) {
      $cookies.cnt = cnt;
      $cookies.url = url;
    };

    return ser;

  }

  return ["$cookies", Service];

});
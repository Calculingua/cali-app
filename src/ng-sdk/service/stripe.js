define([
  "checkout",
], function (StripeCheckout) {

  function Factory(userData) {

    return function (callback) {

      if (userData.stripeKey) {
        handler = StripeCheckout.configure({
          key: userData.stripeKey,
          image: '/img/cali-logo/small-yellow.png',
          token: function (token) {
            callback(token.id);
          }
        });
      } else {
        throw "Could not start because there is no publishable key.";
      }

      return handler;
    };
  }

  return ["UserData", Factory];


});
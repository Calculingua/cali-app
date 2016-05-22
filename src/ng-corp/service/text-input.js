define([
], function () {

  var minLength = 1;

  function Service() {
    out = {};

    out.transformEmail = function (email) {
      try {
        var email_regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (email_regex.test(email)) {
          return email;
        } else {
          return null;
        }
      } catch (e) {
        console.error("EXCEPTION in transformEmail : " + e.toString());
        return null;
      }


    };

    out.transformName = function (name) {
      try {
        if (name) {
          var out = name.split(" ");
          return out;
        } else {
          return null;
        }
      } catch (e) {
        console.error("EXCEPTION in transformName : " + e.toString());
        return null;
      }
    };

    out.checkPassword = function (pass1, pass2) {
      var out = true;
      if (pass1 != pass2 || pass1.length < 7) {
        out = false;
      }
      return out;
    };

    out.checkUsername = function (username) {
      // check that it exists
      if (!username) {
        return null;
      }
      // check length
      if (username.length < minLength) {
        return null;
      }
      // check whitespace
      if (username.match(/\s+/g)) {
        return null;
      }
      return username;

    };

    out.checkSize = function (text) {
      return text.length && text.length >= minLength ? true : false;
    };

    out.create = function () {
      var input = {};
      input.text = "";
      input.class = "";
      input.isValid = out.checkSize;
      input.change = function () {
        if (input.isValid(input.text)) {
          input.class = "";
        }
      };
      input.valid = function () {
        var okay = true;
        if (input.isValid(input.text)) {
          input.class = "";
        } else {
          input.class = "text-error";
          okay = false;
        }
        return okay;
      };
      return input;
    };
    return out;
  }

  return Service;



});

define(["jquery"], function (jquery) {


  function require(src, callback) {
    module = {};
    jquery.getScript(src).done(function (script, status) {
      callback(null, module.exports);
    }).fail(function (jqxhr, settings, err) {
      callback(jqxhr.statusText);
    });
  }

  return require;


});
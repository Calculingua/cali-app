define([], function () {


//formerly sdk.Runner

  function RemoteMethodRunner(objs) {
    var self = this;

    this.listener = function (args) {
      var cbId = args[0];
      var objName = args[1];
      var funcName = args[2];
      var fargs = args[3];

      var calledObj = objs;
      var objNameToks = objName.split(".");
      for (var k in objNameToks) {
        calledObj = calledObj[objNameToks[k]];
      }
      if (cbId != null) {
        fargs.push(function () {
          var args = [];
          for (var i = 0; i < arguments.length; i++) {
            args.push(arguments[i]);
          }
          self.async.send("callback", cbId, args);
        });
      }
      calledObj[funcName].apply(this, fargs);
    };

    this.bind = function (async) {
      self.async = async;
      async.on("remote", self.listener);
    };
  }

  return RemoteMethodRunner;
  
});
define([
  'require',
  'cali-calcu/RemoteMethodRunner',
  'cali-calcu/Emitter',
  "cali-calcu/extend",
    "cali-calcu/serializeDeserialize"
], function (require, RemoteMethodRunner, Emitter, extend, serializeDeserialize) {

  function isEqual(x, y) {

    var equal = true;
    if (x.length == y.length) {
      for (var i = 0; i < x.length; i++) {
        if (x[i].length == y[i].length) {
          for (var j = 0; j < x[i].length; j++) {
            if (x[i][j] != y[i][j]) {
              equal = false;
              break;
            }
          }
        } else {
          equal = false;
        }
        if (!equal) {
          break;
        }
      }
    } else {
      equal = false;
    }
    return equal;
  }
  //#237: only works if an object is no more than a data-structure.
  //such an approach is very difficult to work with in non-functinonal languages because there are no crutches that help you
  //figure out where you are using the data-structures, and in the places where you are using them, that you are exhaustively handling all possible types
  // (ie. in a functional language the compiler will tell you..)
  function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
  }

  // ## AsyncCommandParser
  // Constructor for an asynchronous command parser
  function AsyncCommandParser(variableModel, fileModel, outputService) {
    this.uber();
    var self = this;
    this.cbq = [];
    this.model = {variables: variableModel, file: fileModel};
    this.controller = outputService;
    // this.controller.output = outputService.output;
    var objs = {model: this.model, controller: this.controller};

    // this.remoteRunner = new cali.sdk.remoteMethod.Runner(objs);
    this.remoteRunner = new RemoteMethodRunner(objs);
    this.remoteRunner.bind(this);

    var scriptLocation = require.toUrl("cali-site/worker/WorkerCommandParser.js");
    this.workerScript = scriptLocation;

    // set variable callback
    this.setVariableCallback = null;

    this.on("done", function () {
      var args = arguments;
      var callback = self.cbq.shift();
      setTimeout(function () {
        callback.apply(self, args);
      }, 0);
    });
    
    this.on("ready", function(){
      variableModel.getVariables(function (err, vars) {
        self.send("set_variables", vars);
      });
    });

    this.send = function () {
        var message = {
          type: arguments[0],
            args: Array.prototype.slice.call(arguments, 1)
        };

        try {
            message = serializeDeserialize.deepSerialize(message);
        } catch (e) {
            throw new Error("command-parser: cannot serialize message before posting `" + message.type + "`. " + e.message);
        }

        try {
            self.worker.postMessage(message);
        } catch (e) {
            throw new Error("command-parser: cannot post message to worker `" + message.type + "`. " + e.message);
        }
    };

    this.handleIncomingVariables = function (variables) {

      var oldVars = clone(variableModel.variables);
      var name;

      function errorReporter(err) {
        if (err)console.error("Problem updating variable");
      }

      // do the adds and modifies
      for (name in variables) {
          var variable = serializeDeserialize.deserialize(variables[name]);
        if (typeof oldVars[name] !== "undefined") {
            //#237 objects should implement an equals method. this is a dangerous check since it relies on the clone function
           //to work correctly. the clone function makes a lot of assumptions (see above)
          if (!isEqual(oldVars[name], variable)) {
            variableModel.setVariable(name, variable, errorReporter);
          }
        } else {
          variableModel.addVariable(name, variable, errorReporter);
        }
        delete oldVars[name];
      }

      // the remaining variables are being deleted
      for (name in oldVars) {
        variableModel.deleteVariable(name, errorReporter);
      }
      // self.model.variables.variables = variables;
    };

    this.createWorker = function () {
      var worker = new Worker(self.workerScript);
      worker.addEventListener("message", self.messageHandler, false);
      worker.addEventListener("error", self.errorHandler, false);
      return worker;
    };

    this.messageHandler = function (event) {
      var type = event.data.type;
      var args = event.data.args;
      switch (type) {
        case "done":
          self.handleIncomingVariables(args[2]);
          self.emit("done", args[0], args[1]);
          break;
        case "status":
          self.emit("status", args[0]);
          break;
        case "set_variables":
          self.emit("set_variables", args[0]);
          break;
        case "callback":
        case "remote":
          self.emit(type, args);
          break;
        default:
          self.emit(type, args[0], args[1]);
          break;
      }
    };

    this.errorHandler = function (event) {
      var error = event.message;
      console.debug("errorHander : " + error);

      self.emit("done", "Exception with command", null);
      self.emit("status", "idle");
    };

    this.setVariables = function (variables, callback) {
      self.once("set_variables", callback);
      variableModel.setVariables(variables, function (err, variables) {
        self.send("set_variables", variables);
      });
    };

    this.getVariables = function (callback) {
      callback(null, variableModel.variables);
    };

    this.deleteVariable = function (name) {
      variableModel.deleteVariable(name, function (error, variables) {
        self.setVariables(variableModel.variables, function (variables) {
          self.emit("variable", "delete", {
            name: name
          });
        });
      });
    };

    this.stop = function () {
      self.stopWorker();
      self.emit("status", "stopped");
      self.removeAllListeners();
    };

    this.stopWorker = function () {
      if (self.worker)
        self.worker.terminate();
    };

    this.evaluate = function (cmd, callback) {
      self.cbq.push(callback);
      self.send("evaluate", cmd);
    };

    this.cancelEvaluation = function (reason) {
      self.emit("status", "canceling");
      self.stopWorker();
      self.worker = self.createWorker();

      function statusCallback(status) {

        function setVariableCallback(error) {
          self.emit("done", "Evaluation canceled due to : " + reason, null);
        }

        if (status == "idle") {
          self.setVariables(variableModel.variables, setVariableCallback);
        }
      }

      self.once("status", statusCallback);
    };

    this.init = function () {
      // create the web worker using the class method
      self.worker = self.createWorker();
    };

    // this.worker = this.createWorker();
  }

  extend.call(AsyncCommandParser,Emitter);

  function Factory(variableModel, fileModel, outputService) {
    var service = new AsyncCommandParser(variableModel, fileModel, outputService);
    service.init();
    return service;
  }

  return ["VariableModel", "FileModel", "OutputService", Factory];

});
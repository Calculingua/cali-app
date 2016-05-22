importScripts("../../vendor/requirejs/require.js");
if (self && !self.jQuery) {
    jQuery = {};
    $ = jQuery;
}
require.config({
    baseUrl: "../..",
    paths: {
        "cali-calcu": "./src/calcu",
        "async": "./vendor/async/lib/async",
        "jStat": "./vendor/jstat/dist/jstat",
        "numeric": "./vendor/numericjs/index",
        "jQuery.parse": "./vendor/jquery.parse/jquery.parse"
    },
    shim: {
        "async": {
            exports: "async"
        },
        "numeric": {
            exports: "numeric"
        },
        "jStat": {
            exports: "jStat"
        },
        "jQuery.parse": {
            exports: "$"
        }
    },
    catchError: true
});

require([
    "cali-calcu/serializeDeserialize",
    "cali-calcu/RemoteMethodFactory",
    "cali-calcu/Emitter",
    "cali-calcu/extend",
    "cali-calcu/CommandParser",
    "cali-calcu/util"
], function (serializeDeserialize, RemoteMethodFactory, Emitter, extend, CommandParser) {


    // ## WorkerCommandParser
    // Class that performs asynchronous command parsing and math. The control is
    // the `self` object from the Web Worker environment

    function WorkerCommandParser(control) {
        this.uber();
        var self = this;
        // this is the `self` object from the environment
        this.control = control;

        // create the async models bound to the master
        var remoteFactory = new RemoteMethodFactory();
        remoteFactory.bind(this);
        var opt = null;
        var model = this.createModel(remoteFactory);
        var controller = this.createController(remoteFactory);
        var view = this.createView(remoteFactory);

        // the synchronous command parser
        this.parser = new CommandParser(opt, model, controller, view);

        this.parser.on("command", function (arg) {
            self.send("command", arg);
        });

        this.parser.on("result", function (arg, print) {
            self.send("result", arg, print);
        });

        this.parser.on("comment", function (arg) {
            self.send("comment", arg);
        });

        // register the message handler
        this.control.onmessage = function (event) {
            var type = event.data.type;
            var args = event.data.args;
            // emit the event for other listeners.
            self.emit(type, args);

            switch (type) {
                case "evaluate":
                    self.evaluate(args[0]);
                    break;
                case "ping":
                    self.ping();
                    break;
                case "set_variables":
                    self.setVariables(args[0]);
                    break;
            }
        };

        // send an idle status on the next event loop
        setTimeout(function () {
            self.send("status", "idle");
            self.send("ready");
        }, 0);
    }

    extend.call(WorkerCommandParser, Emitter);

    WorkerCommandParser.prototype.createModel = function (remoteFactory) {
        var model = {};
        model.file = remoteFactory.create("model.file", [
            "get", "readFile", "readDir", "newFile", "newFolder", "saveFile", "unlink", "move"
        ]);

        return model;
    };

    WorkerCommandParser.prototype.createController = function (remoteFactory) {
        var controller = {};
        controller.output = remoteFactory.create("controller.output", [
            "createPlot", "editPlot"
        ]);

        return controller;
    };

    WorkerCommandParser.prototype.createView = function (remoteFactory) {
        return {};
    };

    // ## send()
    // Emits events to the parent
    WorkerCommandParser.prototype.send = function () {
        var message = {
            type: arguments[0],
            args: Array.prototype.slice.call(arguments, 1)
        };

        try {
            message = serializeDeserialize.deepSerialize(message);
        } catch (e) {
            throw new Error("Cannot serialize the object for transfer over worker: " + e.message);
        }

        try {
            postMessage(message);
        } catch (e) {
            throw new Error("Worker cannot post message of type `" + message.type + "`. " + e.message);
        }

    };


    // ## evaluate()
    // Evaluates the input command and sends the `done` object when completed.
    WorkerCommandParser.prototype.evaluate = function (cmd) {
        var self = this;
        this.send("status", "busy");
        var ans = null;
        var vars = null;

        // try to evaluate the expression
        try {
            this.parser.evaluate(cmd, function (err, ans) {
                err = err || null;
                if (err) self.send("exception", err.toString());
                vars = self.parser.getVariables();
                self.send("done", err, ans, vars);
                self.send("status", "idle");
            });
        }
            // catch exceptions and set error
        catch (err) {
            self.send("exception", err.toString());
            vars = self.parser.getVariables();

            self.send("done", err, ans, vars);
            self.send("status", "idle");
        }
    };

    // ## setVariables()
    // Allows for setting the variables in the command parser
    WorkerCommandParser.prototype.setVariables = function (variables) {
        this.parser.setVariables(variables);
        this.send("set_variables", null);
    };


    new WorkerCommandParser(self);

});
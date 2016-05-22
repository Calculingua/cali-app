define([
  "cali-calcu/Emitter",
  "$J"
], function (Emitter, $J) {

  $J.describe("A class that emitts events", function() {

    $J.it("should allow for instanteation", function() {
      var emitter = new Emitter();
      $J.expect(emitter).toBeTruthy();
    });

    $J.describe("that is instanteated", function() {

      var emitter = null;
      beforeEach(function() {
        emitter = new Emitter();
      });

      afterEach(function() {
        emitter = null;
      });

      it("should have an `emit` method", function() {
        expect(emitter.emit).toBeTruthy();
      });

      it("should have an `addListener` method", function() {
        expect(emitter.addListener).toBeTruthy();
      });

      it("should have an `on` method", function() {
        expect(emitter.on).toBeTruthy();
      });

      it("should have a `removeListener` method", function() {
        expect(emitter.removeListener).toBeTruthy();
      });

      it("should have an `once` method", function() {
        expect(emitter.once).toBeTruthy();
      });

      $J.describe("and has a listener added with `addListener`", function() {
        emitter = null;
        var flag = null;
        var args = null;
        function callback() {
          flag = true;
          args = arguments;
        }
        beforeEach(function() {
          flag = null;
          args = null;
          emitter = new Emitter();
          emitter.addListener("event", callback);
        });

        afterEach(function() {
          emitter = null;
        });


      });

      $J.describe("that takes a listener added with `once`", function() {
        emitter = null;

        beforeEach(function() {
          emitter = new Emitter();

        });

        afterEach(function() {
          emitter = null;
        });

      });

      $J.describe("and is robust to additions during callbacks", function() {
        emitter = null;

        $J.beforeEach(function() {
          emitter = new Emitter();
        });

        $J.afterEach(function() {
          emitter = null;
        });

      });

      $J.describe("and is robust to exceptions", function() {
        emitter = null;

        $J.beforeEach(function() {
          emitter = new Emitter();
        });

        $J.afterEach(function() {
          emitter = null;
        });


      });

      $J.describe("with a `removeAllListeners` method", function() {

        var emitter = null;

        $J.beforeEach(function() {
          emitter = new Emitter();
        });

        $J.afterEach(function() {
          emitter = null;
        });

        $J.it("should have a `removeAllListeners` method", function() {
          $J.expect(emitter.removeAllListeners).toBeTruthy();
        });

        $J.it("should have no listeners after a call", function() {
          emitter.on("test1", function() {

          });
          emitter.on("test2", function() {

          });
          emitter.on("test2", function() {

          });

          emitter.removeAllListeners();

          var listeners = [];
          for ( var i in emitter.listeners) {
            listeners.push(emitter.listeners[i]);
          }

          $J.expect(listeners.length).toEqual(0);
        });

        $J.it("should have no singleListener after a call", function() {
          emitter.once("test1", function() {

          });
          emitter.once("test2", function() {

          });
          emitter.once("test2", function() {

          });

          emitter.removeAllListeners();

          var listeners = [];
          for ( var i in emitter.singleListener) {
            listeners.push(emitter.singleListener[i]);
          }

          $J.expect(listeners.length).toEqual(0);
        });

        $J.it("should clear all listeners from a single event type", function() {
          emitter.once("test1", function() {

          });
          emitter.once("test2", function() {

          });
          emitter.on("test2", function() {

          });

          emitter.removeAllListeners("test2");

          var listeners = [];
          for ( var i in emitter.singleListener) {
            listeners.push(emitter.singleListener[i]);
          }
          for (i in emitter.listeners) {
            listeners.push(emitter.listeners[i]);
          }

          $J.expect(listeners.length).toEqual(1);
          $J.expect(emitter.listeners["test2"]).toBeFalsy();
          $J.expect(emitter.singleListener["test2"]).toBeFalsy();
        });

      });
    });
  });



});
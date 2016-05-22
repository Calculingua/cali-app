define([
  "$J",
  "./dev/AsyncMock",
  "cali-calcu/RemoteMethodFactory",
  "sinon"
], function ($J, AsyncMock, RemoteMethodFactory, sinon) {


  $J.describe("RemoteMethodFactory", function () {

    var async = null;
    var factory = null;

    $J.beforeEach(function () {
      async = new AsyncMock();
    });

    $J.it("should be an object in the namespace `cali.remoteMethod`", function () {
      $J.expect(RemoteMethodFactory).toBeTruthy();
    });

    $J.describe("new RemoteMethodFactory()", function () {

      $J.it("should be created with the `new` operator", function () {
        $J.expect(new RemoteMethodFactory()).toBeTruthy();
      });

      $J.it("should contain `listener` method", function () {
        $J.expect((new RemoteMethodFactory()).listener).toBeTruthy();
      })
    });

    $J.describe("#bind(async)", function () {

      $J.beforeEach(function () {
        factory = new RemoteMethodFactory(async);
      });

      $J.it("should exist", function () {
        $J.expect(factory.bind).toBeTruthy();
      });

      $J.it("should bind `listener` to `async` `callback` event", function () {
        var spy = sinon.spy(async, "on");
        $J.expect(spy.callCount).toEqual(0);
        factory.bind(async);
        $J.expect(spy.callCount).toEqual(1);
        $J.expect(spy.getCall(0).args[0]).toEqual("callback");
        $J.expect(spy.getCall(0).args[1]).toEqual(factory.listener);
      });
    });

    $J.describe("#create(name, methodList)", function () {
      $J.beforeEach(function () {
        factory = new RemoteMethodFactory(async);
        factory.bind(async);
      });

      $J.it("should exist", function () {
        $J.expect(factory.create).toBeTruthy();
      });

      $J.it("should return object with specified methods", function () {
        var model = factory.create("model", ["getIt", "setIt"]);

        $J.expect(model.getIt).toBeTruthy();
        $J.expect(model.setIt).toBeTruthy();
      });

      $J.describe("when using the return object to execute a function", function () {
        var model = {};
        $J.beforeEach(function () {
          model.data = factory.create("model.data", ["getIt", "setIt"]);
        });

        $J.describe("without a callback specified", function () {
          $J.it("should call `async.send('remote', null, 'obj', 'func', args)`", function () {
            sinon.spy(async, "send");
            model.data.setIt(4);
            $J.expect(async.send.callCount).toEqual(1);
            $J.expect(async.send.getCall(0).args[0]).toEqual("remote");
            $J.expect(async.send.getCall(0).args[1]).toEqual(null);
            $J.expect(async.send.getCall(0).args[2]).toEqual("model.data");
            $J.expect(async.send.getCall(0).args[3]).toEqual("setIt");
            $J.expect(async.send.getCall(0).args[4]).toEqual([4]);
          });
        });

        $J.describe("with a callback specified", function () {
          $J.it("should call `async.send('remote', callbackId, 'obj', 'func', args)", function () {
            sinon.spy(async, "send");
            model.data.setIt(4, function () {
            });
            $J.expect(async.send.callCount).toEqual(1);
            $J.expect(async.send.getCall(0).args[0]).toEqual("remote");
            $J.expect(async.send.getCall(0).args[1]).toBeTruthy();
            $J.expect(async.send.getCall(0).args[2]).toEqual("model.data");
            $J.expect(async.send.getCall(0).args[3]).toEqual("setIt");
            $J.expect(async.send.getCall(0).args[4]).toEqual([4]);
          });

          $J.it("should update the callbackId with each method call", function () {
            sinon.spy(async, "send");

            model.data.setIt(4, function () {
            });
            model.data.setIt(5, function () {
            });
            model.data.getIt(function () {
            });

            $J.expect(async.send.callCount).toEqual(3);
            $J.expect(async.send.getCall(0).args[1]).toBeTruthy();
            $J.expect(async.send.getCall(1).args[1]).toBeTruthy();
            $J.expect(async.send.getCall(2).args[1]).toBeTruthy();
            $J.expect(async.send.getCall(0).args[1] !== async.send.getCall(1).args[1] && async.send.getCall(1).args[1] !== async.send.getCall(2).args[1] && async.send.getCall(0).args[1] !== async.send.getCall(2).args[1]).toBeTruthy();
            $J.expect(async.send.getCall(0).args[4]).toEqual([4]);
            $J.expect(async.send.getCall(1).args[4]).toEqual([5]);
            $J.expect(async.send.getCall(2).args[4]).toEqual([]);
          })
        });
      });
    });

    $J.describe("#listener(args)", function () {
      $J.beforeEach(function () {
        factory = new RemoteMethodFactory(async);
        factory.bind(async);
      });

      $J.it("should exist", function () {
        $J.expect(factory.listener).toBeTruthy();
      });

      $J.describe("uses first args as callbackId and applies function with remaining args", function () {
        var model = {};
        $J.beforeEach(function () {
          model.data = factory.create("model.data", ["getIt", "setIt"]);
          sinon.spy(async, "send");
        });

        $J.describe("with 1 function previously called", function () {
          var spy = null;
          var cbId = null;
          $J.beforeEach(function () {
            spy = sinon.spy();
            model.data.setIt(4, spy);
            cbId = async.send.getCall(0).args[1];
          });

          $J.it("should call the callback", function () {
            factory.listener([cbId, [null, 88]]);
            $J.expect(spy.callCount).toEqual(1);
            $J.expect(spy.getCall(0).args[0]).toEqual(null);
            $J.expect(spy.getCall(0).args[1]).toEqual(88);
          })
        });

        $J.describe("with multiple calles to the same function", function () {
          var spies = [];
          var cbIds = [];
          $J.beforeEach(function () {
            for (var i = 0; i < 3; i++) {
              var spy = sinon.spy();
              model.data.setIt(4, spy);
              spies.push(spy);
              cbIds.push(async.send.getCall(i).args[1])
            }
          });

          $J.it("should call the callbacks when done in order", function () {

            for (var i = 0; i < 3; i++) {
              factory.listener([cbIds[i], [null, i]]);
              $J.expect(spies[i].callCount).toEqual(1);
              $J.expect(spies[i].getCall(0).args[0]).toEqual(null);
              $J.expect(spies[i].getCall(0).args[1]).toEqual(i);
            }
          });

          $J.it("should call the callbacks when done out of order", function () {

            var call = [2, 0, 1];
            for (var k in call) {
              var i = call[k];
              factory.listener([cbIds[i], [null, i]]);
              $J.expect(spies[i].callCount).toEqual(1);
              $J.expect(spies[i].getCall(0).args[0]).toEqual(null);
              $J.expect(spies[i].getCall(0).args[1]).toEqual(i);
            }
          });
        });
      })

    });
  });

});

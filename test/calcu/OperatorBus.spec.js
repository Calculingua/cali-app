define([
  "$J",
  "cali-calcu/base/baseFunctions",
  "cali-calcu/base/ones",
  "cali-calcu/CommandParser",
  "cali-calcu/OperatorBus",
  "sinon"
], function ($J, baseFunctions, ones, CommandParser, OperatorBus, sinon) {


  $J.describe("cali.calcu.OperatorBus", function () {

    var bus, parser;
    $J.beforeEach(function () {
      var model = {
        file: {
          readDir: function () {
          },
          readFile: function () {
          }
        }
      };
      parser = new CommandParser({}, model);
      bus = new OperatorBus(parser);
    });

    $J.it("should exist", function () {
      $J.expect(typeof OperatorBus).toEqual("function");
    });

    $J.describe("#getFunction(name)", function () {

      $J.it("should be a function", function () {
        $J.expect(typeof bus.getFunction).toEqual("function");
      });

      $J.describe("when a module is already loaded", function () {
        $J.beforeEach(function () {
          bus.addModule(baseFunctions);
        });

        $J.it("should return those functions", function () {
          bus.getFunction("ones", function (err, func) {
            $J.expect(func).toEqual(ones);
          })
        });
      });

      $J.describe("when a function has not previously been loaded", function () {
        $J.beforeEach(function () {
          sinon.stub(parser.model.file, "readDir", function (path, callback) {
            var out = [
              {
                isFile: true,
                isFolder: false,
                name: "foo0.m",
                path: "/foo0.m"
              },
              {
                isFile: false,
                isFolder: true,
                name: "foo1.m",
                path: "/foo1.m"
              }
            ];
            callback(null, out);
          });

          sinon.stub(parser.model.file, "readFile", function (path, callback) {
            var out = "function x = foo0(y)\n x = 1; \n end";
            if (path == "/foo0.m")
              callback(null, out);
            else
              callback(null, null);
          });

        });

        $J.afterEach(function () {

        });

        $J.it("should look in the present working directory for a file of the same name", function (done) {
          bus.getFunction("foo0", function (err, func) {
            $J.expect(parser.model.file.readDir.callCount).toEqual(1);
            done();
          });
        });

        $J.describe("when there is a file with the same name", function () {
          $J.it("should get the file", function (done) {
            bus.getFunction("foo0", function (err, func) {
              $J.expect(parser.model.file.readDir.getCall(0).args[0]).toEqual("");
              $J.expect(parser.model.file.readFile.getCall(0).args[0]).toEqual("/foo0.m");
              done();
            });
          });

          $J.it("should compile the function and return the execute function", function (done) {
            bus.getFunction("foo0", function (err, func) {
              $J.expect(typeof func).toEqual("function");
              done();
            });
          });

          $J.it("should store the absolute path in `localFuncPaths`", function (done) {
            bus.getFunction("foo0", function (err, func) {
              $J.expect(bus.localFuncPaths["foo0"]).toEqual("/foo0.m");
              done();
            });
          });

          $J.describe("after it has already been called once", function () {
            $J.beforeEach(function (done) {
              bus.getFunction("foo0", function (err, func) {
                parser.model.file.readDir.reset();
                parser.model.file.readFile.reset();
                done();
              });
            });

            $J.it("should read directly from file without accessing folders", function (done) {
              bus.getFunction("foo0", function (err, func) {
                $J.expect(parser.model.file.readDir.callCount).toEqual(0);
                $J.expect(parser.model.file.readFile.callCount).toEqual(1);
                $J.expect(parser.model.file.readFile.getCall(0).args[0]).toEqual("/foo0.m");
                done();
              });
            });

            $J.it("should rebuild it and return it", function (done) {
              bus.getFunction("foo0", function (err, func) {
                $J.expect(typeof func).toEqual("function");
                done();
              });
            })
          });
        });

        $J.describe("when there is a folder with the same name", function () {
          $J.it("should return null", function (done) {
            bus.getFunction("foo1", function (err, func) {
              $J.expect(parser.model.file.readDir.getCall(0).args[0]).toEqual("");
              $J.expect(parser.model.file.readFile.callCount).toEqual(0);
              $J.expect(func).not.toBeDefined();
              done();
            });
          });
        });

        $J.describe("when there is nothing with the same name", function () {
          $J.it("should return null", function (done) {
            bus.getFunction("foo2", function (err, func) {
              $J.expect(parser.model.file.readDir.getCall(0).args[0]).toEqual("");
              $J.expect(parser.model.file.readFile.callCount).toEqual(0);
              $J.expect(func).not.toBeDefined();
              done();
            });
          });
        });
      });
    });
  });

});

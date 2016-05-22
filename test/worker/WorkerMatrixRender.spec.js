// # Worker Matrix Render
// Spec for the worker.
// 
// Author : [William Burke](mailto:wburke@calculingua.com)
// Date : 12/3/2012

describe("WorkerMatrixRender", function() {

	describe("new Worker(\"src/WorkerMatrixRender.js\")", function() {

		it("should create a workder", function() {
			var worker = new Worker("src/WorkerMatrixRender.js");
			expect(worker).toBeTruthy();
			worker.terminate();
		});
	});

	describe("#postMessage({type, args})", function() {
		var worker = null;

		beforeEach(function() {
			var done = false;
			runs(function() {
				worker = new Worker("src/WorkerMatrixRender.js");
				worker.addEventListener("message", function(e) {
					if (e.data.type == "status" && e.data.args[0] == "idle") {
						done = true;
					}
				});
				waitsFor(function() {
					return done;
				}, "idle status after loading", 1000);
			});

		});

		afterEach(function() {
			worker.terminate();
		});
		

		it("should send a message with status busy after sending a `render` message", function() {
			var data = {
				name : "x",
				ans : [ [ 3 ] ]
			};
			var msg = {
				type : "render",
				args : [ data ]
			};
			var event = [];
			var cnt = 0;
			runs(function() {
				worker.addEventListener("message", function(e) {
					event.push(e.data);
					cnt++;
				});
				worker.postMessage(msg);
			});

			waitsFor(function() {
				return (cnt >= 1);
			}, "listener to be called twice", 1000);

			runs(function() {
				expect(event[0]).toEqual({
					type : "status",
					args : [ "busy" ]
				});
			});
		});

		it("should send a message with type equal to `result` after sending a `render` message", function() {
			var data = {
				name : "x",
				ans : [ [ 3 ] ]
			};
			var msg = {
				type : "render",
				args : [ data ]
			};
			var event = [];
			var cnt = 0;
			runs(function() {
				worker.addEventListener("message", function(e) {
					event.push(e.data);
					cnt++;
				});
				worker.postMessage(msg);
			});

			waitsFor(function() {
				return (cnt >= 2);
			}, "listener to be called twice", 1000);

			runs(function() {
				expect(event[1].type).toEqual("result");
				// console.log("result = " + event[1].args[0]);
			});
		});

		it("should send a message with status idle after sending a `render` message", function() {
			var data = {
				name : "x",
				ans : [ [ 3 ] ]
			};
			var msg = {
				type : "render",
				args : [ data ]
			};
			var event = [];
			var cnt = 0;
			runs(function() {
				worker.addEventListener("message", function(e) {
					event.push(e.data);
					cnt++;
				});
				worker.postMessage(msg);
			});

			waitsFor(function() {
				return (cnt >= 3);
			}, "listener to be called twice", 1000);

			runs(function() {
				expect(event[2]).toEqual({
					type : "status",
					args : [ "idle" ]
				});
			});
		});

	});

});
define([
  "require",
  "$J"
], function (require,$J) {



  $J.describe("WorkerCommandParser", function () {
    var workerScript = require.toUrl("cali-site/worker/WorkerCommandParser.js");



    $J.it("should be worker", function(){
      worker = new Worker(workerScript);
      $J.expect(typeof worker.postMessage).toEqual("function");
    });

  });

});
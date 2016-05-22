define([
  "$J",
  "cali-calcu/CommandParser",
  "cali-calcu/base/baseFunctions"
], function ($J, CommandParser, base) {

  $J.describe("cali.module.base.help()", function () {

    // setup the environment
    var parser = null;
    var isEqual = null;
    $J.beforeEach(function () {
      parser = new CommandParser();
      help = base.help;
    });

    $J.describe("prints help messages", function () {

      $J.it("should print a basic help message with parens", function () {
        var input = "help()";
        parser.evaluate(input, function (err, ans) {
          $J.expect(ans[0].text).toBeTruthy();
        });
      });

      $J.it("should print a specific help message", function () {
        var input = "help eye";
        parser.evaluate(input, function (err, ans) {
          $J.expect(ans[0].text).toBeTruthy();
        });
      });
      
      $J.describe("help", function(){
          $J.it("should print all commands in alpha order", function () {
            var input = "help";
            parser.evaluate(input, function (err, ans) {
              $J.expect(ans[0].text).toBeTruthy();
              var lines = ans[0].text.split(/\n+/g)
              for(var i = 1; i < lines.length; i++){
                  var cmd0 = lines[i-1].split(" ")[0];
                  var cmd1 = lines[i].split(" ")[0];
                  if(cmd0 > cmd1){
                      console.log("i:", i, "cmd0:", cmd0, "cmd1:", cmd1);
                  }
                  $J.expect(cmd0 <= cmd1).toBeTruthy();
              }
            });
          });
      });
    });
  });
});
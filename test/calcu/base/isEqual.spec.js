define([
  "$J",
  "cali-calcu/CommandParser",
  "../dev/Matchers",
  "cali-calcu/base/isEqual"
], function ($J, CommandParser, Matchers, isEqual) {

  $J.describe("isEqual", function () {

    // setup the environment
    var parser = null;
    beforeEach(function () {
      parser = new CommandParser();
    });

    $J.describe("checks if the two arrays are equal", function () {

      describe("and returns true when equal", function () {

        it("should work with equal martrix", function () {
          var x = [
            [ 1, 0 ],
            [ 0, 1 ]
          ];
          var y = [
            [ 1, 0 ],
            [ 0, 1 ]
          ];
          var out = isEqual(x, y);
          expect(out).toEqual(true);
        });
      });

      describe("and returns false when not equal", function () {

        it("should work with martrix", function () {
          var x = [
            [ 1, 0 ],
            [ 0, 2 ]
          ];
          var y = [
            [ 1, 0 ],
            [ 0, 1 ]
          ];
          var out = isEqual(x, y);
          expect(out).toEqual(false);
        });

        it("should work with unequal size martrix", function () {
          var x = [
            [ 1, 0 ],
            [ 0, 1 ],
            [ 2, 3 ]
          ];
          var y = [
            [ 1, 0 ],
            [ 0, 1 ]
          ];
          var out = isEqual(x, y);
          expect(out).toEqual(false);
        });

        it("should work with unequal size martrix", function () {
          var x = [
            [ 1, 0 ],
            [ 0, 1 ]
          ];
          var y = [
            [ 1, 0, 0 ],
            [ 0, 1, 0]
          ];
          var out = isEqual(x, y);
          expect(out).toEqual(false);
        });

      });

    });
  });
});
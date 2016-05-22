define([
], function () {

  var ENTER = 13;
  var UP = 38;
  var DOWN = 40;

  function factory(key, attr) {

    var directive = function () {
      return function (scope, element, attrs) {
        element.bind("keydown", function (event) {
          if (event.which === key) {
            scope.$apply(function () {
              scope.$eval(attrs[attr]);
            });

            event.preventDefault();
          }
        });
      };
    };

    return directive;
  }

  return {
    "ngEnter": factory(ENTER, 'ngEnter'),
    "ngKeyUp": factory(UP, 'ngKeyUp'),
    "ngKeyDown": factory(DOWN, 'ngKeyDown')
  };

});
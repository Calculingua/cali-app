define([], function () {

    "use strict";

    function mixinSourceIntoDestination(destination,source) {
        for (var i in source) {
            if (source.hasOwnProperty(i)) {
                destination[i] = source[i];
            }
        }
        return destination;
    }

    function mixin(destination) {
        var sources = Array.prototype.slice.call(arguments, 1);
        return sources.reduce(mixinSourceIntoDestination, destination);
    }

    return function (prototype) {

        var mixins = (arguments.length > 1) ? [Object.create(prototype)].concat(Array.prototype.slice.call(arguments, 1)) :
                     [{},prototype];

        var proto;
        try {
            proto = mixin.apply(null, mixins);
            proto.constructor.prototype = proto;//ensure 2-way binding (so an object's constructor and that constructor's prototype match)
        } catch (e) {
            console.error("typeExtend: Cannot make constructor function and prototype with ", arguments);
            throw e;
        }
        return proto.constructor;
    };

});
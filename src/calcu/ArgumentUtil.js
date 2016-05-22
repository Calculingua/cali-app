define([], function () {


    function Arguments(index, signature, argumentValues) {
        this.index = index;
        this.signature = signature;
        this._argumentValues = argumentValues;
    }

    Arguments.prototype.getArgument = function (parameterName) {
        var i;
        for (i = 0; this._argumentValues; i += 1) {
            if (this.signature[i].name === parameterName) {
                return this._argumentValues[i];
            }
        }
        throw new Error("Could not find parameter with name `" + parameterName + "`");
    };

    function isMatch(argumentArray, signature) {

        if (signature.length > argumentArray.length) {
            return false;
        }

        var i;
        for (i = 0; i < signature.length; i += 1) {
            if (typeof signature[i].type === "string" && typeof argumentArray[i] !== signature[i].type) {
                return false;
            }
            if (typeof signature[i].test === "function" && !signature[i].test(argumentArray[i])) {
                return false;
            }
        }
        return true;
    }


    return {
        /**
         * A function
         * @param argumentArray the arguments to be parsed
         * @param ..varargs.. 1 or more function signatures. A function signature is an object with following members:
         * <ul>
         *     <li>name: the name of the parameter</li>
         *     <li>type: a javascript type ("number", "string", ...) of the parameter (optional)</li>
         *     <li>test: a predicate function that validates the parameter value (optional)</li>
         * </ul>
         */
        parseArguments: function () {

            if (arguments.length < 2) {
                throw new Error("Should pass in arguments with at least a single signature");
            }

            var argumentArray = arguments[0];
            var signatures = Array.prototype.slice.call(arguments, 1);

            var i;
            var matches = [];
            for (i = 0; i < signatures.length; i += 1) {
                if (isMatch(argumentArray, signatures[i])) {
                    matches.push(new Arguments(i, signatures[i], argumentArray));
                }
            }

            if (matches.length === 0) {
                throw new Error("Could not pass arguments against any of the signatures");
            }

            var bestMatch = matches[0];
            for (i = 1; i < matches.length; i += 1) {//prefer matches that are more closely specified than matches that are not
                if (matches[i].signature.length > bestMatch.signature.length) {
                    bestMatch = matches[i];
                }
            }


            return bestMatch;

        }
    };


});
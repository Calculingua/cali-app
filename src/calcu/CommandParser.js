define([
    "./serializeDeserialize",
    "./base/baseFunctions",
    "./Emitter",
    "./extend",
    "./interpreter/mBasic/CellArray",
    "./interpreter/mBasic/For",
    "./interpreter/mBasic/Function",
    "./interpreter/mBasic/If",
    "./interpreter/mBasic/Matrix",
    "./interpreter/mBasic/Script",
    "./interpreter/mBasic/String",
    "./interpreter/mBasic/Switch",
    "./interpreter/mBasic/While",
    "./interpreter/mNative/nativeFunctions",
    "./interpreter/mStatic/Backslash",
    "./interpreter/mStatic/CellAccess",
    "./interpreter/mStatic/Colon",
    "./interpreter/mStatic/Divide",
    "./interpreter/mStatic/elementwiseDivide",
    "./interpreter/mStatic/elementwiseMultiply",
    "./interpreter/mStatic/elementwisePow",
    "./interpreter/mStatic/InnerExpression",
    "./interpreter/mStatic/LogicalAnd",
    "./interpreter/mStatic/LogicalOr",
    "./interpreter/mStatic/Minus",
    "./interpreter/mStatic/Multiply",
    "./interpreter/mStatic/Plus",
    "./interpreter/mStatic/Relational",
    "./interpreter/mStatic/Transpose",
    "./interpreter/OperatorFactory",
    "./OperatorBus"
], function (serializeDeserialize, baseFunctions, Emitter, extend, CellArray, For, Function, If, Matrix, Script, String, Switch, While, nativeFunctions, Backslash, CellAccess, Colon, Divide, ElementwiseDivide, ElementwiseMultiply, ElementwisePow, InnerExpression, LogicalAnd, LogicalOr, Minus, Multiply, Plus, Relational, Transpose, operatorFactory, OperatorBus) {

    function CommandParser(opt, model, controller, view) {
        this.uber();
        var self = this;

        // create an operator bus and add the basic operators
        this.operators = new OperatorBus(this);
        this.operators.addStatic(operatorFactory(/^:/, Colon));
        this.operators.addStatic(operatorFactory(/^\[/, Matrix));
        this.operators.addStatic(operatorFactory(/^\'.*?\'/, String));
        this.operators.addStatic(operatorFactory(/^'/, Transpose));
        this.operators.addStatic(operatorFactory(/^\*/, Multiply));
        this.operators.addStatic(operatorFactory(/^\//, Divide));
        this.operators.addStatic(operatorFactory(/^\\/, Backslash));
        this.operators.addStatic(operatorFactory(/^\+/, Plus));
        this.operators.addStatic(operatorFactory(/^\-/, Minus));
        this.operators.addStatic(operatorFactory(/^\(/, InnerExpression));
        this.operators.addStatic(operatorFactory(/^\{/, CellArray));
        this.operators.addStatic(operatorFactory(/^\.\*/, ElementwiseMultiply));
        this.operators.addStatic(operatorFactory(/^\.\//, ElementwiseDivide));
        this.operators.addStatic(operatorFactory(/^\.\^/, ElementwisePow));
        this.operators.addStatic(operatorFactory(/^={2}/, Relational));
        this.operators.addStatic(operatorFactory(/^>/, Relational));
        this.operators.addStatic(operatorFactory(/^</, Relational));
        this.operators.addStatic(operatorFactory(/^(<=)/, Relational));
        this.operators.addStatic(operatorFactory(/^(>=)/, Relational));
        this.operators.addStatic(operatorFactory(/^(~=)/, Relational));
        this.operators.addStatic(operatorFactory(/^&{2}/, LogicalAnd));
        this.operators.addStatic(operatorFactory(/^(\|\|)/, LogicalOr));
        this.operators.addStatic(operatorFactory(/^(if)/, If));
        this.operators.addStatic(operatorFactory(/^(for)/, For));
        this.operators.addStatic(operatorFactory(/^(while)/, While));
        this.operators.addStatic(operatorFactory(/^(switch)/, Switch));
        this.operators.addStatic(operatorFactory(/^(function)/, Function));

        this.operators.addStatic(operatorFactory(/^((^([A-z_][\w]*)(\s*)\{))/, CellAccess));

        this.operators.addModule(nativeFunctions);
        this.operators.addModule(baseFunctions);

        // create the initial load of variables
        this.output = [];
        this.variables = {};
        this.funcList = {};
        this.model = model;
        this.controller = controller;
        this.view = view;
        this.outputCallback = function (type, data, print) {
            switch (type) {
                case "lines":
                    if (self.lines) {
                        var lineArray = [];
                        for (var i = data.start; i < data.start + data.length; i++) {
                            if (!self.lines[i].match(/^(\s*)%/)) {
                                lineArray.push(self.lines[i]);
                            }
                        }
                        if (lineArray.length > 0) {
                            var lines = lineArray.join("\n");
                            self.emit("command", lines);
                        }
                    }
                    break;
                case "result":
                    self.emit(type, data, print);
                    self.output.push(data);
                    break;
                default:
                    self.emit(type, data, print);
                    break;
            }
        };
    }

    extend.call(CommandParser, Emitter);

    CommandParser.prototype.addVariable = function (name, value) {
        this.variables[name] = value;
    };

    // ## getVariables
    // Returns the object containing all of the variables.
    CommandParser.prototype.getVariables = function () {
        return this.variables;
    };

    CommandParser.prototype.setVariables = function (variables) {
        this.variables = {};
        for (var key in variables) {
            if (variables.hasOwnProperty(key)) {
                try {
                    this.variables[key] = serializeDeserialize.deserialize(variables[key]);
                } catch (e) {
                    throw new Error("Cannot set variables. Cannot deserialize " + key + ". " + e.message);
                }
            }
        }


    };

    // ## trim()
    // Trims multiple white space chars, leaving only a single space
    CommandParser.prototype.trim = function (input) {
        return input.replace(/\s+/g, " ");
    };

    CommandParser.prototype.maxLoops = 1000;
    CommandParser.prototype.tokenize = function (input, line) {
        var out = [];
        var k = 0;
        var i = 0;
        var loop = 0;
        var num, old = " ";
        while (input.length > 0) {
            // test if it is a reserved character
            if (input.match(this.operators.commentRegexp)) {
                num = input.match(this.operators.commentRegexp)[0];
                out[k] = {
                    token: num,
                    index: i,
                    line: line
                };
                i += num.length;
                old = input.substring(0, num.length);
                input = input.substring(num.length);
                k++;
            }
            // it it's a string
            // else if ((old + input).match(/^\'.*?\'/)) {
            else if ((old.slice(-1) + input).match(/^[\s,={[(]=*\'.*?\'/)) {
                var str = input.match(/^\'.*?\'/)[0];
                out[k] = {
                    token: str,
                    index: i,
                    line: line
                };
                i += str.length;
                old = input.substring(0, str.length);
                input = input.substring(str.length);
                k++;
            }
            // check if it's a number
            else if (input.match(this.operators.numRegexp)) {
                num = input.match(this.operators.numRegexp)[0];
                out[k] = {
                    token: num,
                    index: i,
                    line: line
                };
                i += num.length;
                old = input.substring(0, num.length);
                input = input.substring(num.length);
                k++;
            }
            // if it's one of the reserved tokens
            else if (input.match(this.operators.reservedRegexp)) {
                var opp = input.match(this.operators.reservedRegexp)[0];
                if (out[k] != null) {
                    k++;
                }
                out[k] = {
                    token: opp,
                    index: i,
                    line: line
                };
                i += opp.length;
                old = input.substring(0, opp.length);
                input = input.substring(opp.length);
                k++;
            }
            // if it's a function
            else if (input.match(this.operators.functionRegexp)) {
                num = input.match(this.operators.functionRegexp)[0];
                out[k] = {
                    token: num,
                    index: i,
                    line: line
                };
                i += num.length;
                old = input.substring(0, num.length);
                input = input.substring(num.length);
                k++;
            }
            // if it's whitespace move to next array entry
            else if (input.substring(0, 1) == " ") {
                if (out[k] != null) {
                    k++;
                }
                i++;
                old = input.substring(0, 1);
                input = input.substring(1);
            }
            // if it's a variable
            else if (input.match(this.operators.variable2Regexp)) {
                num = input.match(this.operators.variable2Regexp)[0];
                out[k] = {
                    token: num,
                    index: i,
                    line: line
                };
                i += num.length;
                old = input.substring(0, num.length);
                input = input.substring(num.length);
                k++;
            }
            // otherwise, just tack it on to the last array entry
            else {
                if (out[k] == null) {
                    out[k] = {
                        token: input[0],
                        index: i,
                        line: line
                    };
                } else {
                    out[k].token += input[0];
                }
                i++;
                old = input.substring(0, 1);
                input = input.substring(1);
            }
            if (loop++ > this.maxLoops) {

                throw new Error("Maximum number of loops exceeded!");
            }
        }
        return out;
    };

    CommandParser.prototype.preprocess = function (input) {
        var cmd = [];
        var working = input.slice(0);
        var lines = working.replace(/\r\n/g, "\n").split("\n");
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            if (line.match(/\.{3}$/)) {
                line = line.replace("...", "");
            } else {
                line += "\n";
            }
            cmd = cmd.concat(this.tokenize(line, i));
        }
        return cmd;
    };

    CommandParser.prototype.evaluate = function (input, callback) {
        var self = this;

        if (!callback) callback = function () {
        };
        this.output = [];
        this.lines = input.split("\n");
        var tokens = this.preprocess(input);
        var script = new Script(tokens, 0, null, this.operators);
        var opts = {
            variables: this.variables,
            outputCallback: this.outputCallback
        };
        script.interpret(opts, function (err, ans) {
            callback(err, self.output);
        });
    };

    return CommandParser;

});
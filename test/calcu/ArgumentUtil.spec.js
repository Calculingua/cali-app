define([
    "cali-calcu/ArgumentUtil",
    "$J"
], function (ArgumentUtil, $J) {

    $J.describe("a function to parse arguments", function () {

        $J.it("should parse 0 arguments", function () {
            var signature = [];
            var parsedArguments = ArgumentUtil.parseArguments([], signature);
            $J.expect(parsedArguments.index).toEqual(0);
            $J.expect(parsedArguments.signature).toEqual(signature);
        });

        $J.it("should parse single argument signature", function () {
            var signature = [
                {name: "foo"}
            ];
            var parsedArguments = ArgumentUtil.parseArguments(["bar"], signature);
            $J.expect(parsedArguments.index).toEqual(0);
            $J.expect(parsedArguments.signature).toEqual(signature);
            $J.expect(parsedArguments.getArgument("foo")).toEqual("bar");
        });

        $J.describe("should parse two signatures", function () {


            var signature1 = [
                {name: "foo"}
            ];
            var signature2 = [
                {name: "city"},
                {name: "state"}
            ];
            $J.it("first one", function () {
                var parsedArguments = ArgumentUtil.parseArguments(["bar"], signature1, signature2);
                $J.expect(parsedArguments.index).toEqual(0);
                $J.expect(parsedArguments.signature).toEqual(signature1);
                $J.expect(parsedArguments.getArgument("foo")).toEqual("bar");
            });

            $J.it("second one", function () {
                var parsedArguments = ArgumentUtil.parseArguments(["louisville", "ky"], signature1, signature2);
                $J.expect(parsedArguments.index).toEqual(1);
                $J.expect(parsedArguments.signature).toEqual(signature2);
                $J.expect(parsedArguments.getArgument("city")).toEqual("louisville");
                $J.expect(parsedArguments.getArgument("state")).toEqual("ky");
            });
        });

        $J.describe("should reject mismatch in type", function () {


            var signature1 = [
                {name: "foo"}
            ];
            var signature2 = [
                {name: "city", type: "string"},
                {name: "state", type: "string"}
            ];
            $J.it("first one should pass (no type specified", function () {
                var parsedArguments = ArgumentUtil.parseArguments([0], signature1, signature2);
                $J.expect(parsedArguments.index).toEqual(0);
            });

            $J.it("should not be able to parse mismatching types", function () {
                var parsedArguments = ArgumentUtil.parseArguments(["louisville", 0], signature1, signature2);
                $J.expect(parsedArguments.index).toEqual(0);
                $J.expect(parsedArguments.signature).toEqual(signature1);
                $J.expect(parsedArguments.getArgument("foo")).toEqual("louisville");
            });
        });
    });


});
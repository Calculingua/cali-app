define([
  "$J",
  "cali-calcu/CommandParser"
], function ($J, CommandParser) {

    $J.describe("cali.module.base.distributions.poisson", function() {
        var parser, eps;

        $J.beforeEach(function() {
            jasmine.Expectation.addMatchers(cali.spec.Matchers);
            parser = new CommandParser();
            eps = 1e-3;
        });

        $J.it("computes poisscdf", function() {
            var inputs = [
                'p = poisscdf(0, 5);',
                'p = poisscdf(1, 5);',
                'p = poisscdf(2, 5);',
                'p = poisscdf(3, 5);',
                'p = poisscdf(4, 5);',
                'p = poisscdf(0, 3);',
                'p = poisscdf(1, 3);',
                'p = poisscdf(2, 3);',
                'p = poisscdf(3, 3);',
                'p = poisscdf(4, 3);',
            ];

            var outputs = [
                0.00673794699908547,
                0.0404276819945128,
                0.124652019483081,
                0.265025915297362,
                0.440493285065213,
                0.049787068367864,
                0.199148273471456,
                0.423190081126844,
                0.647231888782232,
                0.815263244523773,
            ];

            inputs.forEach(function(input, i) {
                parser.evaluate(input, function(err, ans) {
                    $J.expect(err).toBeFalsy();
                    $J.expect(ans[0].ans[0][0]).toBeCloseTo(outputs[i]);
                });
            });
        });

        $J.it("computes poisspdf", function() {
            var inputs = [
                'p = poisspdf(0, 5);',
                'p = poisspdf(1, 5);',
                'p = poisspdf(2, 5);',
                'p = poisspdf(3, 5);',
                'p = poisspdf(4, 5);',
                'p = poisspdf(0, 3);',
                'p = poisspdf(1, 3);',
                'p = poisspdf(2, 3);',
                'p = poisspdf(3, 3);',
                'p = poisspdf(4, 3);',
            ];

            var outputs = [
                0.00673794699908547,
                0.0336897349954273,
                0.0842243374885684,
                0.140373895814281,
                0.175467369767851,

                0.049787068367864,
                0.149361205103592,
                0.224041807655388,
                0.224041807655388,
                0.168031355741541
            ];

            inputs.forEach(function(input, i) {
                parser.evaluate(input, function(err, ans) {
                    $J.expect(err).toBeFalsy();
                    $J.expect(ans[0].ans[0][0]).toBeCloseTo(outputs[i]);
                });
            });
        });

        $J.it("computes poissinv", function() {
            var inputs = [
                {l: 5, k: 0},
                {l: 5, k: 1},
                {l: 5, k: 2},
                {l: 5, k: 3},
                {l: 5, k: 4},
                {l: 5, k: 5},
                {l: 5, k: 6},
                {l: 5, k: 7},
                {l: 3, k: 0},
                {l: 3, k: 1},
                {l: 3, k: 2},
                {l: 3, k: 3},
                {l: 3, k: 4},
                {l: 3, k: 5},
                {l: 3, k: 6},
                {l: 3, k: 7},
            ];

            inputs.forEach(function(input) {
                var txt = [
                    'p = poisscdf(' + input.k + ','+ input.l + ');',
                    'k = poissinv(p,' + input.l + ');',
                ].join('\n');
                parser.evaluate(txt, function(err, ans) {
                    if (err) {console.log("POISSINV ERR on", input);}
                    $J.expect(err).toBeFalsy();
                    $J.expect(ans[1].ans[0][0]).toEqual(input.k);
                });
            });
        });
    });


});
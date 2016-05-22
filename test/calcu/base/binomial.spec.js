define([
  "$J",
  "cali-calcu/CommandParser",
  "../dev/Matchers"
], function ($J, CommandParser, Matchers) {


    $J.describe("Binomial distribution functions", function() {
        var parser, eps;

        $J.describe("binopdf", function() {

            $J.beforeEach(function() {
                $J.jasmine.Expectation.addMatchers(Matchers);
                parser = new CommandParser();
                eps = 1e-3;
            });

            $J.it("computes the pdf of a single number", function() {
                parser.evaluate("binopdf(0,200,0.02);", function(err, ans) {
//                    $J.expect(err).toBeFalsy();
                    $J.expect(ans[0].ans[0][0]).toBeCloseTo(0.0176, eps);
                });
            });

            $J.it("computes the pdf for a row-vector of numbers", function(done) {
                parser.evaluate([
                    ['X = [2, 3, 4, 5];'],
                    ['N = 20;'],
                    ['P = [0.01, 0.05, 0.1, 0.15];'],
                ].join('\n'), function(err, ans) {
                    $J.expect(err).toBeFalsy();
                    parser.evaluate("binopdf(X,N,P);", function(err, ans) {
                        $J.expect(err).toBeFalsy();
                        $J.expect(ans[0].ans).toBeMatrixCloseTo([[0.016, 0.060, 0.090, 0.103]], eps);
                        done();
                    });
                });
            });


            $J.it("computes the pdf for a column-vector of numbers", function(done) {
                parser.evaluate([
                    ['X = [2; 3; 4; 5];'],
                    ['N = 20;'],
                    ['P = [0.01; 0.05; 0.1; 0.15];']
                ].join('\n'), function(err, ans) {
                    $J.expect(err).toBeFalsy();
                    parser.evaluate("binopdf(X,N,P);", function(err, ans) {
                        $J.expect(err).toBeFalsy();
                        $J.expect(ans[0].ans).toBeMatrixCloseTo([[0.016], [0.060], [0.090], [0.103]], eps);
                        done();
                    });
                });

            });

            $J.it("computes the pdf for a matrix of numbers", function(done) {
                parser.evaluate([
                    ['X = [2, 3; 4, 5];'],
                    ['N = 20;'],
                    ['P = [0.01, 0.05; 0.1, 0.15];']
                ].join('\n'), function(err, ans) {
                    $J.expect(err).toBeFalsy();
                    parser.evaluate("binopdf(X,N,P);", function(err, ans) {
                        $J.expect(err).toBeFalsy();
                        $J.expect(ans[0].ans).toBeMatrixCloseTo([[0.016, 0.060], [0.090, 0.103]], eps);
                        done();
                    });
                });

            });

        });




        $J.describe("binocdf", function() {

            $J.beforeEach(function() {
                $J.jasmine.Expectation.addMatchers(Matchers);
                parser = new CommandParser();
                eps = 1e-3;
            });

            $J.it("computes the cdf of a single number", function() {
                parser.evaluate("binocdf(0,20,0.05);", function(err, ans) {
                    $J.expect(err).toBeFalsy();
                    $J.expect(ans[0].ans[0][0]).toBeCloseTo(0.358, eps);
                });
            });

            $J.it("computes the cdf for a row-vector of numbers", function(done) {
                parser.evaluate([
                    ['X = [2, 3, 4, 5];'],
                    ['N = [20, 20, 20, 20];'],
                    ['P = [0.05, 0.1, 0.2, 0.3];'],
                ].join('\n'), function(err, ans) {
                    $J.expect(err).toBeFalsy();
                    parser.evaluate("binocdf(X,N,P);", function(err, ans) {
                        $J.expect(err).toBeFalsy();
                        $J.expect(ans[0].ans).toBeMatrixCloseTo([[0.925, 0.867, 0.630, 0.416]], eps);
                        done();
                    });
                });
            });



            $J.it("computes the cdf for a column-vector of numbers", function(done) {
                parser.evaluate([
                    ['X = [2; 3; 4; 5];'],
                    ['N = [20; 20; 20; 20];'],
                    ['P = [0.05; 0.1; 0.2; 0.3];']
                ].join('\n'), function(err, ans) {
                    $J.expect(err).toBeFalsy();
                    parser.evaluate("binocdf(X,N,P);", function(err, ans) {
                        $J.expect(err).toBeFalsy();
                        $J.expect(ans[0].ans).toBeMatrixCloseTo([[0.925], [0.867], [0.630], [0.416]], eps);
                        done();
                    });
                });

            });

            $J.it("computes the cdf for a matrix of numbers", function(done) {
                parser.evaluate([
                    ['X = [2, 3; 4, 5];'],
                    ['N = [20, 20; 20, 20];'],
                    ['P = [0.05, 0.1; 0.2, 0.3];'],
                ].join('\n'), function(err, ans) {
                    $J.expect(err).toBeFalsy();
                    parser.evaluate("binocdf(X,N,P);", function(err, ans) {
                        $J.expect(err).toBeFalsy();
                        $J.expect(ans[0].ans).toBeMatrixCloseTo([[0.925, 0.867], [0.630, 0.416]], eps);
                        done();
                    });
                });

            });

        });

        $J.describe("binoinv", function() {

            $J.beforeEach(function() {
                $J.jasmine.Expectation.addMatchers(Matchers);
                parser = new CommandParser();
                eps = 1e-3;
            });

            $J.it("computes the inv of a single number", function() {
                parser.evaluate("binoinv(0.2, 100, 0.5);", function(err, ans) {
                    $J.expect(err).toBeFalsy();
                    $J.expect(ans[0].ans[0][0]).toEqual(46);
                });
            });

            $J.it("computes the inv for a row-vector of numbers", function(done) {
                parser.evaluate([
                    ['U = [0.2, 0.5, 0.9];'],
                    ['N = 100;'],
                    ['P = 0.5;'],
                ].join('\n'), function(err, ans) {
                    $J.expect(err).toBeFalsy();
                    parser.evaluate("binoinv(U,N,P);", function(err, ans) {
                        $J.expect(err).toBeFalsy();
                        $J.expect(ans[0].ans).toBeMatrixCloseTo([[46, 50, 56]], eps);
                        done();
                    });
                });
            });



            $J.it("computes the inv for a column-vector of numbers", function(done) {
                parser.evaluate([
                    ['U = [0.2; 0.5; 0.9];'],
                    ['N = 100;'],
                    ['P = 0.5;'],
                ].join('\n'), function(err, ans) {
                    $J.expect(err).toBeFalsy();
                    parser.evaluate("binoinv(U,N,P);", function(err, ans) {
                        $J.expect(err).toBeFalsy();
                        $J.expect(ans[0].ans).toBeMatrixCloseTo([[46], [50], [56]], eps);
                        done();
                    });
                });

            });

            $J.it("computes the inv for a matrix of numbers", function(done) {
                parser.evaluate([
                    ['U = [0.2, 0.5; 0.9, 0.95];'],
                    ['N = [100, 100; 100, 162];'],
                    ['P = 0.5;']
                ].join('\n'), function(err, ans) {
                    $J.expect(err).toBeFalsy();
                    parser.evaluate("binoinv(U,N,P);", function(err, ans) {
                        $J.expect(err).toBeFalsy();
                        $J.expect(ans[0].ans).toBeMatrixCloseTo([[46, 50], [56, 91]], eps);
                        done();
                    });
                });

            });

        });


    });


});
define([
    "../NdArray",
    "../../util",
    "../../typeExtend",
    "../Matrix",
    "../distributions",
    "numeric"
], function (NdArray, util, typeExtend, Matrix, distributions, numeric) {

    var tmpData = [];
    var LinearModel = typeExtend({
        type: "LINEARMODEL",
        constructor: function LinearModel(variables, response) {
            // response should be a column vector
            if (response.shape.length === 1) {
                response = new Matrix(response.toArray(), [response.length, 1]);
            } else if (response.shape.length === 2) {
                if (response.isRowVector()) {
                    response = response.transpose();
                } else if (!response.isColumnVector()) {
                    throw new Error("Response may not be a 2-d array");
                }
            }


            this.variables = variables;
            this.response = response;
            this.coefficients = {
                estimate: null,
                SE: null,
                tStat: null,
                pValue: null
            };
            this.Rsquared = {};

            this.setLink("identity");
            this.setModelType('linear');
            this.setDistribution('normal');

        },

        serialize: function(){
            return {
                type: LinearModel.prototype.type,
                linkName: this.linkName,
                distName: this.distName,
                modelType: this.modelType,
                variables: this.variables.serialize(),
                response: this.response.serialize(),
                coefficients: {
                    estimate: this.coefficients.estimate ? this.coefficients.estimate.slice() : null,
                    SE: this.coefficients.SE ? this.coefficients.SE.slice() : null,
                    tStat: this.coefficients.tStat ? this.coefficients.tStat.slice() : null,
                    pValue: this.coefficients.pValue ? this.coefficients.pValue.slice() : null
                },
                Rsquared: {
                    ordinary: this.Rsquared.ordinary
                }
            };
        },

        /**
         * Set the modelType and model
         * String   Model Type
         * 'constant'  Model contains only a constant (intercept) term.
         * 'linear'    Model contains an intercept and linear terms for each predictor.
         * 'interactions'  Model contains an intercept, linear terms, and all products of pairs of distinct predictors (no squared terms).
         * 'purequadratic' Model contains an intercept, linear terms, and squared terms.
         * 'quadratic' Model contains an intercept, linear terms, interactions, and squared terms.
         * 'polyijk'   Model is a polynomial with all terms up to degree i in the first predictor, degree j in the second predictor, etc. Use numerals 0 through 9. For example, 'poly2111' has a constant plus all linear and product terms, and also contains terms with predictor 1 squared.
         *
         * 'terms'
         * 'formula' 
         */
        setModelType: function(modelType, termsOrFormula) {
            // ONLY 'linear' is implemented
            if (modelType !== 'linear') {
                throw new Error("Only 'linear' modelType is implemented.");
            }
            this.modelType = modelType;
        },

        /**
         * Distribution Link Function Name  Link Function   Mean (Inverse) Function
         * 'normal'    'identity'  f(μ) = μ    μ = Xb
         * 'binomial'  'logit' f(μ) = log(μ/(1–μ)) μ = exp(Xb) / (1 + exp(Xb))
         * 'poisson'   'log'   f(μ) = log(μ)   μ = exp(Xb)
         * 'gamma' -1  f(μ) = 1/μ  μ = 1/(Xb)
         * 'inverse gaussian'  -2  f(μ) = 1/μ2 μ = (Xb)–1/2
         */
        setDistribution: function(distName) {
            var supportedDistributions = Object.keys(LinearModel.distributions);
            if (supportedDistributions.indexOf(distName) === -1) {
                throw new Error("Distribution '" + distName + "' not supported");
            }

            this.distName = distName;
            this.setLink(LinearModel.distributions[distName].defaultLink);
        },

        setLink: function(linkName) {
            var supportedLinks = Object.keys(LinearModel.linkFunctions);
            if (supportedLinks.indexOf(linkName) === -1) {
                throw new Error("Link function '" + linkName + "' not supported");
            }

            this.linkName = linkName;
        },

        fit: function () {
            // Apply the link function to each response value
            var Y = this.response.transform(LinearModel.linkFunctions[this.linkName].link);
            var N = Y.length;

            // We need to add a column to represent the constant in the model
            // Right now, the only model this fitting alg supports is of the 
            // form:
            //  Y ~ B0 + B1x1 + B2x2 + B3x3 + ... + BNxN
            // This column of 1s represents B0
            var ones = Matrix.ones([this.variables.shape[0],1]);
            var X = Matrix.mergeHorizontal([ones, this.variables]);

            // Estimates
            var QR = X.qr();

            var Rinv = new Matrix(numeric.inv(QR.R.toArray()));
            var Coef = Rinv.times(QR.Q.transpose().times(Y));
            this.coefficients.estimate = Coef.transpose().toArray()[0];


            // Degree of freedom for error = observations - coefficients
            var DFE = X.shape[0] - X.shape[1] + 1;

            // Standard Error
            var Regression = X.times(Coef);
            var Residuals = Y.minus(Regression);
            var ResidualsSquared = Residuals.diag().times(Residuals);

            // OLS estimator for variance
            var s2 = Residuals.transpose().times(Residuals).get([0,0])/DFE;
            // Maximum likelihood estimator for variance
            var sigma2 = s2*DFE/X.shape[0];

            var Qxx = X.transpose().times(X);
            var Qxxinv = Qxx.inverse();
            var CoefficientErrors = Matrix.zeros(Coef.shape);
            CoefficientErrors.forEach(function(val, idx) {
                var row = idx[0];
                var err = Math.sqrt((sigma2/N)*Qxxinv.get([row, row]));
                CoefficientErrors.set(idx, err);
            });
            this.coefficients.SE = CoefficientErrors.transpose().toArray()[0];

            // TSTAT
            var tStat = [];
            var pValue = [];
            Coef.forEach(function(b, idx, n) {
                var ts = b/Math.sqrt(CoefficientErrors.get(idx));
                tStat.push(ts);
                pValue.push(distributions.studentt.pdf(ts, DFE));
            });
            this.coefficients.tStat = tStat;
            this.coefficients.pValue = pValue;

            var standardErrorEstimates = ResidualsSquared.copy();
            standardErrorEstimates.forEach(function(ee, idx) {
                standardErrorEstimates.set(idx, Math.sqrt(ee/(N-2)));
            });


            // Mean Squared Error
            // var MSE = SSE/DFE;
            // var RMSE = Math.sqrt(MSE);

            // R-Squared
            // Rsquared = SSR/SST = 1 - SSE/SST.
            var yMean = Y.sum() / N;
            var SSE, SST = 0, SSR = 0;
            Y.forEach(function(y, idx) {
                SST += Math.pow(y-yMean,2);
            });
            Regression.forEach(function(r, idx) {
                SSR += Math.pow(r-yMean,2);
            });
            SSE = SST - SSR;
            this.Rsquared = {
                ordinary: 1 - (SSE/SST)
            };



            return this;
        },
        predict: function (ndArray2d) {

            tmpData.length = ndArray2d.length;
            ndArray2d.copyDataToArray(tmpData);

            var estimates = new Array(ndArray2d.shape[0]);
            var i;
            for (i = 0; i < ndArray2d.shape[0]; i += 1) {
                estimates[i] = this._estimateValue(tmpData, i * ndArray2d.shape[1]);
            }
            return estimates;
        },

        _estimateValue: function (inputData, inputRowIndex) {
            var i;
            var sum = this.coefficients.estimate[0];
            for (i = 1; i < this.coefficients.estimate.length; i += 1) {
                sum += this.coefficients.estimate[i] * inputData[inputRowIndex + i - 1];
            }
            return sum;
        },

        _factors: function () {
            var factors = [1];
            var i;
            for (i = 1; i < this.coefficients.estimate.length; i += 1) {
                factors.push("x" + i);
            }
            return factors;
        },

        _modelString: function (factors) {
            return "y ~ " + factors.join(" + ");
        },

        jsonDisplay: function () {

            //y ~ 1 + x1 + x2 + x3 + x4 + x5
            var i;
            var factors = this._factors();
            var model = this._modelString(factors);

            //coefficient table
            var rows = [];
            rows.push(["", "Estimate", "SE", "tStat", "pValue"]);
            var row;
            for (i = 0; i < this.coefficients.estimate.length; i += 1){
                row = [];
                row.push((i === 0) ? "(Intercept)" : factors[i]);
                row.push(this.coefficients.estimate[i]);
                row.push(this.coefficients.SE ? this.coefficients.SE[i] : "");
                row.push(this.coefficients.tStat ? this.coefficients.tStat[i] : "");
                row.push(this.coefficients.pValue ? this.coefficients.pValue[i] : "");
                rows.push(row);
            }

            

            return {
                title: "Linear regression model",
                model: model,
                coefficientTable: {
                    title: "Estimated Coefficients",
                    rows: rows
                },
                rsquared: this.Rsquared.ordinary
            };
        },

        shortDisplay: function () {
            var factors = this._factors();
            return this._modelString(factors);
        },


        /**
         * returns an html representation of the object
         * adapted from http://www.mathworks.com/help/stats/linearmodel.disp.html
         */
        display: function(){
            var json = this.jsonDisplay();

            var html = "<div>" + json.title + "</div>";
            html += "<div>" + json.model + "</div>";
            html += "<div>" + json.coefficientTable.title + "</div>";

            html += "<table>";
            var i, j;
            for (i = 0; i < json.coefficientTable.rows.length; i += 1) {
                html += "<tr>";
                for (j = 0; j < json.coefficientTable.rows[i].length; j += 1) {
                    html += "<td>";
                    html += json.coefficientTable.rows[i][j];
                    html += "</td>";
                }
                html += "</tr>";
            }
            html += "</table>";
            html += "<div>R-Squared: " + json.rsquared + "</div>";

            return html;
        },


        equals: function (linearModel) {

            return (
                linearModel.variables.equals(this.variables) &&
                linearModel.response.equals(this.response) &&
                linearModel.linkName === this.linkName &&
                linearModel.distName === this.distName &&
                util.sameArray(linearModel.coefficients.estimate, this.coefficients.estimate)
                );
        }

    });

    LinearModel.distributions = {
        'normal': {
            defaultLink: 'identity'
        },

        'binomial': {
            defaultLink: 'logit'
        },

        'poisson': {
            defaultLink: 'log'
        }
    };

    LinearModel.linkFunctions = {
        'identity': {
            link: function(p) { return p; },
            antilink: function(v) { return v; }
        },
        'logit': {
            link: function(p) { return Math.log(p/(1-p)); },
            antilink: function(v) { return 1/(1+Math.exp(-1*v)); }
        },
        'log': {
            link: function(p) { return Math.log(p); },
            antilink: function(v) { return Math.exp(v); }
        }
    };

    LinearModel.deserialize = function (data) {
        var linearModel = new LinearModel(NdArray.deserialize(data.variables), Matrix.deserialize(data.response));
        linearModel.setLink(data.linkName);
        linearModel.setDistribution(data.distName);
        linearModel.coefficients = {
            estimate: data.coefficients.estimate ? data.coefficients.estimate.slice() : null,
            SE: data.coefficients.SE ? data.coefficients.SE.slice() : null,
            tStat: data.coefficients.tStat ? data.coefficients.tStat.slice() : null,
            pValue: data.coefficients.pValue ? data.coefficients.pValue.slice() : null
        };
        linearModel.Rsquared = {
            ordinary: data.Rsquared ? data.Rsquared.ordinary : undefined
        };
        return linearModel;
    };

    return LinearModel;
});


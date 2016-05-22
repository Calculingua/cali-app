define([
    "../lib/Matrix",
    "../lib/NdArray",
    "../lib/linearmodel/Linearmodel"
], function (Matrix, NdArray, LinearModel) {


    function fitlm(variables, response) {

        var variablesNdArray, responseNdArray;

        if (variables.type === "TABLE") { 
            variablesNdArray = Matrix.mergeHorizontal(variables.data.map(function(m) { return new Matrix(m); })); 
        } else {
            variablesNdArray = new NdArray(variables);
        }

        if (response.type === "TABLE") { 
            responseNdArray = Matrix.mergeHorizontal(response.data.map(function(m) { return new Matrix(m); })); 
        } else {
            responseNdArray = new Matrix(response);
        }

        var linearModel = new LinearModel(variablesNdArray, responseNdArray);
        linearModel.fit();

        return linearModel;

    }

    fitlm.async = false;
    fitlm.shortHelp = "Perform regression analysis by fitting a linear model to the input data.";
    fitlm.help = "# fitlm\n\n" +
        "Perform regression analysis by fitting a linear model to the input data.\n\n" +
        "## Syntax \n\n" +
        "```\nlinearModel = fitlm(X,y) \n" +
        "```\n\n" +
        "## Description\n\n" +
        "Creates a linear model.\n\n" +
        "### Inputs       \n\n" +
        "- `X` -- the input data. A matrix or table with the independent values. Each row represents a sample, and the columns are the measurements of the independent variables. \n" +
        "- `Y` -- the response values. A column or row vector of the dependent variable.\n\n" +
        "### Output       \n\n" +
        "`linearModel` -- an object which represents the result of the regression analysis. It can be used with the `display` or `predict` functions.\n         \n" +
        "## Examples\n\n" +
        "```\n" +
        "X = [1,2;2,2;3,1]\n" +
        "y = [8;10;9]\n" +
        "linearModel = fitlm(X,y)\n" +
        "display(linearModel)\n" +
        "```";

    return fitlm;


});
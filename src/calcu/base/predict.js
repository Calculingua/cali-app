define(["../lib/NdArray"], function (NdArray) {


    function predict(linearModel, samples) {

        var ndArray;
        try {
            ndArray = new NdArray(samples);
        } catch (e) {
            throw new Error("Cannot parse the sample correctly. " + e.message);
        }

        return [linearModel.predict(ndArray)];
    }

    predict.async = false;
    predict.shortHelp = "Predict output values using a linear model";
    predict.help = "# predict\n\n" +
        "Predict output values using a linear model.\n\n" +
        "## Syntax \n\n" +
        "```\n" +
        "predict(linearModel,X)\n" +
        "```\n\n" +
        "## Description\n\n" +
        "Make a prediction for one or more (unseen) samples.\n\n" +
        "###Inputs\n\n" +
        "- `linearModel` -- the linearModel object.\n" +
        "- `X` -- the samples to make the prediction for. This needs to be the same shape as the input matrix used to perform the regression analysis. The number of independent variables (columns) should match the number of independent variables in the model. \n\n" +
        "## Examples\n\n```\n" +
        "X = [1,2;2,2;3,1];\n" +
        "y = [8;10;9];\n" +
        "linearModel = fitlm(X,y);\n" +
        "predict(linearModel,[1,2]);\n" +
        "% ans = 8 \n" +
        "predict(linearModel,[1,2;2,2;3,1])\n" +
        "% ans = [8,10,9]\n```" +
        "\n\n";

    return predict;

});
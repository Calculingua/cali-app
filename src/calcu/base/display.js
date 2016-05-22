define([
], function () {

    function display(linearModel) {
        return {
            data: linearModel.jsonDisplay(),
            type :"LINEAR_MODEL_DISPLAY"
        };
    }

    display.async = false;
    display.shortHelp = "Display a linear model.";
    display.help = "# display\n\n" +
        "Displays the result of a linear regression analysis.\n\n" +
        "## Syntax \n\n" +
        "```\ndisplay(linearModel)\n" +
        "```\n\n" +
        "## Description\n\n" +
        "Displays the result of a linear regression analysis. The result is shown on the console.\n\n" +
        "###Inputs" +
        "\n\n- " +
        "`linearModel` -- the linearModel object.       \n          \n" +
        "## Examples\n\n```" +
        "\nX = [1,2;2,2;3,1];" +
        "\ny = [8;10;9];" +
        "\nlinearModel = fitlm(X,y);" +
        "\ndisplay(linearModel);\n" +
        "```\n\n";
    return display;


});

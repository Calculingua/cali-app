define([
    "cali-calcu/serializeDeserialize",
    "jQuery.flot",
    "jQuery.flot.canvas",
    "jQuery.flot.legendoncanvas",
    "jQuery.flot.axislabels",
    "jQuery.flot.orderbars",
    // "jQuery.flot.symbol",
    "canvas2image"
], function (serializeDeserialize, flot, flotCanvas, flotLegendOnCanvas, flotaxisLabels, flotOrderbars, canvas2image) {

    function Service(markdown) {

        var self = this;

        this.commandClass = "history_command";
        this.exceptionClass = "history_exception";
        this.commentClass = "history_comment";
        this.resultClass = "history_result";
        this.plotClass = "plot_result";

        this.commentBuffer = "";
        this.prevType = null;

        this.toHtml = function (type, value, id) {
            var html = "";
            var linearModel;
            switch (type) {
                case "result":
                    if (value.text) {
                        var dd = markdown.toHTML(value.text);
                        html += "<div class='" + self.resultClass + " text_result'>";
                        html += dd;
                        html += "</div>";
                    } else {
                        html += "<div class='" + self.resultClass + "'>";
                        html += "<table class='ansTable'>";
                        html += "<tr>";
                        html += "<td class='ansName'>" + value.name + " </td>";
                        html += "</tr>";
                        html += "<td class='ansValue'>";
                        switch (value.ans.type) {
                            //#237: each time a new type is introduced, we would have to find out where this sort of type-checking
                            //occurs and extend it accordingly. this is very difficult to keep in sync.
                            case "CELL_ARRAY":
                                html += self.cellArray2html(value.ans, value.truncated);
                                break;
                            case "TABLE":
                                html += self.table2html(value.ans, value.truncated);
                                break;
                            case "CATEGORICAL":
                                html += self.categorical2html(value.ans, value.truncated);
                                break;
                            case "HASH_TABLE":
                                html += self.hashTable2html(value.ans, value.truncated);
                                break;
                            case "LINEARMODEL":
                                var factors = [1];
                                for (i = 1; i < value.ans.coefficients.estimate.length; i += 1) {
                                    factors.push("x" + i);
                                }
                                html += "y ~ " + factors.join(" + ");
                                break;
                            case "LINEAR_MODEL_DISPLAY":

                                html += "<p>";
                                html += "<div>";
                                html += "<div>" + value.ans.data.title + "</div>";
                                html += "<div>" + value.ans.data.model + "</div>";
                                html += "</p>";

                                html += "<p>";
                                html += "<div>" + value.ans.data.coefficientTable.title + "</div>";
                                html += "<table class='matrix>";
                                var j;


                                html += "<tr class='matrixRow'>";
                                for (j = 0; j < value.ans.data.coefficientTable.rows[0].length; j += 1) {
                                    html += "<th class='matrixEntry cell'>";
                                    html += value.ans.data.coefficientTable.rows[0][j];
                                    html += "</th>";
                                }
                                html += "</tr>";


                                var i;
                                for (i = 1; i < value.ans.data.coefficientTable.rows.length; i += 1) {
                                    html += "<tr class='matrixRow'>";
                                    for (j = 0; j < value.ans.data.coefficientTable.rows[i].length; j += 1) {
                                        if (typeof value.ans.data.coefficientTable.rows[i][j] == "string") {
                                            html += "<td>" + value.ans.data.coefficientTable.rows[i][j] + "</td>";
                                        } else {
                                            html += "<td class='matrixEntry cell'>" + self.formatNumber(value.ans.data.coefficientTable.rows[i][j]) + "</td>";
                                        }
                                        html += "</td>";
                                    }
                                    html += "</tr>";
                                }
                                html += "</table>";
                                html += "</p>";

                                html += "<p>";
                                html += "<div>R-Squared: " + self.formatNumber(value.ans.data.rsquared) + "</div>";
                                html += "</p>";

                                break;
                            default:
                                html += self.matrix2html(value.ans, value.truncated);
                                break;
                        }
                        html += "</td>";
                        html += "</tr>";
                        html += "</table>";
                        html += "</div>";
                    }
                    break;
                case "plot":
                    html += self.plot2html(value, id);
                    break;
                case "exception":
                    html += "<div class='" + self.exceptionClass + "'>" + value + "</div>";
                    break;
                case "command":
                    var lines = value.split("\n");
                    var modCmd = "";
                    for (var line in lines) {
                        modCmd += ("\t" + lines[line] + "\n");
                    }
                    html += "<div class='" + self.commandClass + "'>" + markdown.toHTML(modCmd) + "</div>";
                    break;
                case "comment":
                    html += "<div class=\"" + self.commentClass + " text_result\">" + markdown.toHTML(value) + "</div>";
                    break;
            }
            return html;
        };

        var arrayToString = function (array) {
            return JSON.stringify(array);
        };

        this.plot2html = function (opts, id) {
            var data = arrayToString(opts.data);
            if (!opts.options) {
                opts.options = {};
            }
            var i;
            if (opts.options.xaxes) {
                for (i = 0; i < opts.options.xaxes.length; i++) {
                    opts.options.xaxes[i].axisLabelUseCanvas = true;
                    // opts.options.xaxes[i].axisLabelFontSizePixels = 14;
                    opts.options.xaxes[i].axisLabelPadding = 20;
                }
            }
            if (opts.options.yaxes) {
                for (i = 0; i < opts.options.yaxes.length; i++) {
                    opts.options.yaxes[i].axisLabelUseCanvas = true;
                    // opts.options.yaxes[i].axisLabelFontSizePixels = 14;
                    opts.options.yaxes[i].axisLabelPadding = 10;
                }
            }
            if (typeof opts.options.legend === "undefined") {
                opts.options.legend = {};
            }
            opts.options.legend.labelBoxBorderColor = "none";
            opts.options.legend.show = true;
            opts.options.legend.labelBoxBorderColor = "#f5f5f5";

            opts.options.canvas = true;
            var options = arrayToString(opts.options);
            var html = "<div id=\"" + id + "\" class=\"" + self.resultClass + "\">\n" +
                "<div class=\"" + self.plotClass + "\">\n" +
                " <a class='hide-show'><i class=\"icon icon-download icon-2x\"></i></a>\n" +
                " <div class=\"plot\"></div>\n" +
                "</div>\n" +
                "<script>\n" +
                "$(function(){\n" +
                " var options = " + options + ";\n" +
                " var data = " + data + ";\n" +
                " var plot = $.plot(\"#" + id + " ." + self.plotClass + " .plot\", data, options );\n" +
                " $(\"#" + id + " ." + self.plotClass + " .hide-show\").click(function(){\n" +
                "  $canvas = plot.getCanvas();\n" +
                "  Canvas2Image.saveAsPNG($canvas, 900, 900, \"figure\", true);\n" +
                " });\n" +
                "})\n" +
                "</script>\n" +
                "</div>";
            return html;
        };

        this.matrix2html = function (x, truncated) {
            var out = "<table class='matrix'>";
            for (var i = 0; i < x.length; i++) {
                for (var j = 0; j < x[i].length; j++) {
                    if (typeof x[i][j] == "string") {
                        out += "<td class='matrixEntry'>" + x[i].join("") + "</td>";
                        break;
                    } else {
                        out += "<td class='matrixEntry'>" + self.formatNumber(x[i][j]) + "</td>";
                    }
                }
                if (truncated[2]) {
                    out += "<td>...</td>";
                }
                out += "</tr>";
            }
            if (truncated[1]) {
                out += "<tr class='matrixRow'>";
                out += "<td>...</td></tr>";
            }
            out += "</table>";
            return out;
        };

        var FIXED_WIDTH = 1e12;
        var PRECISION = 5;

        this.formatNumber = function (num) {
            num = Math.round(num * FIXED_WIDTH) / FIXED_WIDTH;
            var out = num.toString();
            if (Math.round(num) == num) {
                out = num.toString();
            } else if (Math.abs(num) > 1000 || Math.abs(num) < (1 / 1000)) {
                if (num.toExponential) {
                    out = num.toExponential(PRECISION);
                }
            } else {
                if (num.toPrecision) {
                    out = num.toPrecision(PRECISION);
                }
            }
            return out;
        };

        this.cellArray2html = function (x, truncated) {
            var out = "<table class='matrix cellArray'>";
            for (var i = 0; i < x.length; i++) {
                out += "<tr class='matrixRow'>";
                for (var j = 0; j < x[i].length; j++) {
                    if (x[i][j].type && x[i][j].type == "CELL_ARRAY") {
                        out += "<td class='matrixEntry cell'>{";
                        out += "" + x[i][j].length + "x" + x[i][j][0].length + " Cell";

                        out += "}</td>";
                    } else {
                        if (typeof x[i][j][0][0] == "string") {
                            out += "<td class='matrixEntry cell'>'";
                            if (x[i][j].length == 1) {
                                out += "" + x[i][j][0].join("");
                            } else {
                                out += "" + x[i][j].length + "x" + x[i][j][0].length + " Character";
                            }
                            out += "'</td>";
                        } else {
                            out += "<td class='matrixEntry cell'>[";
                            if (x[i][j].length == 1 && x[i][j][0].length == 1) {
                                out += "" + self.formatNumber(x[i][j][0][0]);
                            } else {
                                out += "" + x[i][j].length + "x" + x[i][j][0].length + " Number";
                            }
                            out += "]</td>";
                        }
                    }
                }
                if (truncated[2]) {
                    out += "<td>...</td>";
                }
                out += "</tr>";
            }
            if (truncated[1]) {
                out += "<tr class='matrixRow'>";
                out += "<td>...</td></tr>";
            }
            out += "</table>";
            return out;
        };

        this.table2html = function (data, truncated) {
            var i;
            var x = data.data;
            var out = "<table class='matrix cellArray'>";
            out += "<tr class='matrixRow'>";
            for (i = 0; i < data.properties.VariableNames.length; i++) {
                out += "<th>" + data.properties.VariableNames[i] + "</th>";
            }
            out += "</tr>";
            for (i = 0; i < x[0].length; i++) {
                out += "<tr class='matrixRow'>";
                for (var j = 0; j < x.length; j++) {
                    if (typeof x[j][i][0] == "number") {
                        out += "<td class='matrixEntry cell'>";
                        if (x[j][i].length == 1) {
                            out += "" + self.formatNumber(x[j][i][0]);
                        } else {
                            out += "" + 1 + "x" + x[j][i].length + " Number";
                        }
                        out += "</td>";
                    } else if (typeof x[j][i][0][0][0] == "string") {
                        out += "<td class='matrixEntry cell'>'";
                        if (x[j][i][0].length == 1) {
                            out += "" + x[j][i][0][0].join("");
                        } else {
                            out += "" + x[j][i][0].length + "x" + x[j][i][0].length + " Character";
                        }
                        out += "'</td>";
                    } else {
                        out += "<td class='matrixEntry cell'>[";
                        if (x[j][i].length == 1 && x[j][i][0].length == 1) {
                            out += "" + self.formatNumber(x[j][i][0][0]);
                        } else {
                            out += "" + x[j][i].length + "x" + x[j][i][0].length + " Number";
                        }
                        out += "]</td>";
                    }
                }
                out += "</tr>";
            }
            if (truncated[1]) {
                out += "<tr class='matrixRow'>";
                out += "<td>...</td></tr>";
            }
            out += "</table>";
            return out;
        };

        this.categorical2html = function (data, truncated) {
            var x = data.data;
            var out = "<table class='matrix cellArray'>";
            for (var i = 0; i < x.length; i++) {
                out += "<tr class='matrixRow'>";
                for (var j = 0; j < x[i].length; j++) {
                    out += "<td class='matrixEntry cell'>";
                    out += data.properties.names[x[i][j]];
                    out += "</td>";
                }
                if (truncated[2]) {
                    out += "<td>...</td>";
                }
                out += "</tr>";
            }
            if (truncated[1]) {
                out += "<tr class='matrixRow'>";
                out += "<td>...</td></tr>";
            }
            out += "</table>";
            return out;
        };

        this.hashTable2html = function (data, truncated) {
            var x = data.data;
            var out = "<table class='matrix hash-table'>";
            for (var key in x) {
                out += "<tr>";
                out += "<td class='ansName'>" + key + " = </td>";
                out += "</tr>";
                out += "<td class='ansValue'>";
                switch (x[key].type) {
                    //#237: each time a new type is introduced, we would have to find out where this sort of type-checking
                    //occurs and extend it accordingly. this is very difficult to keep in sync.
                    case "CELL_ARRAY":
                        out += self.cellArray2html(x[key], {});
                        break;
                    case "TABLE":
                        out += self.table2html(x[key], {});
                        break;
                    case "CATEGORICAL":
                        out += self.categorical2html(x[key], {});
                        break;
                    case "HASH_TABLE":
                        out += self.hashTable2html(x[key], {});
                        break;
                    default:
                        out += self.matrix2html(x[key], {});
                        break;
                }
                out += "</td>";
                out += "</tr>";
            }
            out += "</table>";
            return out;
        };
    }

    return  ["Markdown", Service];

});

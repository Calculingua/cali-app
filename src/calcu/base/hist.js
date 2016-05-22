define(["../util",
    "../ArgumentUtil",
    "../lib/hist", "../mType/HandleType"], function (util, ArgumentUtil, libHist, HandleType) {

    function sturgessBinNumber(vector) {
        return Math.ceil((Math.log(vector.length) / Math.log(2)) + 1);

    }

    var signature1 = [
        {name: "matrix"},
        {name: "nbins", test: function (nbins) {
            return (typeof nbins[0][0] === "number" && nbins[0][0] > 0);
        }},
        {name: "callback", type: "function"}
    ];
    var signature2 = [
        {name: "matrix"},
        {name: "callback", type: "function"}
    ];


    function parseHistArguments() {
        var args = ArgumentUtil.parseArguments(arguments, signature1, signature2);
        var vector = util.firstNonSingletonDimension(args.getArgument("matrix"));
        vector = vector || args.getArgument("matrix");
        return {
            vector: vector,
            nbins: (args.signature === signature2) ? sturgessBinNumber(vector) : args.getArgument("nbins"),
            callback: args.getArgument("callback")
        };
    }


    function hist() {
        var args;
        try {
            args = parseHistArguments.apply(null, arguments);
        } catch (e) {
            arguments[arguments.length -1]("Invalid arguments");
            return;
        }


        var result = libHist.hist(args.vector, args.nbins);
        args.callback(null, [result.counts], [result.centers]);
    }

    hist.async = true;
    hist.shortHelp = "Sorts data into a number of bins.";
    hist.help = "# hist(data, nbins) .\n" +
        "sorts data into the number of bins specified by the scalar nbins.\n" +
        "For plotting historgrams, please refer to the plothist function.";


    function plothist() {

        var args;
        try {
            args = parseHistArguments.apply(null, arguments);
        } catch (e) {
            arguments[arguments.length -1]("Invalid arguments");
            return;
        }
        var result = libHist.hist(args.vector, args.nbins);

        var coordinates = [];
        var i;
        for (i = 0; i < result.counts.length; i += 1) {
            coordinates.push([result.starts[i], result.counts[i]]);
        }

        var plotConfig = [
            {
                bars: {
                    barWidth: result.binwidth,
                    fill: 0.9,
                    lineWidth: 0,
                    order: 0,
                    show: true
                },
                data: coordinates
            }
        ];

        this.parser.controller.output.createPlot(plotConfig, null, function (err, id) {
            var handle = new HandleType(id, "plot", {data: plotConfig, opts: null});
            args.callback(null, handle);
        });
    }


    plothist.async = true;
    plothist.shortHelp = "plots a histo";
    plothist.help = "# hist(data, nbins) .\n" +
        "plots a histogram for the vector data, with the number of bins specified by nbins.\n";


    return {
        hist: hist,
        plothist: plothist
    };


});
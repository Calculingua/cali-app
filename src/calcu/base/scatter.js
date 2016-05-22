define([
  "./transpose",
  "./size",
  "../mType/HandleType"
], function (transpose, size, HandleType) {

  function scatter() {
    
    var args = Array.prototype.slice.call(arguments, 0);
    
    var data = [];
    var opts = null;
    var pp = null;
    if(args[0].type && args[0].type == "HANDLE"){
      pp = args.shift();
      data = pp.context.data;
      opts = pp.context.opts;
    }

    var callback = args[args.length - 1];

    var x = args[0];
    var y = args[1];
    
    var a = 3; 
    if(typeof args[2] !== "function" && typeof args[2] !== "undefined"){
      a = (args[2][0][0] / 36) * 3;
    }
    var c = null;
    if(typeof args[3] !== "function" && typeof args[3] !== "undefined"){
      c = args[3][0].join("");
    }

    var line, obj;
    var i, j, k;

    if (size(x)[0][0] == 1) {
      x = transpose(x);
    }

    if (typeof y == "function") {
      y = x;
      x = [];
      for (j = 0; j < y.length; j++) {
        x.push([j + 1]);
      }
    }

    if (size(y)[0][0] == 1) {
      y = transpose(y);
    }

    if (size(x)[0][0] != size(y)[0][0]) {
      y = transpose(y);
    }

    try {
      // if they are vectors
      if (size(x)[0][0] == size(y)[0][0]) {
        if (size(x)[0][1] == 1) {
          for (k = 0; k < y[0].length; k++) {
            line = [];
            for (i = 0; i < x.length; i++) {
              line.push([x[i][0], y[i][k]]);
            }
            obj = {data: line};
            obj.lines = {
              show: false
            };
            obj.points = {
              show: true,
              symbol: "circle",
              radius : a,
            };
            if(c !== null){
              obj.color = c;
            }
            data.push(obj);
          }
        } 
        // else if (size(x)[0][1] == size(y)[0][1]) {
//           for (k = 0; k < y[0].length; k++) {
//             line = [];
//             for (i = 0; i < x.length; i++) {
//               line.push([x[i][k], y[i][k]]);
//             }
//             obj = {data: line};
//             if (y[0].length > 1) {
//               obj.label = k.toString();
//             }
//             data.push(obj);
//           }
//         }
        else {
          throw ("Only vector inputs of the same length are accepted.");
        }
      } else {
        throw ("vectors are of different lengths");
      }
      
      // apply the labels
      if(data.length > 1){
        for(i = 0; i < data.length; i++){
          if(typeof data[i].label === "undefined"){
            data[i].label = i.toString();
          }
        }
      }

      if(pp !== null){
        this.parser.controller.output.editPlot(pp.id, data, opts, function (err, id) {
          callback(err, null);
        });
      }else{
        this.parser.controller.output.createPlot(data, opts, function (err, id) {
          var h = new HandleType(id, "plot", {data: data, opts: opts});
          callback(err, h);
        });
      }
    } catch (ex) {
      callback("Plot Error :: " + ex);
    }
  }

  scatter.async = true;

  scatter.shortHelp = "Scatter plot of the input vectors.";
	scatter.help = "# scatter(X, Y) \n \
Plots the vectors X vs. Y using a scatter plot.\n\n\
## Syntax\n\
```\n\
pp = scatter(X, Y);\n\
pp = scatter(X, Y, a);\n\
pp = scatter(X, Y, a, c);\n\
```\n\n\
## Description \n\
Creates a scatter plot of the specified data.  The input `X` vector and `Y` vector give the `(x, y)` coordinates of the\
data points to be plotted.\n\n\
### Inputs\n\
- `X` -- x-coordinates of the input data. \n\
- `Y` -- y-coordinates of the input data. \n\
- `a` -- (default 36) size of the points. \n\
- `c` -- color of the points. \n\n\
### Outputs\n\
This is a single output function:\n\n\
- `pp` -- the pointer to the plot to be used for additional plot commands. \n\n\
## Examples\n\
\n\n\
## References\n\n\
\n";

  return scatter;

});
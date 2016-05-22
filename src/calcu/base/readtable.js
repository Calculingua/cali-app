define([
  "../mType/TableType",
  "../mType/CellArrayType", 
  "jQuery.parse"], function (TableType, CellArray, $) {
      
      function formatVariableName(input){
          var out = input.replace(/^\s+|\s+$/g, "");
          out = out.replace(/\s/g, "_");
          return out;
      }

  function readtable() {

    var i, k;
    var callback = arguments[arguments.length - 1];
    var fname = arguments[0][0].join("");

    var opts = {
      ReadVariableNames: true,
      ReadRowNames: false,
    };

    for (i = 1; i < arguments.length - 1; i += 2) {
      opts[arguments[i][0].join("")] = arguments[i + 1][0][0];
    }

    this.parser.model.file.readFile(fname, function (err, text) {
      if (err) return callback("Error reading file :: " + fname);

      var delimiter = " ";
      if (fname.split(".")[fname.split(".").length - 1] == "csv") {
        delimiter = ",";
      }
      var parsed = $.parse(text, {
        delimiter: delimiter,
        header: false,
        dynamicTyping: true
      });
      var obj = {
        data: [],
        properties: {
          VariableNames: [],
          RowNames: []
        }
      };
      if (opts.ReadVariableNames) {
          obj.properties.VariableNames = [];
          var names = parsed.results.shift();
          for(i = 0; i < names.length; i++){
              obj.properties.VariableNames.push(formatVariableName(names[i]));
          }
      }

      var data = [];
      var type = [];
      for (i = 0; i < parsed.results[0].length; i++) {
        data.push([]);
        type.push("MATRIX");
      }

      for (k = 0; k < parsed.results.length; k++) {
        if (opts.ReadRowNames) {
          obj.properties.RowNames.push(parsed.results[k][0]);
        }
        for (i = 0; i < data.length; i++) {
          data[i].push([parsed.results[k][i]]);
          if (typeof data[i][k][0] === "string") {
            type[i] = "CELL_ARRAY";
          }
        }
      }
      for (i = 0; i < type.length; i++) {
        if (type[i] == "CELL_ARRAY") {
          for (k = 0; k < data[i].length; k++) {
            data[i][k] = [
              [data[i][k].toString().split("")]
            ];
          }
          data[i] = new CellArray(data[i]);
        }
      }
      obj.data = data;

      var out = new TableType(obj);
      // var out = csv.results;
      callback(null, out);
    });
  }

  readtable.async = true;

  readtable.shortHelp = "Imports a comma separated value file into a table variable.";
  readtable.help = "# readtable('fname', 'OptName', optValue) \n \
readtable('fname.csv') Imports a comma separated value file into a table variable.  By default it uses the first row for names of the columns. \n\n\
readtable('fname.csv', 'ReadVariableNames', 0) Imports the file, but does not use the first row as names.\n\n\
readtable('fname.csv', 'ReadRowNames', 1) Imports the file, and uses the first column as the row names. \n\n";


  return readtable;

});
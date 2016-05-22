define([
  "async",
  "cali-calcu/base/size",
  "../dev/Matchers",
  "$J",
  "cali-calcu/CommandParser",
  "cali-calcu/base/rand",
  "sinon"
], function (async, size, Matchers, $J, CommandParser, rand,sinon) {


  $J.describe("cali.module.base.readtable(fname)", function () {

    function MockModel() {
      this.file = {
        readFile: function (fname, callback) {
          callback(null)
        }
      };
    }

    // setup the environment
    var parser = null;
    var model = null;
    beforeEach(function () {
      model = new MockModel();
      parser = new CommandParser(null, model);
    });

    $J.describe("when fname is a csv file:", function () {

      it("should parse the file with specified parameters", function (done) {
        var txt;

        sinon.stub(model.file, "readFile", function (fname, callback) {
          callback(null, txt);
        });

        var inputs = [
          {
            txt: "butts,heads,tails\n1,2,3\n6,7,8\n11, 12, 13",
            cmd: "x = readtable('./butts.csv')",
          },
          {
            txt: "butts,heads,tails\n1,hello,3\n6,there,8\n11, billstron, 13",
            cmd: "x = readtable('./butts.csv')",
          },
          {
            txt: "1,2,3\n6,7,8\n11, 12, 13",
            cmd: "x = readtable('./butts.csv', 'ReadVariableNames', 0)"
          },
          {
            txt: "1,hello,3\n6,there,8\n11, billstron, 13",
            cmd: "x = readtable('./butts.csv', 'ReadVariableNames', 0)"
          },
          {
            txt: "butts,heads,tails\nhello,1,2\nthere,6,7\n billstron,11, 12",
            cmd: "x = readtable('./butts.csv', 'ReadVariableNames', 1)"
          },
          {
            txt: "butts,heads,tails\nhello,1,2\nthere,6,7\n billstron,11, 12",
            cmd: "x = readtable('./butts.csv', 'ReadVariableNames', 1, 'ReadRowNames', 1)"
          },
          {
            txt: "butts,heads,tails\n1,2,3\n6,7,8\n11, 12, 13",
            cmd: "x = readtable('./butts.csv', 'ReadRowNames', 1)",
          },
          {
            txt: "butts,heads,tails,ass\n1,2,3, 4\n6,7,8, 9\n11, 12, 13, 13",
            cmd: "x = readtable('./butts.csv')",
          },
          {
            txt: "butts,heads\n1,2\n6,7\n11, 12",
            cmd: "x = readtable('./butts.csv')",
          },
          {
            txt: "butts,heads\n1,2\n6,7\n11, 12\n22, 24\n",
            cmd: "x = readtable('./butts.csv')",
          },
          {
            txt: "butts,heads\n1,2\n6,7\n11, 12\n22, 24",
            cmd: "x = readtable('./butts.csv')",
          },
          {
            txt: "butts 1,heads 1\n1,2\n6,7\n11, 12\n22, 24",
            cmd: "x = readtable('./butts.csv')",
          },
          {
            txt: " butts 1, heads 1\n1,2\n6,7\n11, 12\n22, 24",
            cmd: "x = readtable('./butts.csv')",
          },
        ];


        var outs = [
          {  properties: {
            VariableNames: ["butts", "heads", "tails"],
          },
            data: [
              [
                [1],
                [6],
                [11]
              ],
              [
                [2],
                [7],
                [12]
              ],
              [
                [3],
                [8],
                [13]
              ]
            ]
          },
          {
            properties: {
              VariableNames: ["butts", "heads", "tails"],
            },
            data: [
              [
                [1],
                [6],
                [11]
              ],
              [
                [
                  ["hello".split("")]
                ],
                [
                  ["there".split("")]
                ],
                [
                  [" billstron".split("")]
                ]
              ],
              [
                [3],
                [8],
                [13]
              ]
            ]
          },
          {
            properties: {
              VariableNames: ["Var1", "Var2", "Var3"],
            },
            data: [
              [
                [1],
                [6],
                [11]
              ],
              [
                [2],
                [7],
                [12]
              ],
              [
                [3],
                [8],
                [13]
              ]
            ]
          },
          {
            properties: {
              VariableNames: ["Var1", "Var2", "Var3"],
            },
            data: [
              [
                [1],
                [6],
                [11]
              ],
              [
                [
                  ["hello".split("")]
                ],
                [
                  ["there".split("")]
                ],
                [
                  [" billstron".split("")]
                ]
              ],
              [
                [3],
                [8],
                [13]
              ]
            ]
          },
          {  properties: {
            VariableNames: ["butts", "heads", "tails"],
          },
            data: [
              [
                [
                  ["hello".split("")]
                ],
                [
                  ["there".split("")]
                ],
                [
                  [" billstron".split("")]
                ]
              ],
              [
                [1],
                [6],
                [11]
              ],
              [
                [2],
                [7],
                [12]
              ]
            ]
          },
          {  properties: {
            VariableNames: ["butts", "heads", "tails"],
            RowNames: ["hello", "there", " billstron"]
          },
            data: [
              [
                [
                  ["hello".split("")]
                ],
                [
                  ["there".split("")]
                ],
                [
                  [" billstron".split("")]
                ]
              ],
              [
                [1],
                [6],
                [11]
              ],
              [
                [2],
                [7],
                [12]
              ]
            ]
          },
          {  properties: {
            VariableNames: ["butts", "heads", "tails"],
            RowNames: [1, 6, 11]
          },
            data: [
              [
                [1],
                [6],
                [11]
              ],
              [
                [2],
                [7],
                [12]
              ],
              [
                [3],
                [8],
                [13]
              ]
            ]
          },

          {  properties: {
            VariableNames: ["butts", "heads", "tails", "ass"],
          },
            data: [
              [
                [1],
                [6],
                [11]
              ],
              [
                [2],
                [7],
                [12]
              ],
              [
                [3],
                [8],
                [13]
              ],
              [
                [4],
                [9],
                [13]
              ]
            ]
          },
          {  properties: {
            VariableNames: ["butts", "heads"],
          },
            data: [
              [
                [1],
                [6],
                [11]
              ],
              [
                [2],
                [7],
                [12]
              ]
            ]
          },
          {  properties: {
            VariableNames: ["butts", "heads"],
          },
            data: [
              [
                [1],
                [6],
                [11],
                [22]
              ],
              [
                [2],
                [7],
                [12],
                [24]
              ]
            ]
          },
          {
            properties: {
               VariableNames: ["butts", "heads"],
            },
            data: [
              [
                [1],
                [6],
                [11],
                [22]
              ],
              [
                [2],
                [7],
                [12],
                [24]
              ]
            ]
          },
          {
            properties: {
               VariableNames: ["butts_1", "heads_1"],
            },
            data: [
              [
                [1],
                [6],
                [11],
                [22]
              ],
              [
                [2],
                [7],
                [12],
                [24]
              ]
            ]
          },
          {
            properties: {
               VariableNames: ["butts_1", "heads_1"],
            },
            data: [
              [
                [1],
                [6],
                [11],
                [22]
              ],
              [
                [2],
                [7],
                [12],
                [24]
              ]
            ]
          },
        ];


        async.mapSeries(inputs, function (item, callback) {
          txt = item.txt;
          parser.evaluate(item.cmd, callback);

        }, function (err, results) {
          expect(err).toBeFalsy();
          for (var i = 0; i < results.length; i++) {
            expect(results[i][0].name).toEqual("x");
            for (var j = 0; j < results[i][0].ans.data.length; j++) {
              for (var k = 0; k < results[i][0].ans.data[j].length; k++) {
                expect(results[i][0].ans.data[j][k]).toEqual(outs[i].data[j][k]);
              }

            }

            for (var key in outs[i].properties) {
              expect(results[i][0].ans.properties[key]).toEqual(outs[i].properties[key]);
            }
          }
          model.file.readFile.restore();
          done();
        });
      });

    });
  });

});



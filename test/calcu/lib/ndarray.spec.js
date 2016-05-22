define([
    "cali-calcu/util",
    "$J",
  "cali-calcu/lib/NdArray",
  "cali-calcu/lib/NumericNdArray",
], function (util, $J, NdArray, NumericNdArray) {

    $J.describe("IndexCursor Helper object", function() {
        $J.it("creates a full-range, 3d index cursor", function() {
            var cur = new NdArray.IndexCursor([3,3,3]);
            $J.expect(cur.ranges).toBeTruthy();
            $J.expect(cur.ranges[0]).toEqual({start:0, end:3});
        });

        $J.it("iterates forward", function() {
            var cur = new NdArray.IndexCursor([3,3,3]);
            $J.expect(cur.next()).toEqual([0,0,0]);
            $J.expect(cur.next()).toEqual([0,0,1]);
            $J.expect(cur.next()).toEqual([0,0,2]);
            $J.expect(cur.next()).toEqual([0,1,0]);
            $J.expect(cur.next()).toEqual([0,1,1]);
            $J.expect(cur.next()).toEqual([0,1,2]);
            $J.expect(cur.next()).toEqual([0,2,0]);
            $J.expect(cur.next()).toEqual([0,2,1]);
            $J.expect(cur.next()).toEqual([0,2,2]);
            $J.expect(cur.next()).toEqual([1,0,0]);
            $J.expect(cur.next()).toEqual([1,0,1]);
            $J.expect(cur.next()).toEqual([1,0,2]);
            $J.expect(cur.next()).toEqual([1,1,0]);
            $J.expect(cur.next()).toEqual([1,1,1]);
            $J.expect(cur.next()).toEqual([1,1,2]);
            $J.expect(cur.next()).toEqual([1,2,0]);
            $J.expect(cur.next()).toEqual([1,2,1]);
            $J.expect(cur.next()).toEqual([1,2,2]);
            $J.expect(cur.next()).toEqual([2,0,0]);
            $J.expect(cur.next()).toEqual([2,0,1]);
            $J.expect(cur.next()).toEqual([2,0,2]);
            $J.expect(cur.next()).toEqual([2,1,0]);
            $J.expect(cur.next()).toEqual([2,1,1]);
            $J.expect(cur.next()).toEqual([2,1,2]);
            $J.expect(cur.next()).toEqual([2,2,0]);
            $J.expect(cur.next()).toEqual([2,2,1]);
            $J.expect(cur.next()).toEqual([2,2,2]);
        });

        $J.it("iterates backwards", function() {
            var cur = new NdArray.IndexCursor([3,3,3]);
            cur.reset(true);
            $J.expect(cur.next()).toEqual([0,0,0]);
            $J.expect(cur.next()).toEqual([1,0,0]);
            $J.expect(cur.next()).toEqual([2,0,0]);
            $J.expect(cur.next()).toEqual([0,1,0]);
            $J.expect(cur.next()).toEqual([1,1,0]);
            $J.expect(cur.next()).toEqual([2,1,0]);
            $J.expect(cur.next()).toEqual([0,2,0]);
            $J.expect(cur.next()).toEqual([1,2,0]);
            $J.expect(cur.next()).toEqual([2,2,0]);
            $J.expect(cur.next()).toEqual([0,0,1]);
            $J.expect(cur.next()).toEqual([1,0,1]);
            $J.expect(cur.next()).toEqual([2,0,1]);
            $J.expect(cur.next()).toEqual([0,1,1]);
            $J.expect(cur.next()).toEqual([1,1,1]);
            $J.expect(cur.next()).toEqual([2,1,1]);
            $J.expect(cur.next()).toEqual([0,2,1]);
            $J.expect(cur.next()).toEqual([1,2,1]);
            $J.expect(cur.next()).toEqual([2,2,1]);
            $J.expect(cur.next()).toEqual([0,0,2]);
            $J.expect(cur.next()).toEqual([1,0,2]);
            $J.expect(cur.next()).toEqual([2,0,2]);
            $J.expect(cur.next()).toEqual([0,1,2]);
            $J.expect(cur.next()).toEqual([1,1,2]);
            $J.expect(cur.next()).toEqual([2,1,2]);
            $J.expect(cur.next()).toEqual([0,2,2]);
            $J.expect(cur.next()).toEqual([1,2,2]);
            $J.expect(cur.next()).toEqual([2,2,2]);
        });

        $J.it("gives a diff", function() {
            var cur = new NdArray.IndexCursor([2,2]);
            $J.expect(cur.nextDiff()).toEqual([0,0]);
            $J.expect(cur.nextDiff()).toEqual([0,1]);
            $J.expect(cur.nextDiff()).toEqual([1,-1]);
            $J.expect(cur.nextDiff()).toEqual([0,1]);
        });
    });

  $J.describe("NdArray Type Class", function () {

    $J.describe("creating an array by inferring shape", function () {
      $J.it("should create a 1d array", function () {
        var M1 = new NdArray([2, 3]);
        $J.expect(M1).toBeTruthy();
        $J.expect(M1.shape).toEqual([2]);
      });

      $J.it("should create a 2d array", function () {
        var M = new NdArray([
          [1, 2],
          [3, 4]
        ]);
        $J.expect(M).toBeTruthy();
        $J.expect(M.shape).toEqual([2, 2]);
      });

      $J.it("should create a 3d array", function () {
        var M = new NdArray([
          [
            [1, 2, 3],
            [4, 5, 6]
          ],
          [
            [1, 2, 3],
            [4, 5, 6]
          ],
          [
            [1, 2, 3],
            [4, 5, 6]
          ]
        ]);
        $J.expect(M).toBeTruthy();
        $J.expect(M.shape).toEqual([3, 2, 3]);
      });
    });


    $J.describe("creating an array by specifying a shape", function () {
      $J.it("should create a 1d array", function () {
        var M = new NdArray([1, 2, 3, 4], [4]);
        $J.expect(M).toBeTruthy();
        $J.expect(M.shape).toEqual([4]);
      });
      $J.it("should create a 2d array", function () {
        var M = new NdArray([1, 2, 3, 4], [2, 2]);
        $J.expect(M).toBeTruthy();
        $J.expect(M.shape).toEqual([2, 2]);
      });
      $J.it("should create a 3d array", function () {
        var M = new NdArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2], [2, 3, 2]);
        $J.expect(M).toBeTruthy();
        $J.expect(M.shape).toEqual([2, 3, 2]);
      });

      $J.it("should not error when mixing declaration types", function () {
        function test() {
          var M1 = new NdArray([
            [1, 2],
            [3, 4]
          ], [2, 2]);
        }

        $J.expect(test).not.toThrow();
      });

    });

    $J.describe("creating arrays based on other Arrays", function () {
      var M;
      $J.beforeEach(function () {
        M = new NdArray([
          [1, 2, 3],
          [4, 5, 6]
        ]);
      });

      $J.it("should use the same data", function () {
        var M2 = new NdArray(M);
        for (var i = 0; i < M._data.length; i++) {
          $J.expect(M._data[i]).toEqual(M2._data[i]);
        }
        M2.set([0, 0], 9);
        $J.expect(M2._data[0]).toEqual(9);
        $J.expect(M._data[0]).toEqual(9);
      });

      $J.it("should make a copy of an array", function () {
        var M2 = M.copy();
        for (var i = 0; i < M._data.length; i++) {
          $J.expect(M._data[i]).toEqual(M2._data[i]);
        }
        M2.set([0, 0], 9);
        $J.expect(M2._data[0]).toEqual(9);
        $J.expect(M._data[0]).toEqual(1);
      });
    });


    $J.describe("setting the values of a matrix", function () {
      $J.it("should set a matrix linearly", function () {
        var M = new NdArray([1, 2, 3, 4, 5, 6], [2, 3]);
        $J.expect(M._data[0]).toEqual(1);
        $J.expect(M._data[1]).toEqual(2);
        $J.expect(M._data[2]).toEqual(3);
        $J.expect(M._data[3]).toEqual(4);
        $J.expect(M._data[4]).toEqual(5);
        $J.expect(M._data[5]).toEqual(6);
      });

      $J.it("should set an array of arrays", function () {
        var M = new NdArray([
          [1, 2, 3],
          [4, 5, 6]
        ], [2, 3]);
        $J.expect(M._data[0]).toEqual(1);
        $J.expect(M._data[1]).toEqual(2);
        $J.expect(M._data[2]).toEqual(3);
        $J.expect(M._data[3]).toEqual(4);
        $J.expect(M._data[4]).toEqual(5);
        $J.expect(M._data[5]).toEqual(6);
      });

      $J.it("should set a 3d array of arrays", function () {
        var M = new NdArray([
          [
            [1, 2, 3],
            [4, 5, 6]
          ],
          [
            [7, 8, 9],
            [0, 1, 2]
          ]
        ], [2, 2, 3]);
        $J.expect(M._data[0]).toEqual(1);
        $J.expect(M._data[1]).toEqual(2);
        $J.expect(M._data[2]).toEqual(3);
        $J.expect(M._data[3]).toEqual(4);
        $J.expect(M._data[4]).toEqual(5);
        $J.expect(M._data[5]).toEqual(6);
        $J.expect(M._data[6]).toEqual(7);
        $J.expect(M._data[7]).toEqual(8);
        $J.expect(M._data[8]).toEqual(9);
        $J.expect(M._data[9]).toEqual(0);
        $J.expect(M._data[10]).toEqual(1);
        $J.expect(M._data[11]).toEqual(2);
      });

      $J.it("should base a matrix on another matrix", function () {
        var m1 = new NdArray([
          [1, 2, 3],
          [4, 5, 6]
        ], [2, 3]);
        var m2 = new NdArray(m1, [2, 3]);
        $J.expect(m1).toEqual(m2);
      })
    });


    describe("comparing matrices", function () {
      it("should return true for the same matrix", function () {
        var m1 = new NdArray([1, 2, 3, 4], [2, 2]);
        var m2 = new NdArray(m1, [2, 2]);
        expect(m1.equals(m2)).toBeTruthy();
      });

      it("should return false for different matrices", function () {
        var m1 = new NdArray([1, 2, 3, 4], [2, 2]);
        var m2 = new NdArray(m1, [2, 1]);
        var m3 = new NdArray([1, 1, 1, 1], [2, 2]);
        expect(m1.equals(m2)).toBeFalsy();
        expect(m1.equals(m3)).toBeFalsy();
      });
    });

    // describe("getting and setting values")

    $J.describe("getting a sub matrix", function () {
      $J.it("should return a submatrix of a 2d matrix", function () {
        var M = new NdArray([1, 2, 3, 4, 5, 6, 7, 8, 9], [3, 3]);
        var m1 = M.sub([0, 0], [1, 1]);
        $J.expect(m1.shape).toEqual([2, 2]);
        $J.expect(m1.get([0, 0])).toEqual(1);
        $J.expect(m1.get([0, 1])).toEqual(2);
        $J.expect(m1.get([1, 0])).toEqual(4);
        $J.expect(m1.get([1, 1])).toEqual(5);

        var m2 = M.sub([1, 1], [2, 2]);
        $J.expect(m2.shape).toEqual([2, 2]);
        $J.expect(m2.get([0, 0])).toEqual(5);
        $J.expect(m2.get([0, 1])).toEqual(6);
        $J.expect(m2.get([1, 0])).toEqual(8);
        $J.expect(m2.get([1, 1])).toEqual(9);

        var m3 = M.sub([1, 0], [2, 2]);
        $J.expect(m3.shape).toEqual([2, 3]);
        $J.expect(m3.get([0, 0])).toEqual(4);
        $J.expect(m3.get([0, 1])).toEqual(5);
        $J.expect(m3.get([0, 2])).toEqual(6);
        $J.expect(m3.get([1, 0])).toEqual(7);
        $J.expect(m3.get([1, 1])).toEqual(8);
        $J.expect(m3.get([1, 2])).toEqual(9);
      })
    });

    $J.describe("slicing a matrix", function () {
      $J.it("should return the first row of a 2d matrix", function () {
        var m = new NdArray([1, 2, 3, 4, 5, 6], [2, 3]);
        var ms = m.slice([0, null]);
        $J.expect(ms.shape).toEqual([3]);
        $J.expect(ms.get([0])).toEqual(1);
        $J.expect(ms.get([1])).toEqual(2);
        $J.expect(ms.get([2])).toEqual(3);
      });

      $J.it("should return the first column of a 2d matrix", function () {
        var m = new NdArray([1, 2, 3, 4, 5, 6], [2, 3]);
        var ms = m.slice([null, 0]);
        $J.expect(ms.shape).toEqual([2]);
        $J.expect(ms.get([0])).toEqual(1);
        $J.expect(ms.get([1])).toEqual(4);
      });

      $J.it("should return the second column of a 2d matrix", function () {
        var m = new NdArray([1, 2, 3, 4, 5, 6], [2, 3]);
        var ms = m.slice([null, 1]);
        $J.expect(ms.shape).toEqual([2]);
        $J.expect(ms.get([0])).toEqual(2);
        $J.expect(ms.get([1])).toEqual(5);
      });

      $J.it("should use the same data as the original array", function () {
        var m = new NdArray([
          [1, 2, 3],
          [4, 5, 6]
        ]);
        var r1 = m.slice([0, null]);
        r1.set([0], 9);
        $J.expect(m.get([0, 0])).toEqual(9);
      });
    });


    $J.describe("iterating over dimensions", function () {
      $J.it("should iterate each element of a simple array", function () {
        var a = [
          [1, 2, 3],
          [4, 5, 6]
        ];
        var m = new NdArray(a);
        var i = 0;
        var output = [1, 2, 3, 4, 5, 6];
        var idxs = [
          [0, 0],
          [0, 1],
          [0, 2],
          [1, 0],
          [1, 1],
          [1, 2]
        ];
        m.forEach(function (item, idx) {
          $J.expect(item).toEqual(output[i]);
          $J.expect(idx).toEqual(idxs[i]);
          i++;
        });
      });

      $J.it("should iterate over non-standard stride", function () {
        var a = [1, 2, 3, 4, 5, 6, 7, 8];
        var m = new NdArray(a, [2, 2], [4, 2]);
        var i = 0;
        var output = [1, 3, 5, 7];
        var idxs = [
          [0, 0],
          [0, 1],
          [1, 0],
          [1, 1]
        ];
        m.forEach(function (item, idx) {
          $J.expect(item).toEqual(output[i]);
          $J.expect(idx).toEqual(idxs[i]);
          i++;
        });
      });

      $J.it("should iterate over non-standard stride with offset", function () {
        var a = [1, 2, 3, 4, 5, 6, 7, 8];
        var m = new NdArray(a, [2, 2], [4, 2], 1);
        var i = 0;
        var output = [2, 4, 6, 8];
        var idxs = [
          [0, 0],
          [0, 1],
          [1, 0],
          [1, 1]
        ];
        m.forEach(function (item, idx) {
          $J.expect(item).toEqual(output[i]);
          $J.expect(idx).toEqual(idxs[i]);
          i++;
        });
      });

      $J.it("should iterate over a 3d array", function () {
        var a = [1, 2, 3, 4, 5, 6, 7, 8];
        var ans = [1, 2, 3, 4, 5, 6, 7, 8];
        var m = new NdArray(a, [2, 2, 2]);
        var i = 0;
        var idxs = [
          [0, 0, 0],
          [0, 0, 1],
          [0, 1, 0],
          [0, 1, 1],
          [1, 0, 0],
          [1, 0, 1],
          [1, 1, 0],
          [1, 1, 1]
        ];
        m.forEach(function (item, idx) {
          $J.expect(item).toEqual(ans[i]);
          $J.expect(idx).toEqual(idxs[i]);
          i++;
        });
      });

      $J.it("should iterate over the rows", function () {
        var a = [
          [1, 2, 3],
          [4, 5, 6]
        ];
        var m = new NdArray(a);
        var i = 0;
        m.forEach(0, function (row, idx) {
          $J.expect(row.toArray()).toEqual(a[i]);
          $J.expect(idx).toEqual(i);
          i++;
        });
      });

      $J.it("should iterate over the columns", function () {
        var a = [
          [1, 2, 3],
          [4, 5, 6]
        ];
        var m = new NdArray(a);
        var i = 0;
        var out = [
          [1, 4],
          [2, 5],
          [3, 6]
        ];
        m.forEach(1, function (col, idx) {
          $J.expect(col.toArray()).toEqual(out[i]);
          $J.expect(idx).toEqual(i);
          i++;
        });
      });
    });


    $J.describe("summing elements of array", function () {
      $J.it("should sum a 1d array", function () {
        var m = new NumericNdArray([1, 2, 3, 4]);
        $J.expect(m.sum()).toEqual(10);
      });


      $J.it("should sum a 2d array", function () {
        var m = new NumericNdArray([
          [1, 2],
          [3, 4]
        ]);
        $J.expect(m.sum()).toEqual(10);
      });


      $J.it("should sum a 3d array", function () {
        var m = new NumericNdArray([
          [
            [1, 2],
            [3, 4]
          ],
          [
            [1, 2],
            [3, 4]
          ]
        ]);
        $J.expect(m.sum()).toEqual(20);
      });

    });


    $J.describe("converting matrix to regular nested array", function () {
        $J.it("should convert a 1d NdArray to an array", function() {
            var m = new NdArray([1,2,3,4], [4]);
            $J.expect(m.toArray()).toEqual([1,2,3,4]);
        });

        $J.it("should convert a 2d matrix to an array", function () {
          var m = new NdArray([1, 2, 3, 4, 5, 6], [2, 3]);
          var a = m.toArray();
          $J.expect(a).toEqual([
            [1, 2, 3],
            [4, 5, 6]
          ]);
        });
    });


    $J.describe("pretty printing a matrix", function () {
      $J.it("should return a nively formatted string", function () {
        var m = new NdArray([1, 2, 3, 4, 5, 6], [2, 3]);
        var output = [
          '[[           1,           2,           3],',
          ' [           4,           5,           6]]'
        ].join('\n');
        $J.expect(m.print()).toEqual(output);
      });
    });


    $J.describe("indexing a matrix", function () {
      $J.it("should index a 2x3 matrix", function () {
        var M = new NdArray([
          [1, 2, 3],
          [4, 5, 6]
        ], [2, 3]);
        $J.expect(M.get([0, 0])).toEqual(1);
        $J.expect(M.get([0, 1])).toEqual(2);
        $J.expect(M.get([0, 2])).toEqual(3);
        $J.expect(M.get([1, 0])).toEqual(4);
        $J.expect(M.get([1, 1])).toEqual(5);
        $J.expect(M.get([1, 2])).toEqual(6);
      });

      $J.it("should index a 2x2x3 matrix", function () {
        var M = new NdArray([
          [
            [1, 2, 3],
            [4, 5, 6]
          ],
          [
            [7, 8, 9],
            [0, 1, 2]
          ]
        ], [2, 2, 3]);
        $J.expect(M.get([0, 0, 0])).toEqual(1);
        $J.expect(M.get([0, 0, 1])).toEqual(2);
        $J.expect(M.get([0, 0, 2])).toEqual(3);
        $J.expect(M.get([0, 1, 0])).toEqual(4);
        $J.expect(M.get([0, 1, 1])).toEqual(5);
        $J.expect(M.get([0, 1, 2])).toEqual(6);
        $J.expect(M.get([1, 0, 0])).toEqual(7);
        $J.expect(M.get([1, 0, 1])).toEqual(8);
        $J.expect(M.get([1, 0, 2])).toEqual(9);
        $J.expect(M.get([1, 1, 0])).toEqual(0);
        $J.expect(M.get([1, 1, 1])).toEqual(1);
        $J.expect(M.get([1, 1, 2])).toEqual(2);
      })
    });


    $J.describe("multiplying matrices", function () {
      $J.it("should multiply 2 matrices", function () {
        var m1 = new NumericNdArray([1, 2, 3, 4], [2, 2]);
        var m2 = new NumericNdArray([5, 6, 7, 8], [2, 2]);
        var m3 = m1.times(m2);
        $J.expect(m3.get([0, 0])).toEqual(19);
        $J.expect(m3.get([0, 1])).toEqual(22);
        $J.expect(m3.get([1, 0])).toEqual(43);
        $J.expect(m3.get([1, 1])).toEqual(50);
      });

      $J.it("should throw an error when the dimensions are not corrent", function () {
        var m1 = new NumericNdArray([1, 2, 3, 4], [2, 2]);
        var m2 = new NumericNdArray([5, 6, 7, 8, 1, 2], [3, 2]);

        function foo() {
          var m3 = m1.times(m2);
        }

        $J.expect(foo).toThrow();

      });

      $J.it("should throw an error when not multiplying 2d matrices", function () {
        var m1 = new NumericNdArray([1, 2, 3, 4, 1, 2, 3, 4], [2, 2, 2]);
        var m2 = new NumericNdArray([5, 6, 7, 8, 1, 2, 3, 4], [2, 2, 2]);

        function foo() {
          var m3 = m1.times(m2);
        }

        $J.expect(foo).toThrow();

      });
    });

    $J.describe("using .set", function () {
      $J.it("should set the values of the array", function () {
        // 5x5
        var m = new NdArray(new Array(25), [5, 5]);
        var r, c, i = 0;
        for (r = 0; r < 5; r++) {
          for (c = 0; c < 5; c++) {
            m.set([r, c], i++)
          }
        }
        i = 0;
        for (r = 0; r < 5; r++) {
          for (c = 0; c < 5; c++) {
            expect(m.get([r, c])).toEqual(i++);
          }
        }
      })
    });


  });

    $J.describe("serialize/deserialize", function () {
        $J.it("should be able to successfully decode and encode (roundtrip", function () {
            var m = new NdArray([1, 2, 3, 4, 1, 2, 3, 4], [2, 2, 2]);
            var data = m.serialize();
            var mcopy = NdArray.deserialize(data);
            $J.expect(m.equals(mcopy)).toEqual(true);
        });
    });

  $J.describe("NdArray static functions", function () {

    $J.describe("inferStride", function () {
      $J.it("should get stride", function () {
          var shp = util.inferShape([
          [1, 2, 3],
          [4, 5, 6]
        ]);
        $J.expect(NdArray.inferStride(shp)).toEqual([3, 1]);
      });
    });
  });

  $J.describe("NumericArray functions", function() {
    $J.it("ElementTimes", function() {
        var m = new NumericNdArray([1,2,3,4,5,6], [2,3]);
        m.elementTimes(2);
        expect(m.toArray()).toEqual([[2,4,6],[8,10,12]]);
    });
  });


  $J.describe("String NdArrays", function() {
    $J.it("creates a 2d string NdArray", function() {
        var m = new NdArray([['a', 'b'],['c','d']]);
        $J.expect(m.get([0,0])).toEqual('a');
        $J.expect(m.get([0,1])).toEqual('b');
        $J.expect(m.get([1,0])).toEqual('c');
        $J.expect(m.get([1,1])).toEqual('d');
    });

    $J.it("creates a 3d string NdArray", function() {
        var a = 'a b c d e f g h'.split(' ');
        var m = new NdArray(a, [2,2,2]);
        $J.expect(m.get([0,0,0])).toEqual('a');
        $J.expect(m.get([0,0,1])).toEqual('b');
        $J.expect(m.get([0,1,0])).toEqual('c');
        $J.expect(m.get([0,1,1])).toEqual('d');
        $J.expect(m.get([1,0,0])).toEqual('e');
        $J.expect(m.get([1,0,1])).toEqual('f');
        $J.expect(m.get([1,1,0])).toEqual('g');
        $J.expect(m.get([1,1,1])).toEqual('h');
    });
  });

});;

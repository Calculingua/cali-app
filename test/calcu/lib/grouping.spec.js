define([
  "$J",
  "cali-calcu/lib/grouping"
], function ($J, grouping) {

  $J.describe("Grouping functions", function () {

    $J.describe("grp2idx", function() {

        $J.it("indexes a grouping variable of numbers", function() {
            var g = [5,4,4,7,6,5,6,4,7,7];
            var o = [1,0,0,3,2,1,2,0,3,3];
            var i = grouping.grp2idx(g);
            $J.expect(o).toEqual(i);
        });

        $J.it("indexes a grouping variable of strings", function() {
            var g = ['b','a','a','d','c','b','c','a','d','d'];
            var o = [1,0,0,3,2,1,2,0,3,3];
            var i = grouping.grp2idx(g);
            $J.expect(o).toEqual(i);
        });



    });

    $J.describe("grp2matrix", function() {
        $J.it("does not allow values and grp to be of different lengths", function() {
            var vals = [1,2,3];
            var grp = [0,1];
            $J.expect(function() {
                grouping.grp2matrix(vals, grp);
            }).toThrow();
        });

        $J.it("create a matrix from number indexes", function() {
            var vals = [1,1,1,1,2,2,2,2,3,3,3,3];
            var grp = [4,4,4,4,7,7,7,7,9,9,9,9];
            var out = [
                [1,2,3],
                [1,2,3],
                [1,2,3],
                [1,2,3],
            ];
            var mat = grouping.grp2matrix(vals, grp).toArray(); 
            expect(mat).toEqual(out);
        });

        $J.it("create a matrix from mixed number indexes", function() {
            var vals = [1,3,2,2,1,3,3,1,2,2,3,1];
            var grp = [2,6,4,4,2,6,6,2,4,4,6,2];
            var out = [
                [1,2,3],
                [1,2,3],
                [1,2,3],
                [1,2,3],
            ];
            var mat = grouping.grp2matrix(vals, grp).toArray(); 
            expect(mat).toEqual(out);
        });

        $J.it("create a matrix from mixed string indexes", function() {
            var vals = [1,3,2,2,1,3,3,1,2,2,3,1];
            var grp = ['a','c','b','b','a','c','c','a','b','b','c','a'];
            var out = [
                [1,2,3],
                [1,2,3],
                [1,2,3],
                [1,2,3],
            ];
            var mat = grouping.grp2matrix(vals, grp).toArray(); 
            expect(mat).toEqual(out);
        });

        $J.it("requires the matrix to be balanced", function() {
            var vals = [1,3,2,2,1,3,3,1,2,2,3,1,1];
            var grp = ['a','c','b','b','a','c','c','a','b','b','c','a','a'];
            expect(function() {
                grouping.grp2matrix(vals, grp);
            }).toThrow();
        });
    });

    $J.describe("mapIndices", function() {

      $J.it("should get the indices of one vector in another", function() {
            var A = [2,6,5,6,2];
            var B = [6,5,4,3,2,1];
            var idxs = grouping.mapIndex(A, B);
        $J.expect(idxs).toEqual([4,0,1,0,4]);
        });
    });


    $J.describe("unique", function() {


      $J.it("should get unique values from an array", function() {
            var A = [1,2,2,3,3,2,5];
        $J.expect(grouping.unique(A)).toEqual([1,2,3,5]);
        });
    });


    $J.describe("crosstab", function() {

      $J.it("creates a 2d crosstab table from categorical data", function() {
            var x = [1, 1, 2, 3, 1];
            var y = [1, 2, 5, 3, 1];
            var output =    [[2, 1, 0, 0],
                             [0, 0, 0, 1],
                             [0, 0, 1, 0]];
            var tab = grouping.crosstab(x,y);
            $J.expect(tab.toArray()).toEqual(output);
        });
    });
  });

});
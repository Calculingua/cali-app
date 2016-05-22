define([
    "cali-calcu/util",
    "$J"
], function (util, $J) {


    $J.describe("calcu.util", function () {
        $J.describe("inferShape", function () {
            $J.it("infers the shape of a 1d matrix", function () {
                var m = [1, 2, 3, 4];
                $J.expect(util.inferShape(m)).toEqual([4]);
            });

            $J.it("infers the shape of a 2d matrix", function () {
                var m = [
                    [1, 2],
                    [3, 4]
                ];
                $J.expect(util.inferShape(m)).toEqual([2, 2]);
            });
            $J.it("infers the shape of a 3d matrix", function () {
                var m = [
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
                ];
                $J.expect(util.inferShape(m)).toEqual([3, 2, 3]);
            });
            $J.it("infers the shape of a 4d matrix", function () {
                var m = [
                    [
                        [
                            [1, 2],
                            [3, 4]
                        ],
                        [
                            [1, 2],
                            [3, 4]
                        ]
                    ],
                    [
                        [
                            [1, 2],
                            [3, 4]
                        ],
                        [
                            [1, 2],
                            [3, 4]
                        ]
                    ]
                ];
                $J.expect(util.inferShape(m)).toEqual([2, 2, 2, 2]);
            });
        });
    });
});
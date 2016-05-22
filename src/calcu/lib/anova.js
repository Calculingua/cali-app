define([
    './distributions',
    ], 
    function(dist) {

        /**
         * Balanced, One-Way ANOVA
         * 
         * Balanced means that each group has the same number of samples
         * One-way means that there is only one factor being tested
         * 
         * @param  {Matrix} X Matrix where columns represent groups
         * @return {AnovaObj}   Object representing results of ANOVA procedure
         */
        function anova1(X) {
            var SStemp;

            // I. Population and group means
            var mean = X.sum() / X.length;
            var groupMeans = [];
            X.cols().forEach(function(col) {
                groupMeans.push(col.sum() / col.length);
            });

            // II. Calculate the pooled "within groups" sum of squares
            var SSw = 0;
            var DFw = X.length - X.shape[1];
            var groupSS = [];
            X.cols().forEach(function(group, idx) {
                SStemp = 0;
                group.forEach(function(sample) {
                    SStemp += Math.pow(sample-groupMeans[idx],2);
                });
                groupSS.push(SStemp);
                SSw += SStemp;
            });

            // III. Calculate the "between groups" sum of squares
            var n = X.shape[0];
            var SSbg = groupMeans.reduce(function(SS, grMean) {
                SS += n * Math.pow(grMean-mean,2);
                return SS;
            }, 0);
            var DFbg = X.shape[1] - 1;

            var sw = SSw / DFw;
            var sbg = SSbg / DFbg;

            var fStat = sbg / sw;
            var pVal = 1 - dist.centralF.cdf(fStat, DFbg, DFw);

            return {
                p: pVal,
                fStat: fStat
            };

        }

    return {
        anova1: anova1,
    };
});
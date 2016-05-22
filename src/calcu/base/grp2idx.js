define(["./size", "./transpose", "./unique"], function(size, transpose, unique){
    
    function grp2idx(S, callback) {
        var i, out = {};
        var sortVal = false;
        // S is a grouping variable, so first make sure that S is one of the following types:
        // Numeric vector
        // Logical vector
        // Cell array of strings
        // Categorical vector
        var sz = size(S);
        var dim = (sz[0][0] === 1 && sz[0][1] >= 1) ? 2 /*column*/ : (sz[0][0] >= 1 && sz[0][1] === 1) ? 1 /*row*/ : null;
        if (!dim) {
            return callback(new Error("Argument Error :: GRP2IDX : S must be a vector, not a matrix"));
        } else if (dim === 1) {
            S = transpose(S);
        }

        // G is an array of indexes where GN[G[i]] = S[i]
        // GN is a sorted array of unique values of S
        // GL is confusing and hard 
        unique(S, function(err, GN, ia, G) {
            callback(null, G, GN);
        });
    }
    grp2idx.async = true;
	
	grp2idx.shortHelp = "Creates an index vector G from the grouping variable S.";
    grp2idx.help = "# [G,GN]=grp2idx(S) \n \
Creates an index vector G from the grouping variable S. S can be a categorical, numeric, or logical vector; \n \
a cell vector of strings; or a character matrix with each row representing a group label. The result G is a \n \
vector taking integer values from 1 up to the number K of distinct groups. GN is a cell array of strings \n \
representing group labels. GN(G) reproduces S (aside from any differences in type).\n\n \
# [G,GN,GL] = grp2idx(S) \n \
Returns a column vector GL representing the group levels. The set of groups and their order in GL and GN are the \n \
same, except that GL has the same type as S. If S is a character matrix, GL(G,:) reproduces S, otherwise GL(G) reproduces S.\n\n";

    return grp2idx;
});
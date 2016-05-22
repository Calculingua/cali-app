define([
  "cali-calcu/base/baseFunctions",
  "cali-calcu/interpreter/mNative/nativeFunctions",
  "lunr"
], function (baseFunctions, nativeFunctions, lunr) {

  function SearchService($http) {
    var url = '/app/search';



    var func;
    var allFuncs = {};
    for (func in baseFunctions) {
      allFuncs[func] = baseFunctions[func];
    }

    for (func in nativeFunctions) {
      allFuncs[func] = nativeFunctions[func];
    }


    var index = lunr(function() {
        this.field('fnName', {boost: 10});
        this.field('shortHelp', {boost: 5});
        this.field('help');
        this.ref('id');
    });

    Object.keys(allFuncs).forEach(function(key) {
        index.add({
            id: key,
            fnName: key,
            shortHelp: allFuncs[key].shortHelp,
            help: allFuncs[key].help
        });
    });

    return {
      findTerm: function (term) {
        var results = index.search(term).map(function(res) {
            var label = res.ref + " - " + allFuncs[res.ref].shortHelp;
            if (label.length > 80) {
                label = label.slice(0, 80);
                label = label.slice(0, label.lastIndexOf(' ')+1) + '...';
            } 
            
            return {
              fnName: res.ref,
              label: label,
              mdShortHelp: allFuncs[res.ref].shortHelp,
              mdHelp: allFuncs[res.ref].help,
              score: res.score,
            };
        });

        return results;
      }
    };
  }

  SearchService.$inject = ['$http'];

  return SearchService;

});
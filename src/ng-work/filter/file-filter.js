define([
  'angular'
], function (angular) {
    
    function Filter(){
        var filt = function(fileList) {
            var out = fileList.sort(function(a, b){
                if(a.isFolder && !b.isFolder){
                    return -1;
                }
                if(!a.isFolder && b.isFolder){
                    return 1;
                }
                if(a.name > b.name){
                    return -1;
                }else{
                    return 1;
                }
            });
            return out;
        };
        return filt;
    }
    
    return Filter;
});
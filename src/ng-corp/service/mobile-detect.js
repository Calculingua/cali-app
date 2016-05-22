define(["mobile-detect"], function(MobileDetect){
    
    function Factory(){
        
        var md = new MobileDetect(window.navigator.userAgent);
        
        return {
            isMobile : function(){
                return md.mobile();
            }
        };
    }
    
    return [Factory];
});
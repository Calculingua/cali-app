define([], function(){
    
    function Model(hopscotch, mobileDetect){
        
        var calloutMgr = hopscotch.getCalloutManager();
        
        var nnDesktop = {
            id: "notebook-notifier",
            target: "create-account",
            title: "Created using Calculingua",
            content: "This page was created using Calculingua.  With an account, you too can publish great looking content. Sign up for a free trial today!",
            placement: "bottom",
            arrowOffset: "center",
            xOffset: -95,
            // xOffset: -150,
            fixedElement: true,
        };
        
        var nnMobile = {
            id: "notebook-notifier",
            target: "menu-button",
            title: "Created using Calculingua",
            content: "This page was created using Calculingua.  With an account, you too can publish great looking content. Sign up for a free trial today!",
            placement: "bottom",
            arrowOffset: 268,
            // xOffset: -95,
            xOffset: -240,
            fixedElement: true,
        };
        
        this.start = function () {
            // Start the tour!
            if(!mobileDetect.isMobile()){
                calloutMgr.createCallout(nnDesktop);
            }else{
                calloutMgr.createCallout(nnMobile);
            }
            
        };
    }
    
    return ["hopscotch", "mobile-detect", Model];
});
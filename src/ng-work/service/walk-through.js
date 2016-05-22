define([
], function () {

  function Service(hopscotch, $rootScope, $timeout, analytics) {

    this.start = function () {
      // var callout = hopscotch.getCalloutManager();
      // callout.createCallout({
      //   id: 'attach-icon',
      //   target: 'wt-start-here',
      //   placement: 'bottom',
      //   title: 'Shutdown Notice',
      //   content: 'Calculingua will be shutting down as of June 13, 2015. All accounts will be deleted and the service will be unavailable after that date.'
      // });

    };
  }

  return ["Hopscotch", "$rootScope", "$timeout", "Analytics", Service];

});

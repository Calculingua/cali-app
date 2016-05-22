define([
  'hopscotch',
  'dropbox'
], function (hopscotch, dropbox) {

  return {
    HopScotch: function () {
      return hopscotch;
    },
    Dropbox: function(){
        return dropbox;
    }
  };

});
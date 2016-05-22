define([], function () {

  function Categorical(obj) {

    this.type = "CATEGORICAL";
    this.data = {};
    this.properties = {};

    var key;
    if (obj) {
      if (obj.data) {
        this.data = obj.data;
      }
      for (key in obj.properties) {
        this.properties[key] = obj.properties[key];
      }
    }
  }

  return Categorical;

});
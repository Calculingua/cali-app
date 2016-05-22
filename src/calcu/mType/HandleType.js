define([], function () {

  function Handle(id, type, context) {
    this.type = "HANDLE";

    this.id = id;
    this.viewType = type;
    this.context = context;
    if (typeof id === "object") {
      this.id = id.id;
      this.viewType = id.viewType;
      this.context = id.context;
    }
  }

  return Handle;

});
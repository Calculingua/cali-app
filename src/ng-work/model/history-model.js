define([
], function() {

  // ## Model
  // This contains an array of individual entries in the history.
  // It also has a name associated with it.
  function Model(name) {
    this.name = name;
    this.items = [];
  }

  // ### insertItem()
  // Put an item into the front of the history array.
  // This new item becomes entry 0 in the array
  Model.prototype.insertItem = function (cmd, ans, callback) {
    var self = this;
    newItem(cmd, ans, function (item) {
      var len = self.items.unshift(item);
      callback(item, len);
    });
  };

  // ### forEachItem()
  // Iterates over the history items with the specified callback.
  // The first item called is the last item added.
  Model.prototype.forEachItem = function (callback) {
    for (var i = 0; i < this.items.length; i++) {
      callback(this.items[i], i);
    }
  };

  // ### getItem()
  // Get's an item by the specified index
  // The 0th index is the last item added
  Model.prototype.getItem = function (i, callback) {
    callback(this.items[i]);
  };

  // ### getLength()
  // Gets the length of the history
  Model.prototype.getLength = function (callback) {
    callback(this.items.length);
  };

  // ### removeAll()
  // Used to clear the history
  Model.prototype.removeAll = function (callback) {
    this.items = [];
    callback(this.items.length);
  };

  // ### removeItem()
  // Allow removing items from the history.
  // The input is either the index or the item object.
  Model.prototype.removeItem = function (rem, callback) {
    var i = rem;
    if (rem instanceof Object) {
      i = this.items.indexOf(rem);
      if (i == -1) {
        callback(this.items.length);
        return;
      }
    }
    this.items.splice(i, 1);
    callback(this.items.length);
  };

  Model.prototype.pushAnswer = function (ans, callback) {
    this.items[0].pushAnswer(ans, callback);
  };

  // ## Item
  // The container for single history entries. It contains
  // the command and any answers in an array.
  function Item(command, ans) {
    this.command = command;
    this.answer = ans;
  }

  // ### getCommand()
  // Returns the command from item.
  Item.prototype.getCommand = function (callback) {
    callback(this.command);
  };

  // ### setCommand()
  // Sets the command in an item. This should be used instead
  // of setting the property directly.
  Item.prototype.setCommand = function (cmd, callback) {
    this.command = cmd;
    callback(null);
  };

  // ### getAnswer()
  // Gets the answer in an item.
  Item.prototype.getAnswer = function (callback) {
    callback(this.answer);
  };

  // ### setAnswer()
  // Sets the answer in an item. This should be used instead
  // of setting the property direclty.
  Item.prototype.setAnswer = function (ans, callback) {
    this.answer = ans;
    callback(null);
  };

  Item.prototype.pushAnswer = function (ans, callback) {
    this.answer.push(ans);
    if (callback)
      callback(this);
  };

  // ## newItem()
  // A factory function for creating new items.
  var newItem = function () {
    var callback = arguments[arguments.length - 1];
    var command = null;
    var ans = [];
    if (arguments.length > 1) {
      command = arguments[0];
    }
    if (arguments.length > 2) {
      ans = arguments[1];
    }
    var item = new Item(command, ans);
    callback(item);
  };

  // ## newModel()
  // A factory function for creating new models.
  var newModel = function () {
    var callback = arguments[arguments.length - 1];

    var name = null;
    if (arguments.length > 1) {
      name = arguments[0];
    }

    var model = new Model(name);
    callback(null, model);
  };

  function Factory() {
    var model = new Model("scratch");
    return model;
  }

  return Factory;

});
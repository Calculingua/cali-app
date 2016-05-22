define([
  "jQuery",
  "jQueryUI",
  "ace",
  "mode-matlab"
], function (jQuery,jQueryUI, ace) {

  function EditorView($rootScope) {
    var self = this;

    var container = "#editor-container";
    this.editorTabs = jQueryUI("#script-tabs", container); // $("#editor-tabs")

    this.editors = {};

    var activeTab = null;

    this.tabs = this.editorTabs.tabs({
      activate: function (event, ui) {
        var newActiveTab = self.getSelectedPath();
        $rootScope.$emit("editorView.onBeforeSelectionChange", activeTab);
        activeTab = newActiveTab;
      }
    });
    this.tabs.click(function (obj) {
      // console.log("tabs clicked with:", obj);
    });

    // close icon: removing the tab on click
    this.tabs.delegate("span.ui-icon-close", "click", function () {
      var panelId = jQueryUI(this).closest("li").attr("aria-controls");
      var path = self._idToPath(panelId);
      $rootScope.$emit("editor.removeTab", path);
    });

    this.changeCalls = 0;

    this.tabTemplate = "<li><a href='#{href}'>#{label}</a> <span class='ui-icon ui-icon-close' role='presentation'>Remove Tab</span></li>";

    this.getSelected = function () {
      var ind = this.tabs.tabs('option', 'active');
      var id = jQueryUI("a", jQueryUI("li:eq(" + ind + ")", this.tabs)).prop("href").split("#")[1];

      var path = jQueryUI("#" + id, this.tabs).data().path;
      console.log("selected tab id: " + path);

      return this.editors[path];
    };

    this.removeTab = function (path) {
      var key = this._pathToKey(path);
      jQueryUI("[aria-controls='tabs-" + key + "']").remove();
      jQueryUI("#tabs-" + key).remove();
      this.tabs.tabs("refresh");
      delete this.editors[path];
      this._removePathKey(path);
    };

    this.renameTab = function (path, newPath, name) {
      var key = this._pathToKey(path);
      var id = "tabs-" + key;
      var newKey = this._pathToKey(newPath);
      this._pathToKey(path);
      var newId = "tabs-" + newKey;

      if (this.editors[path]) {
        jQueryUI("#" + id, this.tabs).attr("id", newId);
        jQueryUI("#" + newId, this.tabs).data({
          path: newPath
        });
        jQueryUI("#editor-" + key, jQueryUI("#" + newId, this.tabs)).attr("id", "#editor-" + newKey);
        var tabbar = this.tabs.find(".ui-tabs-nav");
        tabbar.children().each(function (item) {
          if (jQueryUI(this).attr("aria-controls") == id) {
            console.log("found");
            jQueryUI(this).attr("aria-controls", newId);
            jQueryUI("a", this).attr("href", "#" + newId);
            jQueryUI("a", this).text(name);
          }
        });
      }
      this.editors[newPath] = this.editors[path];
      delete this.editors[path];
      this.tabs.tabs("refresh");
    };

    this.getSelectedPath = function () {
      return this._idToPath(this.getSelectedId());
    };

    this.getSelectedKey = function () {
      return this._idToKey(this.getSelectedId());
    };

    this.getSelectedId = function () {
      var id = null;
      try {
        var ind = this.tabs.tabs('option', 'active');
        id = jQueryUI("a", jQueryUI("li:eq(" + ind + ")", this.tabs)).prop("href").split("#")[1];
        console.log("selected tab id: " + id);
      } catch (ex) {
        console.log("nothing selected");
      }
      return id;
    };

    // actual addTab function: adds new tab using the input from the form above
    this._idToKey = function (key) {
      key = null;
      if (key) {
        key = key.slice(5);
      }
      return key;
    };

    this._idToPath = function (key) {
      var path = null;
      if (key) {
        path = jQueryUI("#" + key, this.tabs).data().path;
      }
      return path;
    };

    var k = 0;
    var keyTable = {};
    this._pathToKey = function (path) {

      var key = "script-" + k;
      if (typeof keyTable[path] !== "undefined") {
        key = keyTable[path];
      } else {
        k++;
      }

      keyTable[path] = key;
      // var key = path.replace(/\//g, "____slash____");
      // key =
      // key = key.replace(/\./g, "____period____");
      // key = key.replace(/\s/g, "____white_space____");
      // key = key.replace(/\s/g, "____white_space____");
      return key;
    };

    this._removePathKey = function (path) {
      if (typeof keyTable[path] !== "undefined") {
        delete keyTable[path];
      }
    };

    this.insertNewFile = function (path, name, data) {
      var self = this;
      var key, id;
      if (!this.editors[path]) {
        key = this._pathToKey(path);
        var label = name;
        id = "tabs-" + key;
        var li = jQueryUI(this.tabTemplate.replace(/#\{href\}/g, "#" + id).replace(/#\{label\}/g, label));
        var tabContentHtml = "<div id='editor-" + key + "' class='editor'></div>";

        this.tabs.find(".ui-tabs-nav").append(li);
        this.tabs.append("<div id='" + id + "' class='editor_window'>" + tabContentHtml + "</div>");
        jQueryUI("#" + id, this.tabs).data({
          path: path
        });
        this.tabs.tabs("refresh");

        var editor = ace.edit("editor-" + key);
        editor.setTheme("ace/theme/textmate");
        editor.session.setMode("ace/mode/matlab");
        editor.on("change", function () {
          $rootScope.$emit("editorView.onChange");
        });
        if (data) {
          editor.getSession().setValue(data);
        }
        this.editors[path] = editor;
        this.tabs.tabs("option", "active", jQueryUI("ul", this.tabs).children().length - 1);
        //$(id).click();
        this.tabs.tabs("refresh");
      } else {
        key = this._pathToKey(path);
        id = "tabs-" + key;
        var tabbar = this.tabs.find(".ui-tabs-nav");
        var k = 0;
        self.editors[path].getSession().setValue(data);
        tabbar.children().each(function (item) {
          if (jQueryUI(this).attr("aria-controls") == id) {
            self.tabs.tabs({active: k});
          }
          k++;
        });
      }
    };
  }

  return ["$rootScope", EditorView];


});
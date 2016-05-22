define([
  'marked'
], function (marked) {

  function Factory() {

    marked.setOptions({
      renderer: new marked.Renderer(),
      gfm: true,
      tables: true,
      breaks: false,
      pedantic: false,
      sanitize: true,
      smartLists: true,
      smartypants: false
    });

    var out = {
      toHTML: marked
    };

    return out;

  }

  return Factory;

});
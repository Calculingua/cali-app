require({
  baseUrl: '../..',
  paths: {
    "cali-calcu": "src/calcu",
    "cali-calcu-test": "test/calcu",
    "async": "./vendor/async/lib/async",
    "jStat": "./vendor/jstat/dist/jstat",
    "numeric": "./vendor/numericjs/index",
    "sinon": "./vendor/sinon/index",
    "jQuery": "./vendor/jquery/dist/jquery",
    "jQuery.parse": "./vendor/jquery.parse/jquery.parse",
    "jasmine-root": "./vendor/jasmine/lib/jasmine-core/jasmine",
    "jasmine-html": "./vendor/jasmine/lib/jasmine-core/jasmine-html",
    "$J": "./vendor/jasmine/lib/jasmine-core/boot"
  },
  shim: {
    "async": {
      exports: "async"
    },
    "sinon": {
      exports: "sinon"
    },
    "numeric": {
      exports: "numeric"
    },
    "jStat": {
      exports: "jStat"
    },
		"jQuery": {
			exports: "$"
		},
		"jQuery.parse": {
			deps: ["jQuery"],
			exports: "$"
		},
    "jasmine-html": {
      deps: ["jasmine-root"]
    },
    "$J": {
      deps: ["jasmine-root", "jasmine-html"],
      exports: "describe",
      init: function () {
        window.onload();//jasmine must bootstrap
        return {
          describe: window.describe,
          it: window.it,
          beforeEach: window.beforeEach,
          afterEach: window.afterEach,
          expect: window.expect,
          jasmine: window.jasmine
        };
      }
    }
  }
}, ['cali-calcu-test/main']);
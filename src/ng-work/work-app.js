define(
  [
    "../ng-corp/corp-app",
    "../ng-sdk/sdk-module",
    "./controller/command-line",
    "./controller/editor",
    "./controller/feedback",
    "./controller/file-sidebar",
    "./controller/history",
    "./controller/left-interface",
    "./controller/main",
    "./controller/notebook-sidebar",
    "./controller/proof",
    "./controller/right-interface",
    "./controller/search-function",
    "./controller/variable-sidebar",
    "./directives/focus",
    "./model/dbox-file-model",
    "./model/history-model",
    "./model/notebook-collection-model",
    "./model/notebook-model",
    "./model/scratch-page-model",
    "./model/variable-model",
    "./service/command-parser",
    "./service/history-view",
    "./service/notebook-page-service",
    "./service/output-service",
    "./service/pre-render",
    "./service/render",
    "./service/search-service",
    "./service/shims",
    "./service/walk-through",
      "./service/api",
    "./view/editor-view",
    "./filter/file-filter",
    "angular",
    "angularCookies",
    "ui.autocomplete"
  ], function (corpApp, sdkModule, CommandLine, EditorController, FeedbackController, FileSidebarController, HistoryController, LeftInterfaceController, MainController, NotebookSidebarController, ProofController, RightInterfaceController, SearchFunctionController, VariableSidebarController, focusMe, FileModel, HistoryModel, NotebookCollectionModel, NotebookModel, ScratchPageModel, VariableModel, CommandParser, HistoryView, NotebookPageService, OutputService, PreRender, Render, SearchService, Shims, WalkThrough, ApiService, EditorView, FileFilter, angular, angularCookies, uiAutocomplete) {

    var workAppModule = angular.module("cali-work", [
      angularCookies.name,
      corpApp.name,
      sdkModule.name,
      uiAutocomplete.name
    ])
      .config(function ($interpolateProvider) {
        $interpolateProvider.startSymbol('<%');
        $interpolateProvider.endSymbol('%>');
      });

    workAppModule.controller('CommandLine', CommandLine);
    workAppModule.controller('Editor', EditorController);
    workAppModule.controller('Feedback', FeedbackController);
    workAppModule.controller('FileSidebar', FileSidebarController);
    workAppModule.controller('History', HistoryController);
    workAppModule.controller('LeftInterface', LeftInterfaceController);
    workAppModule.controller('Main', MainController);
    workAppModule.controller('NotebookSidebar', NotebookSidebarController);
    workAppModule.controller('Proof', ProofController);
    workAppModule.controller('RightInterface', RightInterfaceController);
    workAppModule.controller('SearchFunction', SearchFunctionController);
    workAppModule.controller('VariableSidebar', VariableSidebarController);

    workAppModule.directive('focusMe', focusMe);

    workAppModule.service('FileModel', FileModel);
    workAppModule.service('HistoryModel', HistoryModel);
    workAppModule.service('NotebookCollectionModel', NotebookCollectionModel);
    workAppModule.service('NotebookModel', NotebookModel);
    workAppModule.service('ScratchPageModel', ScratchPageModel);
    workAppModule.service('VariableModel', VariableModel);

    workAppModule.factory('CommandParser', CommandParser);
    workAppModule.factory('HistoryView', HistoryView);
    workAppModule.factory('NotebookPageService', NotebookPageService);

    workAppModule.service('OutputService', OutputService);
    workAppModule.service("PreRender", PreRender);
    workAppModule.service("Render", Render);

    workAppModule.factory("SearchService", SearchService);
    workAppModule.factory("Hopscotch", Shims.HopScotch);
    workAppModule.factory("Dropbox", Shims.Dropbox);

    workAppModule.service("WalkThrough", WalkThrough);
    workAppModule.service("ApiService", ApiService);

    workAppModule.service("EditorView", EditorView);
    
    workAppModule.filter("fileFilter", FileFilter);

    return workAppModule;

  });

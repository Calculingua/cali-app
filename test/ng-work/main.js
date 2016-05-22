define(function (require) {
    
    require("./controller/feedback.spec");
    require("./service/api.spec");
    require("$J").jasmine.getEnv().execute();
});
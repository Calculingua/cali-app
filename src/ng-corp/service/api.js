define([
], function () {

  function apiFactory($http) {
    var api = {};

    // data = {userid, password}
    api.login = function (data) {
      return $http.post("/app/login", data);
    };

    // data = {name, email, referral, version}
    api.prereg = function (data) {
      return $http.post("/app/prereg", data);
    };

    // data = {name, email, referral, version}
    api.getRegKey = function (key) {
      return $http.get("/app/regKey/" + key);
    };

    // data = {id, name, email, password}
    api.register = function (data, key) {
      return $http.post("/app/account?key=" + key, data);
    };

    // data = {userid, email}
    api.requestReset = function (data) {
      return $http.post("/app/reset", data);
    };

    // data = { userid, password}
    api.passwordReset = function (data, key) {
      return $http.put("/app/reset/" + key, data);
    };
    
    api.requestDemo = function(name, email, phone){
        return $http.post("/app/demo-request", {name : name.split(" "), email : email, phone: phone})
            .then(function(res){
                return res.data;
            });
    };

    return api;
  }

  return ["$http", apiFactory];

});

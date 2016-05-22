define([
    'cali-calcu/serializeDeserialize',
    'angular',
    'cali-calcu/mType/CellArrayType'
], function (serializeDeserialize, angular, CellArrayType) {

  function VariableModel($http, $rootScope, initVariables, path) {
    var self = this;
    this.variables = (initVariables) ? initVariables : {};
    this.path = path;

    this.onChange = function () {
      $rootScope.$emit("variableModel.onChange");
    };

    this.getVariables = function (callback) {

      $http.get(self.path)
        .success(function (data) {
          // var data = res.data;
          angular.copy({}, self.variables);
          for (var name in data) {
            var value = data[name];
              //#237 here should be a generic .deserialize call
              //no need for type-checking as type-checking will be isolated in that function
            if (data[name].type && data[name].type == "CELL_ARRAY") {
              value = new CellArrayType(value);
            } else {
                value = serializeDeserialize.deserialize(value);
            }
            self.variables[name] = value;
          }
          self.onChange();
          callback(null, self.variables);
        })
        .catch(function (error) {
          callback(error);
        });
    };

    this.setVariables = function (variables, callback) {
      angular.copy(variables, self.variables);
        //#237 if every object implements .serialize(), we can just call that here
        $http.put(this.path, serializeDeserialize.deepSerialize(variables))
        .success(function (data) {
          self.onChange();
          callback(null, self.variables);
        })
        .catch(function (error) {
          callback(error, self.variables);
        });
    };

    this.deleteVariables = function (callback) {
      $http.delete(this.path)
          .success(function () {
          angular.copy({}, self.variables);
          self.onChange();
          callback(null, self.variables);
        })
        .catch(function (error) {
          callback(error);
        });
    };

    this.addVariable = function (name, value, callback) {
      var self = this;

      var data = {};
      data[name] = value;

      self.variables[name] = value;

        //#237 if every object implements .serialize(), we can just call that here
        $http.post(this.path, serializeDeserialize.deepSerialize(data))
            .success(function () {
          self.onChange();
          callback(null, self.variables);
        })
        .catch(function (error) {
          callback(error, self.variables);
        });
    };

    this.setVariable = function (name, value, callback) {
      self.variables[name] = value;

        //#237 if every object implements .serialize(), we can just call that here
        $http.put(this.path + "/" + name, serializeDeserialize.deepSerialize(value))
        .success(function (data) {
          self.onChange();
          callback(null, self.variables);
        })
        .catch(function (error) {
          callback(error, self.variables);
        });
    };

    this.deleteVariable = function (name, callback) {

      $http.delete(self.path + "/" + name)
          .success(function () {
          delete self.variables[name];
          self.onChange();
          callback(null, self.variables);
        })
        .catch(function (error) {
          callback(error);
        });
    };
  }

  function Factory($http, $rootScope, userData) {
    var model = new VariableModel($http, $rootScope, null, "/app/account/" + userData.username + "/notebook/scratch/variable");
    model.getVariables(function (err, vars) {
      if (err)console.error("Error getting variables");
    });

    return model;
  }

  return ["$http", "$rootScope", "UserData", Factory];

});
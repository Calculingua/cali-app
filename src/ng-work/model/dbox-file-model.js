define([
  'angular'
], function (angular) {

  function DropboxFileModel($http, $rootScope, api, userData) {
    var self = this;
    this.opts = null;
    this.client = null;
    this.pwd = "/";
    this.client = null;

    this.notConnected = true;

    userData.getOptions()
      .then(function (opts) {
        self.opts = opts;

		var options = {};
        //var options = {key : encodedKey};
        if (opts.dropbox) {
          options.uid = opts.dropbox.uid || null;
          options.token = opts.dropbox.token || null;
        }
		
		if(options.token){
			var client = new Dropbox.Client(options);
			
	        client.authenticate({
	          interactive: false
	        }, function (error, c) {
	          self.client = c;
	          if (error) {
	            console.log("Error connecting to dropbox:", error);
	          } else {
	            var creds = self.client.credentials();

	            self.client.getAccountInfo(function (error, accountInfo) {
	              if (error) {
	                self.signout();
	              } else {
	                self.notConnected = false;
	                $rootScope.$emit("fileModel.notConnected", self.notConnected);
	              }
	            });
	          }
	        });
		}

        
      });

    this.isAuthenticated = function () {
      var auth = false;
      if (self.client) {
        auth = self.client.isAuthenticated();
      }
      return auth;
    };

    this.get = function (relPath, callback) {
      if (relPath[0] != "/") {
        relPath = self.pwd + relPath;
      }
      self.client.stat(relPath, {readDir: true}, callback);
    };

    this.readFile = function (relPath, callback) {
      if (relPath[0] != "/") {
        relPath = self.pwd + relPath;
      }
      self.client.readFile(relPath, callback);
    };

    this.readDir = function (relPath, callback) {
      if (relPath[0] != "/") {
        relPath = self.pwd + relPath;
      }
      self.client.readdir(relPath, function (err, strArray, fstat, contentFstat) {
        callback(err, contentFstat || null);
      });
    };

    this.newFile = function (relPath, callback) {
      if (relPath[0] != "/") {
        relPath = self.pwd + relPath;
      }
      self.client.writeFile(relPath, "", {noOverwrite: true}, function () {
        callback.apply(this, arguments);
        if (!arguments[0]) {
          $rootScope.$emit("fileModel.onNewFile", relPath);
        }
      });
    };

    this.newFolder = function (relPath, callback) {
      if (relPath[0] != "/") {
        relPath = self.pwd + relPath;
      }
      self.client.mkdir(relPath, function () {
        callback.apply(this, arguments);
        if (!arguments[0]) {
          $rootScope.$emit("fileModel.onNewFolder", relPath);
        }
      });
    };

    this.saveFile = function (relPath, data, callback) {
      if (relPath[0] != "/") {
        relPath = self.pwd + relPath;
      }
      self.client.writeFile(relPath, data, function () {
        callback.apply(this, arguments);
        if (!arguments[0]) {
          $rootScope.$emit("fileModel.onSaveFile", relPath);
        }
      });
    };

    this.unlink = function (relPath, callback) {
      if (relPath[0] != "/") {
        relPath = self.pwd + relPath;
      }
      self.client.unlink(relPath, function () {
        callback.apply(this, arguments);
        if (!arguments[0]) {
          $rootScope.$emit("fileModel.onUnlink", relPath);
        }
      });
    };

    this.move = function (relPath, newPath, callback) {
      if (relPath[0] != "/") {
        relPath = self.pwd + relPath;
      }
      if (newPath[0] != "/") {
        newPath = self.pwd + newPath;
      }
      self.client.move(relPath, newPath, function () {
        callback.apply(this, arguments);
        if (!arguments[0]) {
          $rootScope.$emit("fileModel.onMove", relPath, newPath);
        }
      });
    };

    this._deleteCreds = function (callback) {
      $http.get("/app/account/" + self.opts.id)
        .success(function (data) {
          data.dropbox = null;
          delete data.password;
          $http.put("/app/account/" + self.opts.id, data)
            .success(function (data) {
              callback(null, data);
            })
            .error(function (error) {
              callback(error);
            });
        })
        .error(function (error) {
          callback(error);
        });
    };

    this.signin = function () {
      // The user will have to click an 'Authorize' button.
		api.oauthConnect("dropbox");
    };

    this.signout = function () {
      console.log("signing out...");
      self._deleteCreds(function (err, data) {
        if (err) {
          console.log(err);
        } else {
          console.log(data);
        }
      });
      self.client.signOut({
        mustInvalidate: true
      }, function (err) {
        if (err) {
          console.log(err);
        } else {
          self.notConnected = true;
          $rootScope.$emit("fileModel.notConnected", self.notConnected);
        }
      });
    };
  }


  return ["$http", "$rootScope", "ApiService", "UserData", DropboxFileModel];

});

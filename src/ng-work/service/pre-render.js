define([
], function(){

  function Service(){
	
		var self = this;
		
		var maxj = 50;
		var maxi = 200;
		
		this.process = function(type, value) {
			var out = null;
			switch (type) {
				case "result":
					if (value.text) {
						out = value;
					} else {
                        //#237: each time a new type is introduced, we would have to find out where this sort of type-checking
                        //occurs and extend it accordingly. this is very difficult to keep in sync.
						switch(value.ans.type){
						case "CELL_ARRAY":
							out = self.cellArray(value);
							break;
						case "TABLE":
							out = self.table(value);
							break;
						case "CATEGORICAL":
							out = self.categorical(value);
							break;
						case "HASH_TABLE":
							out = self.hashTable(value);
							break;
                        case "LINEARMODEL":
                                out = self.linearModel(value);
                                break;
						default:
							out = self.matrix(value);
							break;
						}
					}
					break;
				case "plot":
				case "exception":
				case "command":
				case "comment":
					out = value;
					break;
			}
			return out;
		};

        this.linearModel = function (value) {
            //do not perform preprocessing (render function will deal with it).
            return value;
        };

		this.matrix = function(value) {
			value.truncated = {};
			var ans = value.ans;
			for (var i = 0; i < ans.length; i++) {
				if(i > maxi){
					ans = ans.slice(0, maxi - 1);
					value.truncated[1] = true;
					break;
				}
				for (var j = 0; j < ans[i].length; j++) {
					if(j > maxj){
						ans[i] = ans[i].slice(0, maxj - 1);
						value.truncated[2] = true;
						break;
					}
				}
			}
			value.ans = ans;
			return value;
		};

		this.cellArray = function(value) {
			value.truncated = {};
			var ans = value.ans;
			for (var i = 0; i < ans.length; i++) {
				if(i > maxi){
					ans = Array.prototype.slice.call(ans, 0, maxi - 1);
					value.truncated[1] = true;
					break;
				}
				for (var j = 0; j < ans[i].length; j++) {
					if(j > maxj){
						ans[i] = Array.prototype.slice.call(ans[i], 0, maxj - 1);
						value.truncated[2] = true;
						break;
					}
				}
			}
			value.ans = ans;
      value.ans.type = "CELL_ARRAY";//#237: one-offs like this are difficult to keep track off.
			return value;
		};

		this.table = function(value) {
			value.truncated = {};
			var ans = value.ans;
			var x = ans.data;
			for (i = 0; i < x[0].length; i++) {
				if(i > maxi){
					x[0] = Array.prototype.slice.call(x[0], 0, maxi - 1);
					value.truncated[1] = true;
					break;
				}
			}
			value.ans.data = x;
			return value;
		};

		this.categorical = function(value) {
			value.truncated = {};
			var x = value.ans.data;
			for (var i = 0; i < x.length; i++) {
				if(i > maxi){
					x = x.slice(0, maxi - 1);
					value.truncated[1] = true;
					break;
				}
				for (var j = 0; j < x[i].length; j++) {
					if(j > maxj){
						x[i] = x[i].slice(0, maxj - 1);
						value.truncated[2] = true;
						break;
					}
				}
			}
			value.ans.data = x;
			return value;
		};

		this.hashTable = function(value) {
			value.truncated = {};
			var x = value.data;
			for(var key in x){
                //#237: each time a new type is introduced, we would have to find out where this sort of type-checking
                //occurs and extend it accordingly. this is very difficult to keep in sync.
				switch(x[key].type){
				case "CELL_ARRAY":
					// out += self.cellArray2html(x[key]);
					break;
				case "TABLE":
					// out += self.table2html(x[key]);
					break;
				case "CATEGORICAL":
					// out += self.categorical2html(x[key]);
					break;
				case "HASH_TABLE":
					// out += self.hashTable2html(x[key]);
					break;
				default:
					// out += self.matrix2html(x[key]);
					break;
				}
			}
			return value;
		};
	}

  return [Service];


	
});
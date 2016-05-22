define([], function(){

	function HashTable(obj) {

		this.type = "HASH_TABLE";
		this.data = {};
		
		var key;
		if(obj && obj.type && obj.type == "HASH_TABLE"){
			for(key in obj.data){
				this.data[key] = obj.data[key];
			}
		}else if(obj){
			for(key in obj){
				this.data[key] = obj[key];
			}
		}
	}

	return HashTable;
	
});
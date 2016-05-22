define([
], function(){
	
	function Controller(notebookModel, analytics){
		
		var self = this;
		
		this.showView = "";
		
		var refresh = function(){
			notebookModel.findAll()
				.then(function(books){
					self.books = books;
				});
		};
		
		refresh();
			
		this.selectedKey = null;
	
		this.click = function(key){
		
			analytics.log("sidebar-notebook", "click");
		
			for(var k in self.books){
				self.books[k].class = null;
			}
		
			self.books[key].class = "selected";
			self.selectedKey = key;
			self.showView = "";
		};
	
		this.dblClick = function(key){
			analytics.log("sidebar-notebook", "double-click");
		};
		
		this.closeModal = function(){
			self.showView = "";
		};
		
		this.submitEdit = function(){
			var book = self.books[self.selectedKey];
			var id = book.notebook;
			notebookModel.edit(id, {title: book.title, description: book.description, public: book.public})
				.then(function(){
					refresh();
					self.showView = "";
				});
		};
		
		this.newPublic = false;
		this.submitNew = function(){
			var opts = {title : self.newTitle, description: self.newDescription, public: self.newPublic};
			notebookModel.create(opts)
				.then(function(item){
					refresh();
					self.newPublic = false;
					self.newDescription = "";
					self.newTitle = "";
					self.showView = "";
				});
		};
		
		this.submitRemove = function(){
			var book = self.books[self.selectedKey];
			var id = book.notebook;
			notebookModel.remove(id)
				.then(function(){
					refresh();
					self.showView = "";
				});
		};
			
		this.new = function(){
			self.showView = "new";
		};
		
		this.edit = function(){
			self.showView = "edit";
		};
		
		this.remove = function(){
			self.showView = "remove";
		};
	}
	
    return ["NotebookModel", "Analytics", Controller];

});
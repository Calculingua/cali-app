define([
  "jQuery.outerHTML"
], function(jQueryOuterHTML){

	function Factory(markdown, render){

		function HistoryView(divId) {
			var self = this;

			this.div = $(divId);

			this.push = function(type, value, id){
				var html = render.toHtml(type, value, id);
				self.div.append(html);
			};

			this.updateLast = function(type, value, id){
				var html = render.toHtml(type, value, id);
        jQueryOuterHTML("div", self.div).last().outerHTML(html);
			};

			this.updateId = function(id, type, value){
				var html = render.toHtml(type, value, id);
        jQueryOuterHTML("#" + id, self.div).outerHTML(html);
			};

			this.scrollBottom = function() {
				var height = $("#historyInterface").height();
        jQueryOuterHTML("#history_container").scrollTop(height);
			};

			this.clear = function(){
				self.div.html("");
			};
		}

		return HistoryView;
	}

  return ["Markdown", "Render", Factory];

});
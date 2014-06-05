var str_escape;
(function(){
	
	str_escape = function(str){
		return str
			.replace(/&(?!\w+;)/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			;
	};
}());
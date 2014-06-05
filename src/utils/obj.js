var obj_defaults;
(function(){
	obj_defaults = function(target, defaults) {
		if (target == null)
			target = {};
			
		for (var key in defaults) {
			if (target[key] == null) 
				target[key] = defaults[key];
		}
		return target;
	};
}());
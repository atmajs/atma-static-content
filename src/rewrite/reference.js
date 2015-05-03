var rewrite_reference;
(function(){
	rewrite_reference = function(path){
		if (typeof app === 'undefined' || app.config == null) 
			return path;
		
		var regexp = /\.reference\/([^\/]+)/,
			match = regexp.exec(path),
			project = match && match[1],
			projects = app.config.projects;
			
		if (projects == null)
			return path;
		
		var data = projects[project];
		if (data == null) 
			return path;
		
		var str = '.reference/' + project;
		var projectPath = typeof data === 'string'
			? data
			: data.path;
		
		if (projectPath == null) 
			return path;
		
		return net.Uri.combine(
			projectPath, path.substring(match.index + str.length)
		);
	};
}());
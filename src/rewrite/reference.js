var rewrite_reference;
(function(){
	rewrite_reference = function(path){
		
		var regexp = /\.reference\/([^\/]+)/,
			match = regexp.exec(path),
			project = match && match[1],
			projects = app.config.projects;
			
		if (projects == null)
			return path;
		
		var projectPath = projects[project] && projects[project].path,
			str = '.reference/' + project;
		
		if (projectPath == null) 
			return path;
		
		return net.Uri.combine(
			projectPath, path.substring(match.index + str.length)
		);
	};
	
}());
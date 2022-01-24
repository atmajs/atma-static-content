module.exports = {
	process: function(config, done){

		io
			.File
			.getFactory()
			.registerHandler(/MimeTypes\.yml/i, Class({
				exists: function(){
					return true;
				},
				read: function(){

					console.log('read mimeTypes'.cyan.bold);

					return this.content = mimeTypes();
				}
			}));

		//done();
	}
};


var mimeTypes;
(function(){

	mimeTypes = function(){
		return _types || (_types = get());
	};

	var _types;

	function get(){
		var extensions = {};

		io
			.File
			.read('src/data/mime.types')
			.split(/[\r\n]+/g)
			.forEach(function(line){
				if (/^\s*#/.test(line))
					return;

				var parts = line.split(/\s+/g),
					mimeType = parts[0];

				parts
					.slice(1)
					.forEach(function(ext){
						if (!ext)
							return;

						if (extensions[ext]) {
							console.warn(
								'Overwrite extension cyan<`%s`> of bold<`%s`> with bold<`%s`>'.color
								, ext
								, extensions[ext]
								, mimeType
								);
						}
						extensions[ext] = mimeType;
					});
			});

		console.log('Extensions: '.bold, Object.keys(extensions).length);
		return JSON.stringify(extensions);
	};
}());

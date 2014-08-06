var interface_express_send;
(function(){
	interface_express_send = function(req, url, settings) {
		return new Express(req, url, settings);
	};
	
	var Express = Class({
		Base: Class.EventEmitter,
		Construct: function(req, url, settings){
			if (req.url !== url) 
				req.url = url;
			
			this.req = req;
			this.settings = obj_defaults(settings, { maxAge: 0 });
			this.appConfig = convertSettings(this.settings);
			this.responder = responder_create(this.settings);
		},
		maxage: function(ms){
			if (Infinity === ms)
				ms = 60 * 60 * 24 * 365 * 1000;
			this.settings.maxAge = ms / 1000 | 0;
			return this;
		},
		pipe: function(res){
			var self = this;
			
			this.settings.handleDirectory = !has(this, 'directory');
			this.settings.handleErrors = !has(this, 'error');
			
			this.responder(this.req, res, this.appConfig)
				.fail(function(error){
					if (error.code === 'EISDIR') {
						self.trigger('directory', error);
						return;
					}
					error = send_toHttpError(error);
					error.status = error.code;
					self.trigger('error', error);
					
				});
		}
	});
	
	function has(emitter, event){
		var arr = emitter._listeners[event];
		return arr != null && arr.length > 0;
	}
	function convertSettings(settings) {
		var config = {
			base: settings.root,
			index: settings.index
		};
		return config;
	}
}());
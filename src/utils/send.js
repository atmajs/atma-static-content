var send_error,
	send_toHttpError,
	send_redirect,
	send_headersWritable;
(function(){
	
	send_toHttpError = function(mix, message){
		if (typeof mix === 'number') {
			return fromStatusCode(mix, message);
		}
		return fromError(mix);
	};
	send_error = function(res, error){
		var httpError = fromError(error);
		
		res.writeHead(httpError.code, {
			'Content-Type': 'text/plain'
		});
		res.end(httpError.message);
	};
	send_headersWritable = function(res){
		var sent = res._headerSent;
		if (typeof sent === 'boolean') 
			return sent === false;
		
		return trySet(res, 'X-Powered-By', 'AtmaNode');
	};
	send_redirect = function(res, path){
		res.statusCode = 301;
		res.setHeader('Location', path);
		res.end('Redirecting to ' + str_escape(path));
	};
	
	function fromStatusCode(code, message) {
		if (message == null) {
			if (STATUS_CODES == null) 
				STATUS_CODES = require('http').STATUS_CODES;
			
			message = STATUS_CODES[code];
		}
		var error = new Error(message);
		error.code = code;
		return error;
	}
	function fromError(error) {
		if (typeof error === 'number') 
			return fromStatusCode(error);
		
		var code = error.code,
			message = error.message;
		if (code == null) 
			code = 500;
		if (typeof code === 'string') {
			switch(code){
				case 'ENOENT':
				case 'ENAMETOOLONG':
				case 'ENOTDIR':
				case 'ENOTFILE':
					code = 404;
					message = null;
					break;
				default:
					code = 500;
					break;
			}
		}
		return fromStatusCode(code, message);
	}
	
	var STATUS_CODES;
}());

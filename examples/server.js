var http = require('http'),
	static_ = require('../lib/static.js'),
	port = 5888
	;
	
http
	.createServer(static_.respond)
	.listen(port);

console.log('Server on', port);
	

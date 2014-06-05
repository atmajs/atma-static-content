var http = require('http'),
	Static = require('../lib/static.js'),
	port = 5888
	;
	
http
	.createServer(Static.create({ base: './content' }))
	.listen(port);

console.log('Server on', port);
	

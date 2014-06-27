var http = require('http'),
	Static = require('../lib/static.js'),
	port = 5888
	;
	
module.exports = http
	.createServer(Static.create({ base: './content' }))
	.listen(port);

console.log('Server on', port);
	

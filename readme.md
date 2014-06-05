Http Server static middleware
-----
[![Build Status](https://travis-ci.org/atmajs/atma-server-static.png?branch=master)](https://travis-ci.org/atmajs/atma-server-static)

- String file caching
- String file gzip
- File read middlewares. Refer to [atma-io](https://github.com/atmajs/atma-io) for documentation.
- Range requests _audio/video streaming_
- Support static handlers per each sub-application [atma-server][atma-io](https://github.com/atmajs/atma-server)

#### API
```javascript
require('static-content'):StaticContentMiddleware;

StaticContentMiddleware {
	create: function(settings:StaticContentSettings): function(req, res, next, AppConfig),
	respond: function(req, res, next, AppConfig):null,
	send: ExpressSend
}

StaticContentSettings {
	// Static root folder
	base: String
	
	// add or overwrite some mimeTypes
	mimeTypes: { MimeTypeString: Array<Extension> }
	extensions: MimeTypeString || Object {
		mimeType: MimeTypeString,
		
		// when utf8 is set, then file will be also cached and gzipped
		encoding: 'UTF-8' || null,
		
		// in seconds
		maxAge: Number
	},
	defaultMimeType: MimeTypeString
}
AppConfig {
	// Static root folder resolving:
	// 1) Check `static` property in config
	// 2) Check `base` property in config
	// 3) otherwise, take CWD
	static: String
	base: String
}

ExpressSend = function(req, url, ExpressSettings)
ExpressSend {
	maxage: function(ms:Number): Self,
	pipe: function(res),
	
	// override handlers, support:
	// - `directory`
	// - `error`
	on: function(event:String, function(error:Object))
}

ExpressSettings {
	// base path
	root: String,
	// default `index.html` file
	index: String
}

```

#### Examples
##### NodeJS HTTP
```javascript
require('http')
	.createServer(require('static-content').create({ base: './content' }))
	.listen(5777);
```
##### Atma-Root-Application with ConnectJS
```javascript

atma
	.server
	.Application({
		configs: '/server/configs/*.yml'
	})
	.done(function(app){
		
		var server = connect()
			// dynamic content response
			.use(app.responder({
				// if dynamic endpoint is found from
				// Handlers | RESTful services | Pages
				// middleware pipeline will be run before calling the endpoint
				middleware: [
					connect.query(),
					connect.cookieParser(),
					connect.bodyParser(),
					connect.session({
						secret: 'asdas2asmd92amxcwd2asc',
						cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 },
						store: new MongoStore({
							db: 'calendar'
						})
					}),
					redirect(),
					passport.initialize(),
					passport.session()
				]
			}))
			// Atma-Server static content middleware
			.use(require('static-content').create({
				base: './public/'
			}))
			.listen(5777);
	});
```
##### Atma-Sub-Application
```javascript
module.exports = atma
	.server
	.Application({
		configs: '/server/configs/*.yml'
	})
	.done(function(app){
		app.responders([ 
			// dynamic content response
			app.responder({
				// if dynamic endpoint is found from
				// Handlers | RESTful services | Pages
				// middleware pipeline will be run before calling the endpoint
				middleware: [
					connect.bodyParser(),
					// ...
				]
			}),
			
			// Atma-Server static content middleware
			require('static-content').respond
		]);
	});
```

----
The MIT License
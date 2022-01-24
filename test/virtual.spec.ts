import * as http from 'http';
import * as path from 'path';
import { File } from 'atma-io';
import * as Static from '../lib/static.js'

let request = require('supertest');

// test server
let fixtures = 'test/fixtures';
let app = http.createServer(function(req, res) {
    function error(err) {
        res.statusCode = err.status;
        res.end(http.STATUS_CODES[err.status]);
    }

    function redirect() {
        res.statusCode = 301;
        res.setHeader('Location', req.url + '/');
        res.end('Redirecting to ' + req.url + '/');
    }

    Static.send(req, req.url, {
        root: fixtures,
        headers: {
            'Access-Control-Allow-Origin': 'FooTest'
        }
    })
        .on('error', error)
        .on('directory', redirect)
        .pipe(res);
});


UTest({
    $config: {
        errorableCallbacks: true
    },
    'request virtual file': (function(){
        File
            .getFactory()
            .registerHandler(/\.txt$/, class extends File {
                exists (){
                    return true;
                }
                readAsync (): Promise<any> {
                    return Promise.resolve('name:' + this.uri.getName());
                }
            });


        return {
            'read': function(done){
                request(app)
                    .get('/foo.txt')
                    .expect('Content-Length', 'name:foo'.length)
                    .expect('Access-Control-Allow-Origin', 'FooTest')
                    .expect(200, 'name:foo', done)
            },

        };
    }())
});

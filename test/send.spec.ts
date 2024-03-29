import * as fs from 'fs';
import * as http from 'http';
import * as path from 'path';
import { mocha } from 'atma-utest';

const { it, describe } = mocha;

let request = require('supertest');
let send = require('../lib/static.js').send;

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

    send(req, req.url, {
        root: fixtures
    })
        .on('error', error)
        .on('directory', redirect)
        .pipe(res);
});

function completed(done) {
    return function(error) {
        eq_(error, null);
        done();
    };
}

describe('send(file).pipe(res)', function() {
    it('should stream the file contents', function(done) {
        request(app)
            .get('/name.txt')
            .expect('Content-Length', '4')
            .expect(200, 'tobi', completed(done))
    })

    it('should decode the given path as an URI', function(done) {
        request(app)
            .get('/some%20thing.txt')
            .expect(200, 'hey', completed(done))
    })

    it('should serve files with dots in name', function(done) {
        request(app)
            .get('/do..ts.txt')
            .expect(200, '...', completed(done))
    })

    it('should treat a malformed URI as a bad request', function(done) {
        request(app)
            .get('/some%99thing.txt')
            .expect(400, 'Bad Request', completed(done))
    })

    it('should 400 on NULL bytes', function(done) {
        request(app)
            .get('/some%00thing.txt')
            .expect(400, 'Bad Request', completed(done))
    })

    it('should treat an ENAMETOOLONG as a 404', function(done) {
        let path = Array(100).join('foobar');
        request(app)
            .get('/' + path)
            .expect(404, completed(done));
    })

    it('should handle headers already sent error', function(done) {
        let app = http.createServer(function(req, res) {
            res.write('0');
            send(req, req.url, {
                root: fixtures
            })
                .on('error', function(err) {
                res.end(' - ' + err.message)
            })
                .pipe(res);
        });
        request(app)
            .get('/nums')
            .expect(200, '0 - Can\'t set headers after they are sent.', completed(done));
    })

    it('should support HEAD : string', function(done) {
        request(app)
            .head('/name.txt')
            .expect('Content-Length', '4')
            .expect(200, '', completed(done))
    })
    it('should support HEAD : stream', function(done) {
        request(app)
            .head('/nums')
            .expect('Content-Length', '9')
            .expect(200, '', completed(done))
    })

    it('should add an ETag header field', function(done) {
        request(app)
            .get('/name.txt')
            .expect('etag', /^W\/"[^"]+"$/)
            .end(completed(done));
    })

    it('should add a Date header field', function(done) {
        request(app)
            .get('/name.txt')
            .expect('date', /^\w{3}, \d+ \w+ \d+ \d+:\d+:\d+ \w+$/, completed(done))
    })

    it('should add a Last-Modified header field', function(done) {
        request(app)
            .get('/name.txt')
            .expect('last-modified', /^\w{3}, \d+ \w+ \d+ \d+:\d+:\d+ \w+$/, completed(done))
    })

    it('should add a Accept-Ranges header field', function(done) {
        request(app)
            .get('/nums')
            .expect('Accept-Ranges', 'bytes', completed(done))
    })

    it('should 404 if the file does not exist', function(done) {
        request(app)
            .get('/meow')
            .expect(404, 'Not Found', completed(done))
    })

    it('should 301 if the directory exists', function(done) {
        request(app)
            .get('/pets')
            .expect('Location', '/pets/')
            .expect(301, 'Redirecting to /pets/', completed(done))
    })

    it('should set Content-Type via mime map', function(done) {
        request(app)
            .get('/name.txt')
            .expect('Content-Type', 'text/plain; charset=UTF-8')
            .expect(200, function(err) {
            eq_(err, null);
            if (err)
                return done()

            request(app)
                .get('/tobi.html')
                .expect('Content-Type', 'text/html; charset=UTF-8')
                .expect(200, completed(done))
        });
    })

    describe('when no "directory" listeners are present', function() {
        it('should respond with a redirect', function(done) {
            let app = http.createServer(function(req, res) {
                send(req, req.url, {
                    root: 'test/fixtures'
                })
                    .pipe(res);
            });

            request(app)
                .get('/pets')
                .expect('Location', '/pets/')
                .expect(301, 'Redirecting to /pets/', completed(done))
        })
    })

    describe('when no "error" listeners are present', function() {
        it('should respond to errors directly', function(done) {
            let app = http.createServer(function(req, res) {
                send(req, 'test/fixtures' + req.url).pipe(res);
            });

            request(app)
                .get('/foobar')
                .expect(404, 'Not Found', completed(done))
        })
    })

    describe('with conditional-GET', function() {
        it('should respond with 304 on a match', function(done) {
            request(app)
                .get('/name.txt')
                .expect(200, function(err, res) {
                if (err) return done(err)
                request(app)
                    .get('/name.txt')
                    .set('If-None-Match', res.headers.etag)
                    .expect(304, function(err, res) {
                    if (err) return done(err)
                    hasNot_(res.headers, {
                        'content-length': null,
                        'content-type': null
                    });
                    // res.headers.should.not.have.property('content-type');
                    // res.headers.should.not.have.property('content-length');
                    done();
                });
            })
        })

        it('should respond with 200 otherwise', function(done) {
            request(app)
                .get('/name.txt')
                .expect(200, function(err, res) {
                if (err) return done(err)
                request(app)
                    .get('/name.txt')
                    .set('If-None-Match', '"123"')
                    .expect(200, 'tobi', completed(done))
            })
        })
    })

    describe('with Range request', function() {
        it('should support byte ranges', function(done) {
            request(app)
                .get('/nums')
                .set('Range', 'bytes=0-4')
                .expect(206, '12345', completed(done));
        })

        it('should be inclusive', function(done) {
            request(app)
                .get('/nums')
                .set('Range', 'bytes=0-0')
                .expect(206, '1', completed(done));
        })

        it('should set Content-Range', function(done) {
            request(app)
                .get('/nums')
                .set('Range', 'bytes=2-5')
                .expect('Content-Length', '4')
                .expect('Content-Range', 'bytes 2-5/9')
                .expect(206, completed(done));
        })

        it('should support -n', function(done) {
            request(app)
                .get('/nums')
                .set('Range', 'bytes=-3')
                .expect(206, '789', completed(done));
        })

        it('should support n-', function(done) {
            request(app)
                .get('/nums')
                .set('Range', 'bytes=3-')
                .expect(206, '456789', completed(done));
        })

        it('should respond with 206 "Partial Content"', function(done) {
            request(app)
                .get('/nums')
                .set('Range', 'bytes=0-4')
                .expect(206, completed(done));
        })

        it('should set Content-Length to the # of octets transferred', function(done) {
            request(app)
                .get('/nums')
                .set('Range', 'bytes=2-3')
                .expect('Content-Length', '2')
                .expect(206, '34', completed(done));
        })

        describe('when last-byte-pos of the range is greater the length', function() {
            it('is taken to be equal to one less than the length', function(done) {
                request(app)
                    .get('/nums')
                    .set('Range', 'bytes=2-50')
                    .expect('Content-Range', 'bytes 2-8/9')
                    .expect(206, completed(done));
            })

            it('should adapt the Content-Length accordingly', function(done) {
                request(app)
                    .get('/nums')
                    .set('Range', 'bytes=2-50')
                    .expect('Content-Length', '7')
                    .expect(206, completed(done));
            })
        })

        describe('when the first- byte-pos of the range is greater length', function() {
            it('should respond with 416', function(done) {
                request(app)
                    .get('/nums')
                    .set('Range', 'bytes=9-50')
                    .expect('Content-Range', 'bytes */9')
                    .expect(416, completed(done));
            })
        })

        describe('when syntactically invalid', function() {
            it('should respond with 200 and the entire contents', function(done) {
                request(app)
                    .get('/nums')
                    .set('Range', 'asdf')
                    .expect(200, '123456789', completed(done));
            })
        })

        describe('when multiple ranges', function() {
            it('should respond with 200 and the entire contents', function(done) {
                request(app)
                    .get('/nums')
                    .set('Range', 'bytes=1-1,3-')
                    .expect(200, '123456789', completed(done));
            })
        })

        describe('when if-range present', function() {
            it('should respond with parts when etag unchanged', function(done) {
                request(app)
                    .get('/nums')
                    .expect(200, function(err, res) {
                    if (err) return done(err);
                    let etag = res.headers.etag;

                    request(app)
                        .get('/nums')
                        .set('If-Range', etag)
                        .set('Range', 'bytes=0-0')
                        .expect(206, '1', completed(done));
                })
            })

            it('should respond with 200 when etag changed', function(done) {
                request(app)
                    .get('/nums')
                    .expect(200, function(err, res) {
                    if (err) return done(err);
                    let etag = res.headers.etag.replace(/"(.)/, '"0$1');

                    request(app)
                        .get('/nums')
                        .set('If-Range', etag)
                        .set('Range', 'bytes=0-0')
                        .expect(200, '123456789', completed(done));
                })
            })

            it('should respond with parts when modified unchanged', function(done) {
                request(app)
                    .get('/nums')
                    .expect(200, function(err, res) {
                    if (err) return done(err);
                    let modified = res.headers['last-modified']

                    request(app)
                        .get('/nums')
                        .set('If-Range', modified)
                        .set('Range', 'bytes=0-0')
                        .expect(206, '1', completed(done));
                })
            })

            it('should respond with 200 when modified changed', function(done) {
                request(app)
                    .get('/nums')
                    .expect(200, function(err, res) {
                    if (err) return done(err);
                    let modified = Date.parse(res.headers['last-modified']) - 20000;

                    request(app)
                        .get('/nums')
                        .set('If-Range', new Date(modified).toUTCString())
                        .set('Range', 'bytes=0-0')
                        .expect(200, '123456789', completed(done));
                })
            })
        })
    })
})

describe('send(file, options)', function() {
    describe('maxAge', function() {
        it('should default to 0', function(done) {
            request(app)
                .get('/name.txt')
                .expect('Cache-Control', 'public, max-age=0', completed(done))
        })

        it('should floor to integer', function(done) {
            let app = http.createServer(function(req, res) {
                send(req, 'test/fixtures/name.txt')
                    .maxage(123956)
                    .pipe(res);
            });

            request(app)
                .get('/name.txt')
                .expect('Cache-Control', 'public, max-age=123', completed(done))
        })

        it('should support Infinity', function(done) {
            let app = http.createServer(function(req, res) {
                send(req, 'test/fixtures/name.txt')
                    .maxage(Infinity)
                    .pipe(res);
            });

            request(app)
                .get('/name.txt')
                .expect('Cache-Control', 'public, max-age=31536000', completed(done))
        })
    })

    describe('index', function() {
        it('should default to index.html', function(done) {
            request(app)
                .get('/pets/')
                .expect(fs.readFileSync(path.join(fixtures, 'pets', 'index.html'), 'utf8'), completed(done))
        })

        it('should be configurable', function(done) {
            let app = http.createServer(function(req, res) {
                send(req, req.url, {
                    root: fixtures,
                    index: 'tobi.html'
                })
                    .pipe(res);
            });

            request(app)
                .get('/')
                .expect(200, '<p>tobi</p>', completed(done));
        })

    })


    describe('root', function() {
        it('path with cdUP', function(done) {

            request(app)
                .get('/pets/../name.txt')
                .expect(200, 'tobi', completed(done))
        })

        describe('when given', function() {
            it('should join root', function(done) {
                let app = http.createServer(function(req, res) {
                    send(req, req.url, {
                        root: 'file://' + __dirname + '/fixtures'
                    })
                        .pipe(res);
                });

                request(app)
                    .get('/pets/../name.txt')
                    .expect(200, 'tobi', completed(done))
            })

            it('should restrict paths to within root', function(done) {
                let app = http.createServer(function(req, res) {
                    send(req, req.url, {
                        root: 'file://' + __dirname + '/fixtures'
                    })
                        .pipe(res);
                });

                request(app)
                    .get('/pets/../../send.js')
                    .expect(403, 'Forbidden', completed(done))
            })

            it('should allow .. in root', function(done) {
                let app = http.createServer(function(req, res) {
                    send(req, req.url, {
                        root: 'file://' + __dirname + '/fixtures/../fixtures'
                    })
                        .pipe(res);
                });

                request(app)
                    .get('/pets/../../send.js')
                    .expect(403, 'Forbidden', completed(done))
            })
        })

        describe('when missing', function() {
            it('should consider .. malicious', function(done) {
                let app = http.createServer(function(req, res) {
                    send(req, req.url)
                        .pipe(res);
                });

                request(app)
                    .get('/../send.js')
                    .expect(403, 'Forbidden', completed(done))
            })

            it('should still serve files with dots in name', function(done) {
                let app = http.createServer(function(req, res) {
                    send(req, req.url, {
                        root: fixtures
                    })
                        .pipe(res);
                });

                request(app)
                    .get('/do..ts.txt')
                    .expect(200, '...', completed(done));
            })
        })
    })
})


export {};

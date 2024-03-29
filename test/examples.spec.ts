UTest({

    $before: function(done){

        var spawn = require('child_process').spawn;


        var cwd = new net.Uri(include.location)
                .combine('../examples/')
                .toLocalDir()
                ;
        this.child = spawn('node', ['server'], {
            cwd: cwd,
            stdio: 'inherit'
        });

        setTimeout(done, 600);

    },

    'load html': function(done){

        var r = require('request');

        r('http://localhost:5888/', function(error, response, body){
            eq_(error, null);
            has_(body, '</audio>');
            done();
        });
    }

})

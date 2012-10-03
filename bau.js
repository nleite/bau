//load file system lib
var fs = require('fs');
//load jsonps lib 
var jsonsp = require('jsonsp');
//load file to read filed
var readStream = fs.ReadStream(__dirname + "/mails.json");
//load stream
var stream = require('stream');
var parser = new jsonsp.Parser();

//var query = {'From': 'Jenna deBoisblanc <jenna.deboisblanc@10gen.com>'};

var query = {};
//var keys = Object.keys(query);
var keys = [];

var out = './file.out';

process.argv.forEach( function(val, index){
    if (index >  1){
        var vs = val.split('=');
        if ( vs['query'] != null){
            var ks = vs[0].split(':');
            var k = ks[0];
            var v = '(.*)';
            if (ks.length > 0){
                v = ks[1];
            }
            query[k] = v; 
            keys.push(k);
        }

        if ( vs['out'] != null){
            out = vs['out'];
        }
    }
});

//var writeStream = new stream.Stream();
var writeStream = fs.createWriteStream(out);
writeStream.writable = true;

var fd = '';
//console.log( "Query -> %j " , query );
//console.log( 'Keys ->' + keys );

parser.on( 'object', function(obj){
    var found = false;

    for ( var i = 0; i < keys.length; i++ ){
        var pattern = new RegExp( '^'+query[keys[i]]+'$');
        found = found || obj[keys[i]].match(pattern) != null;  //obj[keys[i]] == query[keys[i]];
    }

    if (found){
        console.log('Hey I\'m querying right now !');
        console.log( "FOuND it %j", obj); 
    }
});

readStream.on( 'data', function(chunk){
        var str = chunk.toString('utf-8');
        parser.parse(str);
});

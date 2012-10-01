
//load file system lib
var fs = require('fs');
//load jsonps lib 
var jsonsp = require('jsonsp');
//load file to read filed
var readStream = fs.ReadStream(__dirname + "/mails.json");

var parser = new jsonsp.Parser();

//var query = {'From': 'Jenna deBoisblanc <jenna.deboisblanc@10gen.com>'};

var query = {};
//var keys = Object.keys(query);
var keys = [];
process.argv.forEach( function(val, index){
    if (index >  1){
       var vs = val.split('=');
       var k = vs[0];
       var v = '(.*)';
       if (vs.length > 0){
           v = vs[1];
       }
       query[k] = v; 
       keys.push(k);
    }
});

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

var express = require('express');
var Client = require('node-rest-client').Client;
var client = new Client();

var server = express(); // better instead

server.configure(function(){
	server.use("/lib", express.static(__dirname + '/../lib'));
	server.use(express.static(__dirname + '/public'));


    server.use(express.bodyParser());
    
    //.use(express.session());
});

server.post( '/urqa_wrapper', function( req, res ){
	//res.send('{"test":"aaa"}');

	var uri = req.body.data.uri;
	var data = req.body.data.data;

	args ={
        data:data
    };

	client.post( uri, args, function(data, response){
            // parsed response body as js object
            console.log(data);
            // raw response
            //console.log(response);

            res.send( data );
	});
});

server.listen(3000);
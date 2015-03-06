var express   = require('express');
var app     = express();
var bodyParser = require('body-parser')
var fs = require('fs');
// app.use(require('body-parser')());
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
// app.use(require('method-override')());
app.use("/styles", express.static(__dirname + '/styles'));
app.use("/scripts", express.static(__dirname + '/scripts'));
app.use("/public", express.static(__dirname + '/public'));
app.use("/views", express.static(__dirname + '/views'));

app.get('/', function(req,res){
  console.log('I have got /');
  res.sendFile(__dirname + '/index.html');
 
});
app.get('*', function(req, res){
app.post('/userCheck', function(req, res){

	console.log(req.body.username, req.body.password);
	res.send('ok');
})



});
app.listen(3000);
console.log('App listening on port 3000');
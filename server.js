var express   = require('express');
var app     = express();

// app.use(require('body-parser')());
// app.use(require('method-override')());
app.use("/styles", express.static(__dirname + '/styles'));
app.use("/scripts", express.static(__dirname + '/scripts'));
app.use("/public", express.static(__dirname + '/public'));

app.get('/index', function(req,res){
  console.log('I have got index request');
  res.sendFile(__dirname + '/index.html');
 
});
app.get('*', function(req, res){

res.redirect('/index');


});
app.listen(3000);
console.log('App listening on port 3000');
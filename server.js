var express   = require('express');
var app     = express();


app.use(express.static(__dirname + '/public'));
// app.use(require('body-parser')());
// app.use(require('method-override')());


app.get('/index', function(req,res){
  console.log('I have got index request');
  
 res.sendFile(__dirname + '/index.html');
 
});

app.listen(3000);
console.log('App listening on port 3000');
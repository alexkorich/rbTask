var express   	= require('express');
var app     	= express();
var bodyParser  = require('body-parser');
var mongoose 	= require('mongoose');
var db			= require('./db/db.js')


app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.use("/styles", express.static(__dirname + '/styles'));
app.use("/scripts", express.static(__dirname + '/scripts'));
app.use("/public", express.static(__dirname + '/public'));
app.use("/views", express.static(__dirname + '/views'));

app.get('/', function(req,res){
  console.log("I've got /");
  res.sendFile(__dirname + '/index.html');
 
});

app.post('/userCheck', function(req, res){
	var msg='';
	console.log('userCheck: ', req.body.username, req.body.password);
	db.user.findOne({name:req.body.username}, function(err, user){
		if (user===null)	
		{
			console.log("not found!");
			msg="notFound";	
		} else if(req.body.password !=user.password){
			console.log("wrong pass!");
			msg="wrongPass";
		} else {msg="ok" }
		res.send(msg);
	})
	
});


app.post('/createProject', function(req, res){
	var msg='';
	console.log('createProject!');
	console.log('createProject: ', req.body.username, req.body.projectName);
	db.project.findOne({username:req.body.username, name:req.body.projectName}, function(err, project){
		if (project===null)	
		{
			console.log("not found, creating");
			db.project.create({username:req.body.username, name:req.body.projectName}, function(err, project){


			});
			msg="ok";	
		} else{
			console.log("project already exist!");
			msg="already";
		}
		res.send(msg);
	});
	
});



app.post('/loadProjects', function(req, res){
console.log("loadProjects! "+req.body.username);
db.project.find({username:req.body.username}, function(err, project){
	console.log(project);
	res.send(project);
})

});

app.post('/newUser', function(req, res){
	console.log("newUser! "+ " username:"+req.body.username, " password:"+req.body.username);
	db.user.findOne({name:req.body.username}, function(err, user){
		console.log(user+"findooone")
		if(user===null){
			db.user.create({
				name: 	req.body.username,
				password: 	req.body.password
			}, function(err, user){
				console.log("created!", user);
				});
			res.send("ok");
		}else{res.send("already");}	
	});

});




// exports.create = function(req, res){
// 	console.log('I have got POST HTTP request /admin/create');
// 	logindb.userModel.create({
// 		username: 	req.body.username,
// 		password: 	req.body.password,
// 		firstName: 	req.body.firstName,
// 		lastName: 	req.body.lastName,
// 		role: 		req.body.role,
// 		admin: 		false
// 		}, function(err, user){
// 			console.log('user was created' + user);
// 		});
// };


app.listen(3000);
console.log('App listening on port 3000');
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
		if (err) {console.log("database error!");
		msg="ok";}
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

app.post('/addTask', function(req, res){
	var msg='';
	console.log('addTask!');
	console.log('addTask: ', req.body.username, req.body.projectName, req.body.content);
	db.project.findOne({username:req.body.username, name:req.body.projectName}, function(err, project){
		var tasksCount=project.tasks.length+1;
		var deadLine=new Date();
		project.tasks.push({order:tasksCount, content:req.body.content, deadline: deadLine, isDone : false})
		project.save(function (err) {
        if(err) {

            console.error('ERROR!');
        }
        console.log("saved!")
    	});
		res.send("ok");
	});
	
});

app.post('/deleteTask', function(req, res){
	var msg='';
	console.log('deleteTask!');
	console.log('deleteTask: ', req.body.username, req.body.projectName, req.body.task);
	db.project.update({username:req.body.username, name:req.body.projectName}, 

		{$pull: {'tasks': {'content': req.body.task}}}, function(err, project){
			console.log("LIIIIII"+project);
		});
		
		res.send("ok");

});


app.post('/deleteProject', function(req, res){
	var msg='';
	console.log('deleteProject!');
	console.log('deleteProject: ', req.body.username, req.body.projectName);
	db.project.findOne({username:req.body.username, name:req.body.projectName})
	.remove()
	.exec(function(err, project){
		if (project===null)	
		{
			console.log("not found? can't remove");
			msg="notFound";	
		} else{
			console.log("removed!");
			msg="ok";
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
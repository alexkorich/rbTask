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
			db.project.create({username:req.body.username, name:req.body.projectName, showEdit:false}, function(err, project){


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
	console.log('addTask: ', req.body.username, req.body.projectName, req.body.content, req.body.deadline);
	db.project.findOne({username:req.body.username, name:req.body.projectName}, function(err, project){
		var tasksCount=project.tasks.length+1;
		project.tasks.push({order:tasksCount, content:req.body.content, deadline: req.body.deadline, isDone : false, showEdit:false})
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
	console.log('deleteTask: ', req.body.username, req.body.projectName, req.body.taskId);
	db.project.findOne({username:req.body.username, name:req.body.projectName}, function(err, project){
		var d='';
		var tasks=project.tasks;
		for (var i=0; i<tasks.length; i++){
			if(tasks[i]._id===req.body.taskId){
				d=i;
				 }
			}
		tasks.splice(d, 1);
		console.log("splice"+tasks);
		for (var i=0; i<tasks.length; i++){
			tasks[i].order=i+1
			};
			console.log("splice2"+tasks);
	project.save(function (err) {
        if(err) {

            console.error('ERROR!');
        }
        console.log("saved!")
    	});
		res.send("ok");

	});
});

app.post('/checkTask', function(req, res){
	var msg='';
	console.log('checkTask!');
	console.log('checkTask: ', req.body.username, req.body.projectName, req.body.taskId);
	db.project.findOne({username:req.body.username, name:req.body.projectName}, function(err, project){
	 	var task1=project.tasks.id(req.body.taskId);
	 	if (task1.isDone){
			task1.isDone=false;

	 	}
	 	else{
	 		task1.isDone=true;
	 	}
	 	console.log(task1+"lil");
		project.save(function (err) {
        if(err) {

            console.error('ERROR!');
        }
        console.log("saved!")
    	});
		res.send("ok");
	});
});

app.post('/downTask', function(req, res){
	var msg='';
	console.log('downTask!');
	console.log('downTask: ', req.body.username, req.body.projectName, req.body.taskId);
	db.project.findOne({username:req.body.username, name:req.body.projectName}, function(err, project){
	 	var task1=project.tasks.id(req.body.taskId);
	 	var task2;
		var tasks=project.tasks;
				 	for (var i=0; i<tasks.length; i++){
				 		console.log(tasks[i].order);
				 		if(tasks[i].order==task1.order+1){
				 			task2=tasks[i];
				 			console.log(task2);
				 		}
				 	}
				 	task2.order=task1.order;
				 		task1.order=task1.order+1;
		project.save(function (err) {
        if(err) {
            console.error('ERROR!');
        }
        console.log("saved!")
    	});
		res.send("ok");
	
	});
});




app.post('/upTask', function(req, res){
	var msg='';
	console.log('upTask!');
	console.log('upTask: ', req.body.username, req.body.projectName, req.body.taskId);
	db.project.findOne({username:req.body.username, name:req.body.projectName}, function(err, project){
	 	var task1=project.tasks.id(req.body.taskId);
	 	var task2;
			var tasks=project.tasks;
				 	for (var i=0; i<tasks.length; i++){
				 		console.log(tasks[i].order);
				 		if(tasks[i].order==task1.order-1){
				 			task2=tasks[i];
				 			console.log(task2);
				 		}
				 	}
				 	task2.order=task1.order;
				 		task1.order=task1.order-1;
				 		project.save(function (err) {
        if(err) {

            console.error('ERROR!');
        }
        console.log("saved!")
    	});
		res.send("ok");
	
	});
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
	console.log("newUser! "+ " username:"+req.body.username, " password:"+req.body.password);
	db.user.findOne({name:req.body.username}, function(err, user){
		console.log(user+"findooone")
		if(user==null){
			db.user.create({
				name: 	req.body.username,
				password: 	req.body.password
			}, function(err, user){
				console.log("created!", user);
				});
			res.send("ok");
		}else{
			console.log("already")
			res.send("already");}	
	});

});

app.listen(3000);
console.log('App listening on port 3000');
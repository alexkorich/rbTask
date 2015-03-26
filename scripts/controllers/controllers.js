var rbControllers = angular.module('rbControllers', []);

rbControllers.controller('projectsControl', function($rootScope, $scope, $location, $http){
	//vars
	$scope.isListShow=false;
	$scope.newProject='';
	$scope.newProjectName='';
	$scope.newTaskName='';
	$scope.errNewProject='';
	$scope.errNewTask='';
	$scope.newTaskDeadline='';
	//functions
	$scope.logout =function(){
		$rootScope.username=null;
		$location.path("/");
	}

	$scope.start = function(){
		$scope.projects={};
		$scope.user={};
		$scope.user.username=$rootScope.username;
		if ($rootScope.username==null){
			$location.path("/");
				}
		console.log($scope.user.username);
		$scope.reload();
	}

	$scope.reload= function(){
		$http.post('/loadprojects', $scope.user)
		.success(function(res, err){
			console.log('projects loaded');
			$scope.projects=res;

		})
	}

	$scope.createProject =function(projectName){
		var msg='';
		if(projectName.length<1){
			console.log("projectName empty")
			$scope.errNewProject="Enter project name";
		}
		else{
			$http.post('/createProject', {username:$scope.user.username, projectName:projectName})
			.success(function(res, err){
				if(res==="already"){
					$scope.errNewProject="Project with this name is already exist";


				}

				if(res==="ok")
					{$scope.reload();
						$scope.newProject='';
						$scope.errNewProject='';
						}	
					})
		};
	}

	$scope.deleteProject =function(projectName){
		console.log("delete!")
		$http.post('/deleteProject', {username:$scope.user.username, projectName:projectName})
			.success(function(res, err){
				if(res==="ok")
					{$scope.reload();}
						
					})
	}

	$scope.toProject =function(projectID){
		$rootScope.projectID=projectID;
		$location.path("tasks");
	}

	$scope.addTask= function(content, deadLine, projectName){
		if(content==='' || content===null){
			$scope.errNewTask="Enter task";

		}else if(deadLine==='' || deadLine===null){

			$scope.errNewTask="Enter deadline for a task";
		}
		else{
		console.log("addTask!")
		$http.post('/addTask', {username:$scope.user.username, projectName:projectName, content:content, deadline:deadLine})
			.success(function(res, err){
				if(res==="ok")
					{	$scope.errNewTask='';
						$scope.reload();}
						
					})}
	}
	$scope.deleteTask= function(taskId, projectName){
		console.log("deleteTask!"+ taskId)
		$http.post('/deleteTask', {username:$scope.user.username, projectName:projectName, taskId:taskId})
			.success(function(res, err){
				if(res==="ok")
					{$scope.reload();}
						
					})
	}

	$scope.upTask =function(task, projectName){
		console.log(task);
		if (task.order===1)
		{
			console.log("first!")
			return;}
			else{	
				$http.post('/upTask', {username:$scope.user.username, projectName:projectName, taskId:task._id})
					.success(function(res, err){
						if(res==="ok")
						{$scope.reload();}
											
										})


			}


	}
	$scope.showProjectEdit = function(){
		if(this.project.showEdit){
			this.project.showEdit=false;
			this.newProjectName='';
			$scope.errNewTask='';
		}else{
			this.project.showEdit=true;
			this.newProjectName=this.project.name;
		}
	}

	$scope.showTaskEdit = function(){
		if(this.task.showEdit){
			this.task.showEdit=false;
			this.newTaskName='';
			$scope.errNewTask='';
		}else{
			this.task.showEdit=true;
			this.newTaskName=this.task.content;
		}
	}






	$scope.changeProjectName =function(project, newProjectName){
			console.log("change pr name!")
			if(newProjectName){
				
				
			$http.post('/changeProjectName', {username:$scope.user.username, projectName:project.name, newProjectName:newProjectName})
						.success(function(res, err){
							if(res==="ok")
								{$scope.reload();}
									
								})


			}else{
			$scope.errNewTask="Enter project name!";

			}
			
		}

	$scope.changeTaskName =function(task, newTaskName, projectName){
			console.log("change task name!")
			if(newTaskName){
				$http.post('/changeTaskName', {username:$scope.user.username, task:task, newTaskName:newTaskName, projectName:projectName})
					.success(function(res, err){
						if(res==="ok")
						{$scope.reload();}
						})
			}else{
			$scope.errNewTask="Enter task name!";

			}
			
		}
	$scope.downTask = function(task, projectName, project){
		if(task.order>=project.tasks.length){
			console.log("last!");
			return;
		}
		$http.post('/downTask', {username:$scope.user.username, projectName:projectName, taskId:task._id})
				.success(function(res, err){
					if(res==="ok")
					{$scope.reload();}
					})
		}
		

	$scope.checkTask= function(task, projectName){
		
		console.log("checkTask!"+ task)
		$http.post('/checkTask', {username:$scope.user.username, projectName:projectName, taskId:task._id})
			.success(function(res, err){
				if(res==="ok")
					{$scope.reload();}
						
					})
	}

	//end controller
});



rbControllers.controller('loginControl', function($rootScope, $scope, $location, $http){
	//vars
	$scope.username='';
	$scope.password='';
	$scope.newUsername='';
	$scope.newPassword='';
	$scope.newPassword2='';
	$scope.errLogin='';
	$scope.errNewUser='';
	

	//functions
	$scope.signIn = function(username, password){
		$scope.username=username;
		$scope.password=password;
		if (userCheck(username)){
		$http.post('/userCheck', {username:$scope.username, password:$scope.password})
		.success(function(res, err){
			if(res==="ok")
				{$rootScope.username=$scope.username;
					$location.path("projects");
					}	
				if(res==="notFound")
				{
					$scope.errLogin="User "+$scope.username+" doesn't exist!";
					
				}
				if(res==="wrongPass")
				{
					$scope.errLogin="Password you entered is incorrect. Please try again.";

				}
					$scope.username='';

					$scope.password='';
					
		})}
		else{$scope.errLogin="Enter an username."}
	};

	$scope.newUser = function(username, password1, password2){
		console.log("newUser!!");
		$scope.newUsername=username;
		$scope.newPassword=password1;
		if(userCheck(username) && passCheck(password1) && newPassCheck(password1, password2)){
			console.log("pass ok");
			$http.post('/newUser', {username:username, password:password1})
				.success(function(res, err){
					console.log(res);
					if(res==="already")
						{$scope.errNewUser="User with this nickname is already exist. Choose another nickname."}
					if(res==="ok")
						{
							$rootScope.username=$scope.newUsername;
							$location.path("projects");
							console.log("ok!")
						}
						
			})
		}
		else if(userCheck(username) && passCheck(password1)){
			$scope.errNewUser="Passwords do not match!"

		}
		else if(userCheck(username)){$scope.errNewUser="Password must contain at least 6 characters!"}
		else {$scope.errNewUser="Enter an username"}	
	};
	function userCheck(username){
		var i=true;
		if (username== null){
			i=false;
			console.log("userCheck fail");
			}
		return i;
	};

	function newPassCheck(pass1, pass2){
		if (passCheck(pass1) && pass1===pass2)
			{
			console.log("passCheck true");
			return true;
			}
		else return false;
	};

	function passCheck(password){
		if (password.length <= 5)
			return false;
		else return true;
	};


	
});
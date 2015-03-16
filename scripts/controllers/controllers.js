var rbControllers = angular.module('rbControllers', []);

rbControllers.controller('projectsControl', function($rootScope, $scope, $location, $http){
	//vars
	$scope.isListShow=false;
	$scope.newProjectName='';
	$scope.errNewProject='';
	$scope.errNewTask='';
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
						$scope.newProjectName='';
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

	$scope.addTask= function(content, projectName){
		if(content==null){
			$scope.errNewTask="Enter task";

		}
		else{
		console.log("addTask!")
		$http.post('/addTask', {username:$scope.user.username, projectName:projectName, content:content})
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
		if (username.length <= 0){
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
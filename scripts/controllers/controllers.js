var rbControllers = angular.module('rbControllers', []);

rbControllers.controller('projectsControl', function($rootScope, $scope, $location, $http){
//vars
$scope.isListShow=false;
$scope.newProjectName='';

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
	if(projectName===null){

	}
	else{
		$http.post('/createProject', {username:$scope.user.username, projectName:projectName})
		.success(function(res, err){
			if(res==="ok")
				{$scope.reload();
					}	
				if(res==="exist")
				{
					$scope.showExist=true;
					
				}
				if(res==="notPass")
				{
					$scope.notPass=true;

				}
					$scope.username='';
					$scope.password='';
		})
	};



}

$scope.deleteProject =function(){
}

$scope.toProject =function(projectID){
	$rootScope.projectID=projectID;
	$location.path("tasks");
}


});



rbControllers.controller('loginControl', function($rootScope, $scope, $location, $http){
	$scope.user={};
	$scope.username='';
	$scope.password='';
	$scope.newUsername='';
	$scope.newPassword='';
	$scope.newPassword2='';
	$scope.showExist=false;
	$scope.notPass=false;
	$scope.isNewUser=false;

	$scope.signIn = function(username, password){
		$scope.user.username=username;
		$scope.user.password=password;
		$http.post('/userCheck', $scope.user)
		.success(function(res, err){
			if(res==="ok")
				{$rootScope.username=$scope.user.username;
					$location.path("projects");
					}	
				if(res==="exist")
				{
					$scope.showExist=true;
					
				}
				if(res==="notPass")
				{
					$scope.notPass=true;

				}
					$scope.username='';
					$scope.password='';
		})
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


	$scope.newUser = function(username, password1, password2){
		console.log("newUser!!");
		$scope.user.username=username;
		$scope.user.password=password1;
		if(userCheck(username) && newPassCheck(password1, password2)){
			console.log("pass ok");
			$http.post('/newUser', $scope.user)
				.success(function(res, err){
					console.log(res);
					if(res==="exist")
						{}
					if(res==="ok")
						{
							$rootScope.username=$scope.user.username;
							$location.path("projects");
							console.log("ok!")
						}
						
		})
	}
	};
});
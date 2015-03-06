var rbControllers = angular.module('rbControllers', []);

rbControllers.controller('projectsControl', function($rootScope, $scope, $location, $http){
 $scope.start = function(){
 console.log($rootScope.username);


 }

});


rbControllers.controller('tasksControl', function($rootScope, $scope, $location, $http){

  });

rbControllers.controller('loginControl', function($rootScope, $scope, $location, $http){
	$scope.user={};
$scope.username='';
$scope.password='';

$scope.signIn = function(username, password){
	$scope.user.username=username;
	$scope.user.password=password;
$http.post('/userCheck', $scope.user)
	.success(function(res, err){
		if(res==="ok")
			{$rootScope.username=$scope.user.username;
				$location.path("projects");
				$scope.username='';
				$scope.password='';

			}	
	})




}
});
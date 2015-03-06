var rbControllers = angular.module('rbControllers', []);

rbControllers.controller('projectsControl', function($rootScope, $scope, $location, $http){
  // $scope.myForm={};
  $scope.start = function(){
    
    }

    $scope.toLogin     = function(){
            $location.path('/login');
        }

           $scope.toProjects     = function(){
            $location.path('/searchDoc');
        }
  //end        
});


rbControllers.controller('tasksControl', function($rootScope, $scope, $location, $http){

  //funcions
  $scope.toIndex     = function(){
       $location.path('/doc');
    }
  


  });

rbControllers.controller('loginControl', function($rootScope, $scope, $location, $http){
  // $scope.isNewUser=false;
  // // $scope.signUp =function(){
  // //   $scope.isNewUser=true;


  // }
});
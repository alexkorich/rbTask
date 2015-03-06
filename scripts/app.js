var rbApp = angular.module('rbApp', [
	'ngRoute',
	'rbControllers'
	]);

rbApp.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
        when('/', {
                templateUrl: "/views/login.html",
                controller: "loginControl"
            }).
               when('/projects', {
                templateUrl: '/views/projects.html',
                controller: 'projectsControl'
            }).
            when('/tasks', {
                templateUrl: '/views/tasks.html',
                controller: 'tasksControl'
            }).
            otherwise({redirectTo: '/'})
			
}]);
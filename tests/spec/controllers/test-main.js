describe('Unit: projectsControl', function() {
  // Our tests will go here
   beforeEach(module('rbApp'));
     var ctrl, scope;
  // inject the $controller and $rootScope services
  // in the beforeEach block
  beforeEach(inject(function($controller, $rootScope) {
    
    rootScope = $rootScope;
            // Create a new scope that's a child of the $rootScope
    scope = $rootScope.$new();
    // Create the controller
    ctrl = $controller('projectsControl', {
      $scope: scope
    });
  }));


  it('should logout',
    function() {
      scope.logout();
      expect(scope.username).toEqual(null);
  });
})



describe('Unit: loginControl', function() {
  // Our tests will go here
   beforeEach(module('rbApp'));
     var ctrl, scope;
  // inject the $controller and $rootScope services
  // in the beforeEach block
  beforeEach(inject(function($controller, $rootScope) {
    // Create a new scope that's a child of the $rootScope
    scope = $rootScope.$new();
    // Create the controller
    ctrl = $controller('loginControl', {
      $scope: scope
    });
  }));


  it('should check new user creation',
    function() {
       scope.newUser();
      expect(scope.errNewUser).toEqual("Enter an username");
  },
  function() {
    scope.newUser()


    
  });
})
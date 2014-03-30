var guano = angular.module('guano', ['ngRoute']);

guano.controller('MainController', function ($scope, $location) {
    $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    };

    $scope.message = "PANTS";
});

guano.controller('AboutController', function ($scope) {
  $scope.message = 'This is about screen';
});

guano.controller('RootController', function ($scope) {
  $scope.message = 'This is root screen';
});

guano.config(
  function ($routeProvider, $locationProvider) {
    $routeProvider.
    when('/about', {
      templateUrl: 'templates/about.html',
      controller: 'AboutController'
    }).
     when('/', {
      templateUrl: 'templates/root.html',
      controller: 'RootController'
    })

    $locationProvider.html5Mode(true);
  });

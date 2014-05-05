var mangrove = angular.module('mangrove', ['ngRoute', 'ui.bootstrap', 'mangrovePorts', 'mangroveBlacklist']);

mangrove.controller('MainController', function ($scope, $location) {
  $scope.isActive = function (viewLocation) {
    return viewLocation === $location.path();
  };
});

mangrove.controller('PageController', function ($scope) {
  $scope.message = 'This is something';
});

mangrove.config(
  function ($routeProvider, $locationProvider) {
    $routeProvider.
    when('/ports.html', {
      templateUrl: 'templates/ports.html',
      controller: 'PortsController',
      controllerAs: 'ports'
    }).
    when('/blacklist.html', {
      templateUrl: 'templates/blacklist.html',
      controller: 'BlacklistController',
    }).
    when('/about.html', {
      templateUrl: 'templates/about.html',
      controller: 'PageController'
    }).
    when('/', {
      templateUrl: 'templates/root.html',
      controller: 'PageController'
    });

    $locationProvider.html5Mode(true);
});

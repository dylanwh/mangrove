var guano = angular.module('guano', ['ngRoute', 'ui.bootstrap']);

guano.controller('MainController', function ($scope, $location) {
  $scope.isActive = function (viewLocation) {
    return viewLocation === $location.path();
  };

  $scope.message = "PANTS";
});

guano.controller('PortsController', function ($scope) {
  $scope.ports = [
    { sourcePort: 22, destinationPort: 22, destinationAddress: '10.0.0.4' },
    { sourcePort: 23, destinationPort: 22, destinationAddress: '10.0.0.5' },
    { sourcePort: 24, destinationPort: 22, destinationAddress: '10.0.0.6' },
    { sourcePort: 25, destinationPort: 22, destinationAddress: '10.0.0.7' },
    { sourcePort: 26, destinationPort: 22, destinationAddress: '10.0.0.8' },
  ];

  $scope.save = function () {
    console.log($scope.ports);
  };

  $scope.add = function () {
    $scope.ports.push({
      sourcePort: 22,
      destinationPort: 22,
      destinationAddress: '10.0.0.4'
    });
  };
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
    when('/ports.html', {
      templateUrl: 'templates/ports.html',
      controller: 'PortsController'
    }).
    when('/about.html', {
      templateUrl: 'templates/about.html',
      controller: 'AboutController'
    }).
     when('/', {
      templateUrl: 'templates/root.html',
      controller: 'RootController'
    });

    $locationProvider.html5Mode(true);
  });

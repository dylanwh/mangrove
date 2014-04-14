var guano = angular.module('guano', ['ngRoute', 'ui.bootstrap']);

guano.controller('MainController', function ($scope, $location) {
  $scope.isActive = function (viewLocation) {
    return viewLocation === $location.path();
  };

  $scope.message = "PANTS";
});

guano.controller('PortsController', function ($scope, $http) {
  $scope.ports = [ ];
  var ports = $http.get("/api/ports");

  ports.success(function(data, status, headers, config) {
    $scope.ports = data;
  });
  ports.error(function(data, status, headers, config) {
    alert("AJAX failed!");
  });

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

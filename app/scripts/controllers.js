var mangrove = angular.module('mangrove', ['ngRoute', 'ui.bootstrap']);

mangrove.controller('MainController', function ($scope, $location) {
  $scope.isActive = function (viewLocation) {
    return viewLocation === $location.path();
  };

  $scope.message = "PANTS";
});

mangrove.directive('mgFocus', function ($timeout) {
  return function (scope, elem, attrs) {
    scope.$watch(attrs.mgFocus, function (newval) {
      console.log(newval);
      if (newval) {
        elem[0].focus();
      }
    });
  };
});

mangrove.directive('mgFocusSelect', function ($timeout) {
  return function (scope, elem, attrs) {
    scope.$watch(attrs.mgFocusSelect, function (newval) {
      console.log(newval);
      if (newval) {
        elem[0].focus();
        elem[0].select();
      }
    });
  };
});



mangrove.controller('PortsController', function ($scope, $http) {
  $scope.ports = [ ];
  $scope.dirty = false;
  $scope.changed = {};
  $scope.editable = {};
  $scope.focus = null;

  var getPorts = $http.get("/api/ports/eth0");
  getPorts.success(function(data, status, headers, config) {
    $scope.ports = data;
  });
  getPorts.error(function(data, status, headers, config) {
    console.log("AJAX Failed: ", status, data);
  });

  $scope.save = function () {
    var putPorts = $http.put("/api/ports/eth0", $scope.ports);
    putPorts.success(function(data, status, headers, config) {
        $scope.dirty = false;
    });
    putPorts.error(function(data, status, headers, config) {
        alert("Save failed!");
    });

  };

  $scope.add = function () {
    $scope.dirty = true;
    $scope.ports.push({
      port: 0,
      destination_port: 0,
      destination_address: ''
    });
  };

  $scope.edit = function (port, field) {
    $scope.editable[ port.$$hashKey ] = true;
    $scope.focus = { port: port, field: field };
  };

  $scope.done = function(port, field) {
    $scope.editable[ port.$$hashKey ] = false;
  };

  $scope.change = function(port) {
      $scope.dirty = true;
      $scope.changed[port.$$hashKey] = true;
  }

  $scope.isEditable = function(port) {
      return !!$scope.editable[ port.$$hashKey ];
  };

  $scope.isFocused = function(port, field) {
      if ($scope.focus) {
          if (field) {
            return $scope.focus.port == port && $scope.focus.field == field;
          }
          else {
            return $scope.focus.port == port;
          }
      }
      else {
          return false;
      }
  };

  $scope.isChanged = function(port) {
      return !!$scope.changed[port.$$hashKey];
  };

  $scope.remove = function(port) {
    $scope.dirty = true;
    $scope.ports = $scope.ports.filter(function (p) { return p.$$hashKey !== port.$$hashKey; });
  };
});

mangrove.controller('AboutController', function ($scope) {
  $scope.message = 'This is an about screen';
});

mangrove.controller('RootController', function ($scope) {
  $scope.message = 'This is root screen';
});

mangrove.config(
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

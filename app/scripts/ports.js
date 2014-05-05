angular.module('mangrovePorts', [ 'mgDirectives' ]).
controller('PortsController', function ($scope, $http) {
  'use strict';

  $scope.ports = [ ];
  $scope.dirty = false;

  var backup     =  {};
  var portKeys   =  ['id', 'port', 'destination_address', 'destination_port', 'description' ];
  var backupPort =  function(port) {
    var copy = {};
    portKeys.forEach(function(key) { copy[key] = port[key]; });
    backup[$scope.index] = copy;
  };

  var restorePort = function(port) {
    var copy = backup[$scope.index];
    portKeys.forEach(function(key) {
      port[key] = copy[key];
    });
  };

  $scope.save = function () {
    var putPorts = $http.put("/api/ports/eth0", $scope.ports);
    putPorts.success(function(data, status, headers, config) {
        $scope.dirty = false;
        $scope.reset();
    });
    putPorts.error(function(data, status, headers, config) {
        alert("Save failed!");
    });
  };

  $scope.add = function () {
    $scope.dirty = true;
    if (! ($scope.ports instanceof Array)) {
      $scope.ports = [];
    }
    $scope.ports.push({  port: 0, destination_port: null, destination_address: '' });
  };

  $scope.remove = function() {
    $scope.dirty = true;
    $scope.ports.splice($scope.index, 1);
  };

  $scope.edit = function (port, field) {
    backupPort(port);
    port._editable = true;
    port._focus    = field;
  };

  $scope.cancel = function(port) {
    restorePort(port);
    port._editable =  false;
    port._changed  =  false;
    port._focus    =  false;
    $scope.done(port);
  };

  $scope.reset = function() {
    var getPorts = $http.get("/api/ports/eth0");
    getPorts.success(function(data, status, headers, config) {
      console.log("got ports", data);
      $scope.ports = data.ports;
    });
    getPorts.error(function(data, status, headers, config) {
      $scope.error = data.error;
      console.log("AJAX Failed: ", status, data);
    });

    $scope.dirty = false;
  };

  $scope.done = function(port) {
    port._editable = false;
  };

  $scope.change = function(port, field) {
      $scope.dirty = true;
      if (typeof(port._changed) == 'undefined' || port._changed === null) {
        port._changed = {};
      }

      port._changed[field] = true;
  };

  $scope.focus = function(port, $field) { };

  $scope.blur = function(port, field) { };

  $scope.isEditable = function(port) {
      return port._editable;
  };

  $scope.mustFocus = function(port, field) {
    if (port._focus && field && port._focus == field) {
      return true;
    }
    else {
      return false;
    }
  };

  $scope.isChanged = function(port, field) {
      if (port._changed) {
        if (!field) {
          return true;
        }
        else {
          if (field in port._changed) {
            return port._changed[field];
          }
        }
      }
  };
});

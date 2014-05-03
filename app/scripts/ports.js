angular.module('mangrovePorts', [ 'mgDirectives' ]).
controller('PortsController', function ($scope, $http) {
  'use strict';

  $scope.ports = [ ];
  $scope.dirty = false;

  var backup   = {};
  var currentFocus = null;

  var portKeys = ['id', 'port', 'destination_address', 'destination_port', 'description' ];
  var backupPort = function(port) {
    var copy = {};
    portKeys.forEach(function(key) {
      copy[key] = port[key];
    });
    backup[$index] = copy;
  };

  var restorePort = function(port) {
    var copy = backup[$index];
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
    console.log( $scope.ports);
    if (! ($scope.ports instanceof Array)) {
      $scope.ports = [];
      id = 1;
    }
    $scope.ports.push({  port: 0, destination_port: 0, destination_address: '' });
  };

  $scope.remove = function($index) {
    $scope.dirty = true;
    // $scope.ports.splice($index, 1);
    alert($scope.index);
  };

  $scope.edit = function (port, field) {
    backupPort(port);
    port._editable = true;
    port._focus    = field;
  };

  $scope.cancel = function(port) {
    restorePort(port);
    port._editable = false;
    port._changed  = false;
    port._focus = false;
    $scope.done(port);
  };

  $scope.reset = function() {
    var getPorts = $http.get("/api/ports/eth0");
    getPorts.success(function(data, status, headers, config) {
      console.log("got ports", data);
      $scope.ports = data;
    });
    getPorts.error(function(data, status, headers, config) {
      console.log("AJAX Failed: ", status, data);
    });

    $scope.dirty = false;
  };

  $scope.done = function(port) {
    $scope._editable = false;
  };

  $scope.change = function(port, field) {
      $scope.dirty = true;
      if (typeof(port._changed) == 'undefined' || port._changed == null) {
        port._changed = {};
      }

      port._changed[field] = true;
  };

  $scope.focus = function(port, $field) {
  };

  $scope.blur = function(port, field) {
      if (field == 'port' && !changed[$index].destination_port) {
        port.destination_port = port.port;
      }
  };

  $scope.isEditable = function(port) {
      return port._editable;
  };

  $scope.mustFocus = function(port, field) {
      if (currentFocus) {
          if (field) {
            return currentFocus.port == port && currentFocus.field == field;
          }
          else {
            return currentFocus.port == port;
          }
      }
      else {
          return false;
      }
  };

  $scope.isChanged = function(port) {
      return !!port._changed;
  };

});



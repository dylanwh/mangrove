angular.module('mangroveBlacklist', ['ngResource']).
controller('BlacklistController', function ($scope, $resource) {
  'use strict';

  var Blacklist = $resource('/api/blacklist/:blacklist_id', { blacklist_id: '@id' });

  var hosts = Blacklist.query(function() {
    $scope.hosts = hosts;
  });

  $scope.add = function() {
    var newEntry = new Blacklist({
      reason: this.reason,
      address: this.address
    });
    this.reason = '';
    this.address = '';
    newEntry.$save();

  };

  $scope.remove = function(host, index) {
    $scope.hosts.splice(index, 1);
  };

});

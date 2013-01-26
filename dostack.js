doStackApp = angular.module('doStackApp', ['ngResource']);

doStackApp.controller('AppCtrl', function AppCtrl($scope, $location, doStackStorage, filterFilter) {
  var items = $scope.items = doStackStorage.get();

  $scope.$watch('items', function() {
    doStackStorage.put(items);
  }, true);

  $scope.remaining = function() {
    return _.reduce(items, function(count, item) {
      return count + (item.done ? 0 : 1);
    }, 0);
  }

  $scope.add = function(newItem) {
    var item = {text: newItem.text, done: false};
    items.push(item);
    newItem.text = '';
  };
});

doStackApp.factory( 'doStackStorage', function() {
  var STORAGE_ID = 'dostack';

  return {
    get: function() {
      return JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
    },

    put: function( items ) {
      localStorage.setItem(STORAGE_ID, JSON.stringify(items));
    }
  };
});
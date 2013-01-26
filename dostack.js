doStackApp = angular.module('doStackApp', ['ngResource', 'filters']);

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

  $scope.add = function(input) {
    var item = {text: input.text, done: false};
    items.push(item);
    input.text = '';
  };

  $scope.remove = function(index) {
    var item = items.splice(index, 1)[0];
    item.$delete();
  }
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

angular.module('filters', []).filter('then', function () {
  return function (expr,output) {
    if (expr) {
      return output;
    }
  }
});
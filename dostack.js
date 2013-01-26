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
    items.splice(index, 1)[0];
  }

  $scope.start = function(index) {
    var item = items[index];
    item.started = new Date();
  }

  setInterval(function() {
    $scope.$apply();
  }, 1000)
});

doStackApp.factory( 'doStackStorage', function() {
  var STORAGE_ID = 'dostack';

  return {
    get: function() {
      var items = JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
      for(var i in items) {
        if (items[i].started) {
          items[i].started = new Date(items[i].started);
        }
      }
      return items;
    },

    put: function( items ) {
      localStorage.setItem(STORAGE_ID, JSON.stringify(items));
    }
  };
});

angular.module('filters', [])
  .filter('then', function () {
    return function (expr,output) {
      if (expr) {
        return output;
      }
    }
  })
  .filter('timer', function () {
    return function(item) {
      if(item.started) {
        var seconds = Math.floor((new Date() - item.started) / 1000);
        var minutes = Math.floor(seconds / 60);
        return seconds >= 60 ? minutes + "m" : seconds + "s";
      }
    }
  });
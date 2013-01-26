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
    var item = new Item({text: input.text, done: false});
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
      return _.map(JSON.parse(localStorage.getItem(STORAGE_ID) || '[]'), function(attrs) {
        return new Item(attrs);
      });
    },

    put: function( items ) {
      var hashes = _.map(items, function(item) {
        return item.asHash();
      });
      localStorage.setItem(STORAGE_ID, JSON.stringify(hashes));
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
        var seconds = item.duration();
        var minutes = Math.floor(seconds / 60);
        return seconds >= 60 ? minutes + "m" : seconds + "s";
      }
    }
  });

  function Item(attrs) {
    this.keys = ['text', 'done', 'started'];
    var item = this;
    _.each(this.keys, function(key) {
      var value = attrs[key];
      if (key == 'started' && typeof attrs[key] == 'string') {
        value = new Date(value);
      }
      item[key] = value;
    });
  }

  Item.prototype.duration = function() {
    return Math.floor((new Date() - this.started) / 1000)
  }

  Item.prototype.isFinished = function() {
    return this.duration() >= 25 * 60;
  }

  Item.prototype.asHash = function() {
    var item = this;
    return _.reduce(this.keys, function(attrs, key) {
      attrs[key] = item[key];
      return attrs;
    }, {});
  }


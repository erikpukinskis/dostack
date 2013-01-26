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

  $scope.alerts = function() {
    _.each(items, function(item) {
      item.checkForFinish();
    });
  }

  setInterval(function() {
    $scope.alerts();
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
  })
  .filter('times', function() {
    return function(count,output) {
      return Array(count+1).join(output);
    }
  })

  function Item(attrs) {
    this.keys = ['text', 'done', 'started', 'sessions'];
    var defaults = {done: false, sessions: 0};
    var item = this;
    _.each(this.keys, function(key) {
      var value = attrs[key] || defaults[key];
      if (key == 'started' && typeof attrs[key] == 'string') {
        value = new Date(value);
      }
      item[key] = value;
    });
  }

  Item.prototype.duration = function() {
    if (!this.started) { return null; }
    return Math.floor((new Date() - this.started) / 1000)
  }

  Item.prototype.isFinished = function() {
    return this.duration() >= 10;
  }

  Item.prototype.checkForFinish = function() {
      if(this.isFinished()) {
        alert("Stop working on " + this.text + "!");
        this.started = null;
        this.sessions++;
      }    
  }

  Item.prototype.asHash = function() {
    var item = this;
    return _.reduce(this.keys, function(attrs, key) {
      attrs[key] = item[key];
      return attrs;
    }, {});
  }


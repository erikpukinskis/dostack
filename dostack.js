doStackApp = angular.module('doStackApp', ['ngResource']);

doStackApp.controller('AppCtrl', function($scope) {
  var items = [
    {text: "hi", done: false},
    {text: "ho", done: false}
  ];

  $scope.items = items;

  $scope.remaining = function() {
    return _.reduce(items, function(count, item) {
      return count + (item.done ? 0 : 1);
    }, 0);
  }
});
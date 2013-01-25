doStackApp = angular.module('doStackApp', ['ngResource']);

doStackApp.controller('AppCtrl', function($scope) {
  var items = [
    {text: "hi", done: false},
    {text: "ho", done: false}
  ];

  $scope.items = items;

});
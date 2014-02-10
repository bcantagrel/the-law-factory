'use strict';

/* Controllers */

angular.module('theLawFactory.controllers', []).
  controller('mainCtrl', function ($scope, $http, apiService, $rootScope) {

    $scope.error = {}
    $scope.lawlistUrl = 'laws/list'
    $scope.dataUrl = 'data/articles.js'
    $scope.amdUrl = 'data/amendements.js'
    $scope.dataSample = {}
    
  })

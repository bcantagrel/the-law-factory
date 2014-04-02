'use strict';

/* Controllers */

angular.module('theLawFactory.controllers', []).
  controller('mainCtrl', function ($scope, $http, apiService, $rootScope, $location) {
	
	$scope.go = function ( path ) {
		console.log($location.path( "/" + path +"l="+$rootScope.l ))
	  $location.path( path ).search("l="+$rootScope.l);
	  //+"l="+$rootScope.l
	};
	
    $scope.error = {}
    $scope.lawlistUrl = 'laws/list'
    $scope.procedureUrl = 'law-procedure/'
    $scope.dataUrl = 'law-article/'
    $scope.amdUrl = 'law-amendments/'
    $scope.intUrl = 'law-interventions/'
    $scope.dossierUrl='http://www.lafabriquedelaloi.fr/api/dossiers_0_49.json'
    $scope.statsUrl='http://www.lafabriquedelaloi.fr/api/stats_dossiers.json'
    $scope.dataSample = {}
    
  })

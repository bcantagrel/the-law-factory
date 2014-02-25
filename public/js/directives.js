'use strict';

/* Directives */

angular.module('theLawFactory.directives', [])
  .directive('mod1', [ 'apiService', '$rootScope','$location', function (apiService,$rootScope,$location) {
    return {
      restrict: 'A',
      replace: false,
      templateUrl: 'templates/mod1.html',
      link: function postLink(scope, element, attrs) {
		
		
		var l="pjl09-200"
		
	        if($location.search()['l']!=null) l=$location.search()['l'];
	 		$("#search-btn").on("click",function() {
	 			$("body").css("overflow","hidden");
	 			$(".lawlist").effect( "slide", {"direction" : "","mode" : "show"}, 500 )
	 		})
		
      	var mod1 = thelawfactory.mod1();

        function update(){
			$(".lawlist").css("display","none")
      		apiService.getDataSample(scope.dataUrl+l).then(
            function(data){
              scope.dataSample = data;
              d3.select(element[0])
            		.datum(data)
            		.call(mod1)
            },
            function(error){
              scope.error = error
            }
            )
        }

      	scope.$watch('dataUrl', function(){
          update();
      	},true)

      }
    };
  }])
  .directive('mod2', [ 'apiService', '$rootScope', '$location','$compile', function (apiService,$rootScope,$location,$compile) {
    return {
      restrict: 'A',
      replace: false,
      templateUrl: 'templates/mod2.html',
      controller: function ($scope, $element, $attrs) {
      	
      	$scope.l="pjl09-602"
      	$scope.step = 0;
      	$scope.step_name = $location.search()['s'];
      	$scope.hasAmendements = true;
      	$scope.hasInterventions = true;
      	
      	$scope.loadStep = function(sect, ind) {
      		$scope.step = ind;
      		$scope.step_name = sect;
      		$(".step-curr").removeClass("step-curr")
      		console.log($(".stage:eq("+ind+")"))
      		$(".stage:eq("+ind+")").addClass("step-curr")
      		$location.search({l:$scope.l, s:$scope.step_name})
      	}
      	
      },
      link: function postLink(scope, element, attrs) {

	        if($location.search()['l']!=null) scope.l=$location.search()['l'];
	 		$("#search-btn").on("click",function() {
	 			$("body").css("overflow","hidden");
	 			$(".lawlist").effect( "slide", {"direction" : "","mode" : "show"}, 500 )
	 		})
		
      	var mod2 = thelawfactory.mod2();

        function update(){
			$(".lawlist").css("display","none")
			
			
      		apiService.getDataSample(scope.procedureUrl+scope.l+"?sect=amd").then(
            function(data){
            
              scope.dataSample = data;
              var len = 100/scope.dataSample.length;
              var newElement = $compile( "<div class='stage-container' style='float:left; width:"+len+"%' ng-repeat='el in dataSample'><ng-switch style='width:100%; height:100%;' on='el.amds'><div class='stage valid-step' ng-click='loadStep(el.step_name, $index)' ng-switch-when='true'>{{el.step_name.split('_').slice(2,4).join(' ')}}</div><div class='stage' ng-switch-default>{{el.step_name.split('_').slice(2,4).join(' ')}}</div></ng-switch></div>" )( scope );
              
			  element.find(".stages").append( newElement );
			  },
            function(error){
              scope.error = error
            })
			  
			  if($location.search()['s']!=null) {
			  	console.log("ahiahi")
			apiService.getDataSample(scope.amdUrl+scope.l+"/"+scope.step_name).then(
            function(data){
            
              scope.data = data;
                d3.select(element[0])
            		.datum(data)
            		.call(mod2)
            
			  },
            function(error){
              scope.error = error
            })
            
           }
            
        }
      	scope.$watch('amdUrl', function(){
          update();
      	},true)
      }
    };
  }])
  .directive('lawlist', ['apiService', '$rootScope', "$location",function (apiService,$rootScope,$location) {
    return {
      restrict: 'A',
      replace: false,
      template: '<input auto-complete id="search" placeholder="Search a law" ng-model="selected">',
      controller: function ($scope, $element, $attrs) {},
      link: function postLink(scope, element, attrs,lawlistCtrl) {

        function update(){

      		apiService.getDataSample(scope.lawlistUrl).then(
            function(data){
              scope.ll = data;
              //console.log(scope.ll)
            
              $("#search").autocomplete({
                source: function(request,response) {
	              	var matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), "i");
			        response(
			        	$.map($.grep(scope.ll, function(value) {
			            return matcher.test(value.title);
			        }),function(n,i) {	        	
			        	return {"label":n.title, "value":n.id}    	
			        })
		        );
             },
            open: function() {
             	
             	var h=$(".ui-autocomplete").position().top;
             	$(".ui-autocomplete").height($(window).height()-h);
             	
             },
             appendTo:".lawlist",
                select: function(event, ui) {
                    $rootScope.$apply(function() {
						$("body").css("overflow","auto");
				        $location.search("l="+ui.item.value);
				        
				      });
                }
            });
              
            },
            function(error){
              scope.error = error
            })
        }
      	scope.$watch('lawlistUrl', function(){
          update();
      	},true)

      }
    };
  }])



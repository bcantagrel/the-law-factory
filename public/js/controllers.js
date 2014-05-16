'use strict';

/* Controllers */

angular.module('theLawFactory.controllers', []).
    controller('mainCtrl', function ($scope, $http, apiService, $rootScope, $location) {

        $scope.error = {}

        $scope.spinner_opts = {
            lines: 13, // The number of lines to draw
            length: 20, // The length of each line
            width: 10, // The line thickness
            radius: 30, // The radius of the inner circle
            corners: 1, // Corner roundness (0..1)
            rotate: 0, // The rotation offset
            direction: 1, // 1: clockwise, -1: counterclockwise
            color: '#bbb', // #rgb or #rrggbb or array of colors
            speed: 1, // Rounds per second
            trail: 60, // Afterglow percentage
            shadow: false, // Whether to render a shadow
            hwaccel: false, // Whether to use hardware acceleration
            className: 'spinner', // The CSS class to assign to the spinner
            zIndex: 2e9, // The z-index (defaults to 2000000000)
            top: '50%', // Top position relative to parent
            left: '50%' // Left position relative to parent
        };

        $scope.shortNames = {
            "1ère lecture": "1<sup>ère</sup> Lect.",
            "2ème lecture": "2<sup>ère</sup> Lect.",
            "nouv. lect.": "Nouv. Lect.",
            "l. définitive": "Lect. Déf.",
            "assemblee": "AN",
            "assemblée nationale": "AN",
            "gouvernement": "Gouv.",
            "commission": "Com.",
            "hemicycle": "Hém.",
            "depots": "Dépôts",
            "depot": "Dépôt",
            "senat": "Sénat",
            "sénat": "Sénat"
        }

        $scope.longNames = {
            "1ère lecture": "1<sup>ère</sup> Lecture",
            "2ème lecture": "2<sup>ère</sup> Lecture",
            "nouv. lect.": "Nouvelle Lecture",
            "l. définitive": "Lecture Définitive",
            "assemblee": "Assemblée",
            "assemblée nationale": "Assemblée",
            "gouvernement": "Gouvernement",
            "commission": "Commission",
            "hemicycle": "Hémicyle",
            "senat": "Sénat",
            "depots": "Dépôts",
            "depot": "Dépôt",
            "cmp": "Commission Mixte Paritaire"
        }

        $scope.findShortName = function (l) {
            return ($scope.shortNames[l.toLowerCase()] ? $scope.shortNames[l.toLowerCase()] : l);
        }
        $scope.findLongName = function (l) {
            return ($scope.longNames[l.toLowerCase()] ? $scope.longNames[l.toLowerCase()] : l);
        }
        $scope.stepLegend = function (el){
            if (el.step==="depot") return (el.auteur_depot == "Gouvernement" ? "Projet de Loi" : "Proposition de Loi");
            else return $scope.findLongName(el.step);
        }
        $scope.stepLabel = function (el){
            if(el.step==="depot") return (el.auteur_depot == "Gouvernement" ? "PJL" : "PPL");
            return ($scope.total<10 ?$scope.findLongName : $scope.findShortName)(el.step);
        }

        $scope.string_to_slug = function (str) {
            str = str.replace(/^\s+|\s+$/g, ''); // trim
            str = str.toLowerCase();

            // remove accents, swap ñ for n, etc
            var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
            var to   = "aaaaeeeeiiiioooouuuunc------";
            for (var i = 0, l = from.length; i < l; i++) {
                str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
            }

            str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
                .replace(/\s+/g, '-') // collapse whitespace and replace by -
                .replace(/-+/g, '-'); // collapse dashes

            return str;
        }

	    $scope.adjustColor = function(c) {
            var col = d3.hsl(c);
            if (col.s>0.5) col.s = 0.5;
            if (col.l<0.7) col.l = 0.7;
            return col;
        }

        $scope.groups = {};

	    $scope.drawGroupsLegend = function() {
            var col, type;
            d3.entries($scope.groups)
            .sort(function(a,b) { return a.value.order - b.value.order; })
            .forEach(function(d) {
                col = $scope.adjustColor(d.value.color);
                type = (d.value.link !== "" ? 'colors' : 'others');
               $("."+type).append('<div class="leg-item" onclick="highlight(\''+d.key+'\');" title="'+d.value.nom+'" data-toggle="tooltip" data-placement="left"><div class="leg-value" style="background-color:'+col+'"></div><div class="leg-key">'+d.key+'</div></div>');
			});
            $(".leg-item").tooltip();
        }

        $scope.highlightGroup = function(group) {
            $(".text-container").empty();
            $("#text-title").html($scope.groups[group].nom);
            group = ".g_"+group.replace(/[^a-z]/ig, '');
            d3.selectAll("path").transition().attr("fill-opacity",0.1);
            d3.selectAll("rect").transition().style("opacity",0.1);
            d3.selectAll("path").filter(group).transition().attr("fill-opacity",0.3);
            d3.selectAll("rect").filter(group).transition().style("opacity", 0.9);
        }

        $scope.slugGroup = function(group) {
            return "g_" + group.replace(/[^a-z]/ig, '');
        }

        $scope.resetHighlight = function(type) {
            $(".text-container").empty();
            $("#text-title").html("Sélectionner un "+(type == "amds" ? "amendement" : "groupe d'orateurs"));
            d3.selectAll("rect").transition().style("opacity",0.9);
            d3.selectAll("path").transition().attr("fill-opacity",0.3);
            if (type == "amds") d3.selectAll(".actv-amd")
			.style("stroke","none" )
			.classed("actv-amd",false);
        }

    })

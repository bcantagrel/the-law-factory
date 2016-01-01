'use strict';

/* Workaround to trigger click on d3 element */
jQuery.fn.d3Click = function () {
    this.each(function (i, e) {
        var evt = document.createEvent("MouseEvents");
        evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        e.dispatchEvent(evt);
    });
};

/* Controllers */

angular.module('theLawFactory.controllers', ['theLawFactory.config']).
    controller('mainCtrl', function ($timeout, $scope, $http, apiService, api, $rootScope, $location) {
        $(".introjs-helperLayer").remove();
        $(".introjs-overlay").remove();

        $scope.mod = null;
        $scope.drawing = false;
        $scope.loi = $location.search()['loi'];
        $scope.etape = $location.search()['etape'];
        $scope.article = $location.search()['article'];
        $scope.action = $location.search()['action'];

        $scope.read = false;
        $scope.revs = true;
        $scope.readmode = function () {
            $(".text").css({"width": "93.43%", "left": "3.3%"});
            $(".gotomod").addClass('readmode');
            $scope.read = true;
        };
        $scope.viewmode = function () {
            $(".text").css({"width": "23.40%", "left": "73.3%"});
            $(".gotomod").removeClass('readmode');
            $scope.read = false;
        };
        $scope.hiderevs = function () {
            $scope.revs = false;
            return $scope.update_revs_view();
        };
        $scope.showrevs = function () {
            $scope.revs = true;
            return $scope.update_revs_view();
        };
        $scope.update_revs_view = function () {
            var d = d3.select('#viz .curr').data()[0];
            if ($scope.revs) {
                $(".art-txt").html(d.textDiff).animate({opacity: 1}, 350);
            } else {
                $(".art-txt").html(d.originalText).animate({opacity: 1}, 350);
            }
        };

        $scope.vizTitle = "";
        $scope.helpText = '<div id="help-msg"><p>VIZTEXT</p><p>Cliquez sur le bouton <span class="question_mark">?</span> ci-dessus pour voir un tutoriel interactif de cette visualisation.<p></div>';
        $scope.setHelpText = function (t) {
            $scope.helpText = $scope.helpText.replace("VIZTEXT", t);
        };
    });

'use strict';

app.controller('MandelbrotController', ['$scope','$timeout', 'usSpinnerService', function($scope, $timeout, usSpinnerService) {
    $scope.threadData = [];
    $scope.viewThreadInfo = false;
    $scope.isWorkEnded = false;
    $scope.downloadPicture = false;
    $scope.fractalLink = "";

    $scope.viewThreads = function() {
        $scope.viewThreadInfo = !$scope.viewThreadInfo;
    };

    $scope.showStatButton = function(dataUrl) {
        $timeout(function () {
            $scope.isWorkEnded = true;
            $scope.downloadPicture = true;
            $scope.fractalLink = dataUrl;
            $scope.fractalName = 'fractal_' + Date.now() + '.png';
        }, 100);
    };
}]);

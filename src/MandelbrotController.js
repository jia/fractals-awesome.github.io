'use strict';

app.controller('MandelbrotController', ['$scope', function($scope) {

	$scope.leftCorner = 0;
	$scope.rightCorner = 0;

	$scope.drawSet = function () {
		if (typeof mandelbrotObj !== 'undefined') {
			$scope.mObj = mandelbrotObj;
			$scope.leftCorner = mandelbrotObj.downLeftCorner.toString();
			$scope.rightCorner = mandelbrotObj.upRightCorner.toString();
		};
	};

}]);
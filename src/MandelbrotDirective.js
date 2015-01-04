app.directive('paint', function($window) {
	return function (scope, element, attra) {
		// onload canvas
		var ctx = element[0].getContext('2d');
		ctx.beginPath();
		ctx.canvas.width = 1000; // magrin
		ctx.canvas.height = 600; // navbar
		// onclick event 
		element.bind('mouseup',function(event) {
			if (!scope.mObj) {
				scope.drawSet();
				var pW = ctx.canvas.width;
				var pH = ctx.canvas.height;
				scope.mObj.setSize(pW, pH);

			} else {
				var mouseX = event.clientX - element[0].offsetLeft;
				var mouseY = event.clientY - element[0].offsetTop;
				console.log(mouseX, mouseY);
				// @TODO: set new corners
				scope.mObj.zoomIn(mouseX, mouseY);
			};
			for (var x = 0; x < ctx.canvas.width; x++) {
				for (var y = 0; y < ctx.canvas.height; y++) {
					var pixel = scope.mObj.toImage(x, y);
					ctx.fillStyle = "rgba(" + pixel.color.r + "," + pixel.color.g+","+pixel.color.b+",1)";
					ctx.fillRect( pixel.x, pixel.y, 1, 1 );
				};
			};
			scope.$apply(function () {
				scope.leftCorner = scope.mObj.downLeftCorner.toString();
				scope.rightCorner = scope.mObj.upRightCorner.toString();
			});
		});
	}
});
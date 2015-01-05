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

			if (typeof Worker !== 'undefined') {
				// multithreading
				var worker = new Worker('src/thread.js');
				// Event for receive data from thread
				worker.addEventListener('message', function(event) {
					var result = event.data;
					// console.log(result);
					for (var i = 0; i < result.length; i++) {
						var pixel = result[i];
						ctx.fillStyle = "rgba(" + pixel.color.r + "," + pixel.color.g+","+pixel.color.b+",1)";
						ctx.fillRect( pixel.x, pixel.y, 1, 1 );
					};
				});
				for (var x = 0; x < ctx.canvas.width; x++) {
					var data = {
						// 'scope' : scope,
						'x' : x,
						'width' : ctx.canvas.width,
						'height' : ctx.canvas.height,
					};
					// Start thread with args
					worker.postMessage(data);
				};
			} else {
				// calculate in single thread
				var start = new Date();
				for (var x = 0; x < ctx.canvas.width; x++) {
					for (var y = 0; y < ctx.canvas.height; y++) {
						var pixel = scope.mObj.toImage(x, y);
						ctx.fillStyle = "rgba(" + pixel.color.r + "," + pixel.color.g+","+pixel.color.b+",1)";
						ctx.fillRect( pixel.x, pixel.y, 1, 1 );
					};
				};
				var end = new Date() - start;
				console.log("First method. For " + pW + "x " + pH + " elapsed time: " + end / 1000 + " sec.");
			}


			scope.$apply(function () {
				scope.leftCorner = scope.mObj.downLeftCorner.toString();
				scope.rightCorner = scope.mObj.upRightCorner.toString();
			});
		});
	}
});
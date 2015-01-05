'use strict';

importScripts('architecture.js');

// Emulate concurrency
self.addEventListener('message', function(e) {
	var x = e.data.x;
	var w = e.data.width;
	var h = e.data.height;

	mandelbrotObj.setSize(w, h);

	var result = [];
	for (var y = 0; y < w; y++) {
		result.push(mandelbrotObj.toImage(x, y));
	};
	self.postMessage(result);

}, false);
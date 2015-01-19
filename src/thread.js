'use strict';

importScripts('architecture.js');

self.addEventListener('message', function(e) {
    var start = Date.now();
	console.log("Thread " +  (e.data.offset + 1) + " started at " + start);

	var w = e.data.width;
	var h = e.data.height;
	var countOfLines = e.data.count;
	var offset = e.data.offset * countOfLines;

	mandelbrotObj.setSize(w, h);

	var result = [];
	for (var x = 0; x < countOfLines; x++) {
		for (var y = 0; y < w; y++) {
			result.push(mandelbrotObj.toImage(x + offset, y));
		};
	};
    var end = Date.now();
	console.log("Thread " +  (e.data.offset + 1) + " finished at " + Date.now() + ". Elapsed time: " + ((end - start) / 1000) + " sec");
	self.postMessage({
		'id' : e.data.offset + 1, 
		'result' : result,
		'start' : start, 
		'end' : end
	});

}, false);
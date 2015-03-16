'use strict';

importScripts('architecture.js');

self.addEventListener('message', function(e) {
    var start = Date.now();

	var w = e.data.width;
	var h = e.data.height;
	var countOfLines = e.data.count;
	var offset = e.data.offset * countOfLines;

	var currentFractal = (e.data.isMandelbrot) ? glMB : glJ;
	currentFractal.setSize(w, h);

	if (!e.data.isMandelbrot) {
		currentFractal.setC(e.data.cx, e.data.cy);
	};

	var result = [];
	if(e.data.isZoom && e.data.mX != -1 && e.data.mY != -1) {
		currentFractal.zoomIn(e.data.mX, e.data.mY);
	}

	for (var x = 0; x < w; x++) {
		for (var y = 0; y < countOfLines; y++) {
			result.push(currentFractal.toImage(x, y + offset));
		};
	};		

    var end = Date.now();

	self.postMessage({
		'id' : e.data.offset + 1, 
		'result' : result,
		'start' : start, 
		'end' : end
	});

}, false);
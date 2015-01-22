'use strict';

app.service('ThreadService', ['$rootScope', 'ConfigService', function($rootScope, ConfigService) {
    var self = this;
    var threadDataInfo = [];
    var x_pixels = ConfigService.x_pixels;
    var poolSize = Math.ceil(ConfigService.ctx_w / x_pixels);

    self.work = function() {
        threadDataInfo = [];
        // Paint new line on canvas
        var fillLine = function(data) {
            var result = data.result;
            if (typeof result !== 'undefined') {
                $rootScope.$emit("draw", result);
            };
            var start = data.start;
            var end = data.end;
            threadDataInfo.push({ id: data.id, t : ((end - start) / 1000) });
        };
        var startWorkers = Date.now();
        for (var part = 0; part < poolSize; part++) {
            // initial data
            var worker = new Worker('src/thread.js');
            // Event for receive data from thread
            worker.addEventListener('message', function(event) {
                fillLine(event.data);
            });
            var data = {
                'offset': part,
                'count': x_pixels,
                'width': ConfigService.ctx_w,
                'height': ConfigService.ctx_h,
                'isZoom': ConfigService.isAlreadyDraw,
                'mX': ConfigService.mouseClickX,
                'mY': ConfigService.mouseClickY
            };
            // Start a new thread
            worker.postMessage(data);
        };
    };

    self.getThreadData = function() {
        return threadDataInfo;
    };

    self.threadCount = function() {
        return poolSize;
    };

    return self;
}]);

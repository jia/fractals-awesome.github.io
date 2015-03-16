// get window size

app.directive('mandelbrot', ['$rootScope', 'ThreadService', 'ConfigService', 'usSpinnerService',
    function($rootScope, ThreadService, ConfigService, usSpinnerService) {
        return function(scope, element, attra) {
            // onload canvas
            var ctx = document.getElementById("canvas-1-layer-1").getContext('2d');
            ctx.beginPath();
            ctx.canvas.width = ConfigService.ctx_w;
            ctx.canvas.height = ConfigService.ctx_h;

            // onclick event 
            element.bind('mouseup', function(event) {
                ConfigService.isMandelbrot(true);
                if (!ConfigService.isAlreadyDraw) {
                    ConfigService.isAlreadyDraw = true;
                } else {
                    scope.$apply(function() {
                        ConfigService.setMouse(event.clientX, event.clientY);
                    });
                };
                // lock body and start spin
                var endedThreads = 0;
                usSpinnerService.spin('spinner-1');
                document.getElementById("lock-container").setAttribute('class', 'overlay');
                ThreadService.work();
                $rootScope.$on('draw', function(e, pixels) {
                    endedThreads++;
                    for (var i = 0; i < pixels.length; i++) {
                        var pixel = pixels[i];
                        ctx.fillStyle = "rgba(" + pixel.color.r + "," + pixel.color.g + "," + pixel.color.b + ",1)";
                        ctx.fillRect(pixel.x, pixel.y, 1, 1);
                    };
                    if (endedThreads == ThreadService.threadCount()) {
                        usSpinnerService.stop('spinner-1');
                        document.getElementById("lock-container").removeAttribute('class', 'overlay');
                        var dataURL = ctx.canvas.toDataURL('image/png');
                        scope.showStatButton(dataURL);
                    }
                });
            });
        }
    }
]).directive('julia', ['$rootScope', 'ThreadService', 'ConfigService', 'usSpinnerService',
    function($rootScope, ThreadService, ConfigService, usSpinnerService) {
        return function(scope, element, attra) {
            var cx = parseFloat(document.getElementById("julia-cx").value);
            var cy = parseFloat(document.getElementById("julia-cy").value);
            // onload canvas
            var ctx = document.getElementById("canvas-1-layer-1").getContext('2d');
            ctx.beginPath();
            ctx.canvas.width = ConfigService.ctx_w;
            ctx.canvas.height = ConfigService.ctx_h;

            // onclick event 
            element.bind('mouseup', function(event) {
                ConfigService.isMandelbrot(false);
                ConfigService.setJuliaData(cx, cy);
                if (!ConfigService.isAlreadyDraw) {
                    ConfigService.isAlreadyDraw = true;
                } else {
                    scope.$apply(function() {
                        ConfigService.setMouse(event.clientX, event.clientY);
                    });
                };
                // lock body and start spin
                var endedThreads = 0;
                usSpinnerService.spin('spinner-1');
                document.getElementById("lock-container").setAttribute('class', 'overlay');
                ThreadService.work();
                $rootScope.$on('draw', function(e, pixels) {
                    endedThreads++;
                    for (var i = 0; i < pixels.length; i++) {
                        var pixel = pixels[i];
                        ctx.fillStyle = "rgba(" + pixel.color.r + "," + pixel.color.g + "," + pixel.color.b + ",1)";
                        ctx.fillRect(pixel.x, pixel.y, 1, 1);
                    };
                    if (endedThreads == ThreadService.threadCount()) {
                        usSpinnerService.stop('spinner-1');
                        document.getElementById("lock-container").removeAttribute('class', 'overlay');
                        var dataURL = ctx.canvas.toDataURL('image/png');
                        scope.showStatButton(dataURL);
                    }
                });
            });
        }
    }
]).directive('chart', function(ThreadService, ConfigService) {
    return function($scope, element, $attr) {
        var ctx = document.getElementById("canvas-1-layer-2").getContext('2d');
        ctx.beginPath();
        var w = ctx.canvas.width = ConfigService.ctx_w;
        var h = ctx.canvas.height = ConfigService.ctx_h;
        var threadPixels = ConfigService.x_pixels;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        element.bind('click', function(event) {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            var threadInfo = ThreadService.getThreadData();
            threadInfo.sort(function(a, b) {
                if (a.id < b.id) return -1;
                if (a.id > b.id) return 1;
                return 0;
            });

            var maxTime = Math.max.apply(Math, threadInfo.map(function(o) {
                return o.t;
            }));
            var multCoefficient = w / maxTime;

            for (var i = 0; i < threadInfo.length; i++) {
                // Calculate positions and draw text
                var x_rect = 0;
                var y_rect = (i) * threadPixels;
                var w_rect = threadInfo[i].t * multCoefficient;
                var h_rect = threadPixels;
                ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
                ctx.fillRect(x_rect, y_rect, w_rect, h_rect);

                // Draw grid
                // Horisontal
                ctx.beginPath();
                ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
                ctx.lineWidth = 0.1;
                ctx.strokeStyle = '#fff';
                ctx.moveTo(x_rect, y_rect);
                ctx.lineTo(w_rect, y_rect);
                ctx.stroke();

                ctx.beginPath();
                ctx.fillStyle = "white";
                ctx.font = "10px Arial";
                ctx.fillText("Thread #" + (i + 1), x_rect, y_rect + threadPixels - 5);
                ctx.fillText((threadInfo[i].t).toFixed(3) + " sec", w_rect - 50, y_rect + threadPixels - 5);
            };
        });
    }
});

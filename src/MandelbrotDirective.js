// get window size

app.directive('paint', ['$rootScope', 'ThreadService', 'ConfigService', 'usSpinnerService',
    function($rootScope, ThreadService, ConfigService, usSpinnerService) {
        return function(scope, element, attra) {
            // onload canvas
            var ctx = element[0].getContext('2d');
            ctx.beginPath();
            ctx.canvas.width = ConfigService.ctx_w;
            ctx.canvas.height = ConfigService.ctx_h;

            // onclick event 
            element.bind('mouseup', function(event) {
                if (!ConfigService.isAlreadyDraw) {
                    ConfigService.isAlreadyDraw = true;
                } else {
                    console.log('x, y = ', event.clientX, event.clientY);
                    scope.$apply(function() {
                        // $scope.data.myVar = "Another value";
                        ConfigService.setMouse(event.clientX, event.clientY);
                    });
                    // setTimeout(function() {
                    // });
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
        var ctx = document.getElementById("canvas-layer-2").getContext('2d');
        ctx.beginPath();
        var w = ctx.canvas.width = ConfigService.ctx_w;
        var h = ctx.canvas.height = ConfigService.ctx_h;
        var x_p = ConfigService.x_pixels;
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
            var multCoefficient = (h - 15) / maxTime; // small distance from top of canvas

            for (var i = 0; i < threadInfo.length; i++) {
                // Calculate positions and draw text
                ctx.fillStyle = "white";
                ctx.font = "10px Arial";
                var x_pos = i * x_p + x_p / 2.0 - ((threadInfo[i].id < 10) ? 3 : 6); // 3px - width of char
                var y_pos = h - 15;
                ctx.fillText(threadInfo[i].id, x_pos, y_pos);
                // Calculate and draw bars
                var bar_h = threadInfo[i].t * multCoefficient;
                y_pos = h - bar_h;
                ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
                ctx.fillRect(i * x_p, y_pos, x_p, bar_h);
                // Draw grid
                // Horisontal
                ctx.beginPath();
                ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
                ctx.lineWidth = 0.1;
                ctx.strokeStyle = '#fff';
                ctx.moveTo((i + 1) * x_p, h);
                ctx.lineTo((i + 1) * x_p, h - bar_h);
                ctx.stroke();
            };
            var countOfHorLines = 9;
            var offsetPx = (h - 15) / countOfHorLines;
            var offsetSec = maxTime / (countOfHorLines + 1);

            for (var i = 1; i <= countOfHorLines; i++) {
                ctx.beginPath();
                ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
                ctx.lineWidth = 0.1;
                ctx.strokeStyle = '#fff';

                ctx.moveTo(0, h - i * offsetPx);
                ctx.lineTo(w, h - i * offsetPx);
                ctx.stroke();

                ctx.fillStyle = "white";
                ctx.font = "10px Arial";
                var x_pos = 10;
                var y_pos = h - offsetPx * i;
                ctx.fillText((offsetSec * i).toFixed(3) + " sec", x_pos, y_pos);
            };
        });



    }
});

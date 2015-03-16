'use strict';

app.service('ConfigService', function() {
    var self = this;

    var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x = w.innerWidth || e.clientWidth || g.clientWidth,
    y = w.innerHeight || e.clientHeight || g.clientHeight;

    self.x_pixels = 20; // width in pixels for each thread
    self.ctx_w = x - 40; // canvas width
    self.ctx_h = y - 100; // canvas height

    var marginLeft = 15;
    var marginTop = 70;

    self.isAlreadyDraw = false;
    self.isMandelbrotSet = false;
    self.mouseClickX = -1;
    self.mouseClickY = -1;

    self.cx = 0.3;
    self.cy = 0.4;

    self.setMouse = function(x, y) {
        self.mouseClickX = x - marginLeft;
        self.mouseClickY = y - marginTop;
    };

    self.isMandelbrot = function(isMandelbrot) {
        self.isMandelbrotSet = isMandelbrot;
    };

    self.setJuliaData = function(cx, cy) {
        self.cx = cx;
        self.cy = cy;
    };

    return self;
});

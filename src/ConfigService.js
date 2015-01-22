'use strict';

app.service('ConfigService', function() {
    var self = this;

    var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x = 1200,//w.innerWidth || e.clientWidth || g.clientWidth,
    y = 600;//w.innerHeight || e.clientHeight || g.clientHeight;

    self.x_pixels = 100; // width in pixels for each thread
    self.ctx_w = x;// - 40; // canvas width
    self.ctx_h = y;// - 100; // canvas height

    var marginLeft = 15;
    var marginTop = 70;

    self.isAlreadyDraw = false;
    self.mouseClickX = -1;
    self.mouseClickY = -1;

    self.setMouse = function(x, y) {
        self.mouseClickX = x - marginLeft;
        self.mouseClickY = y - marginTop;
    };

    return self;
});

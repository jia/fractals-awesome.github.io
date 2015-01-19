'use strict';

app.service('ConfigService', function() {
    var self = this;

    var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x = w.innerWidth || e.clientWidth || g.clientWidth,
    y = w.innerHeight || e.clientHeight || g.clientHeight;

    self.x_pixels = 40; // width in pixels for each thread
    self.ctx_w = x - 40; // canvas width
    self.ctx_h = y - 100; // canvas height

    return self;
});

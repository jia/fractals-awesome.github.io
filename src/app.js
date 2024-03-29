'use strict'

var app = angular.module('app-fractal', ['ui.bootstrap', 'angularSpinner']);

app.config(['usSpinnerConfigProvider', function(usSpinnerConfigProvider) {
    usSpinnerConfigProvider.setDefaults({
        lines: 17, // The number of lines to draw
        length: 0, // The length of each line
        width: 22, // The line thickness
        radius: 30, // The radius of the inner circle
        corners: 1, // Corner roundness (0..1)
        rotate: 10, // The rotation offset
        direction: 1, // 1: clockwise, -1: counterclockwise
        color: '#fff', // #rgb or #rrggbb or array of colors
        speed: 1.3, // Rounds per second
        trail: 100, // Afterglow percentage
        shadow: false, // Whether to render a shadow
        hwaccel: true, // Whether to use hardware acceleration
        className: 'spinner', // The CSS class to assign to the spinner
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        top: '50%', // Top position relative to parent
        left: '50%' // Left position relative to parent
    });
}]).config( [
    '$compileProvider',
    function( $compileProvider ) {   
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|file|blob):|data:image\//);
    }
]);
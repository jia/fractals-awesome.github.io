'use strict';

app.controller('MandelbrotController', ['$scope', function($scope) {

	// Class implemens Complex number
	function Complex (real, imagine) {
		// Variables
		this.realPart = real;
		this.imaginePart = imagine;
		this.magnitude = Math.sqrt(this.realPart * this.realPart + this.imaginePart * this.imaginePart);
		// Methods
		this.constructor.prototype.toString = function() {
			return '[ R = ' + this.realPart + ', I = ' + this.imaginePart + ', M = ' + this.magnitude + ']';
		};
		// Overload
		this.constructor.prototype.plus = function(that) {
			return new Complex(this.realPart + that.realPart, this.imaginePart + that.imaginePart);
		};
		this.constructor.prototype.mult = function(that) {
			var r = this.realPart * that.realPart - this.imaginePart * that.imaginePart;
			var i = this.imaginePart * that.realPart + this.realPart * that.imaginePart;
			return new Complex(r, i);
		};
	};
	// Class implemens base logic for all fractals 
	function Fractal () {
		// const
		this.leftX = -2.1;
		this.rightX = 2.1;		

		this.infinity = 255.0;
		this.maxTime = 250;
		this.rectangleHalfX = 10;
		this.rectangleHalfY = 85;
		// Variables
		this.sizeX = 0;
		this.sizeY = 0;
		this.downLeftCorner = new Complex(0, 0);
		this.upRightCorner = new Complex(0, 0);
		// Methods
		this.constructor.prototype.toComplex = function(pX, pY) {
			var leftX = this.downLeftCorner.realPart;
			var rightX = this.upRightCorner.realPart;
			var downY = this.downLeftCorner.imaginePart;
			var upY = this.upRightCorner.imaginePart;

			var real = leftX + pX / this.sizeX * (rightX - leftX);
			var imaginery = downY + pY / this.sizeY * (upY - downY);

			var result = new Complex(real, imaginery);
			return result;
		};
		this.constructor.prototype.stepToColor = function(step) {
			return {
				'r' : (step * 2 > 255) ? 255 : step * 2,
				'g' : step > 255 ? 255 : step,
				'b' : (step * 4 > 255) ? 255 : step * 4
			}
		}
		this.constructor.prototype.setSize = function(pX, pY) {
			this.sizeX = pX;
			this.sizeY = pY;
			this.downLeftCorner = new Complex(this.leftX, this.leftX * this.sizeY / this.sizeX);
			this.upRightCorner = new Complex(this.rightX, this.rightX * this.sizeY / this.sizeX);
		};
		this.constructor.prototype.zoomIn = function(mouseX, mouseY) {
			// normalize mouse coordinates
			// Left upper rectangle point
			var lUpX = mouseX;
			var lUpY = mouseY;
			// Right down rectangle point 
			var rDownX = mouseX + this.rectangleHalfX;
			var rDownY = mouseY + this.rectangleHalfY;
			console.log("[" + lUpX +  ", " + lUpY + "][" + rDownX + ", " + rDownY + "]");
			var plannedX = this.upRightCorner.realPart - this.downLeftCorner.realPart;
			var plannedY = this.upRightCorner.imaginePart - this.downLeftCorner.imaginePart;
			// calculate new Complex numbers
			this.downLeftCorner = new Complex(
				this.downLeftCorner.realPart + plannedX * lUpX / this.sizeX,
				this.upRightCorner.imaginePart - plannedY * rDownY / this.sizeY
			);
			this.upRightCorner = new Complex(
				this.downLeftCorner.realPart + plannedX * rDownX / this.sizeX,
				this.upRightCorner.imaginePart - plannedY * lUpY / this.sizeY
			);
		};
	}
	// Logic of Mandelbrot set : Fractal
	function Mandelbrot() {
		// Variables
		this.image = [];
		// Methods
		this.constructor.prototype.calculateStep = function(number) {
			var z = new Complex(0, 0);
			for (var i = 0; i < this.maxTime; i++) {
				if (z.magnitude > this.infinity) {
					return i;
				};
				z = z.mult(z).plus(number);
			};
			return this.maxTime;
		};
		this.constructor.prototype.toImage = function(x, y) {
			var planeX = x;
			var planeY = this.sizeY - y - 1;
			var num = this.toComplex(planeX, planeY);
			var step = this.calculateStep(num);
			var color = this.stepToColor(step);
			return {
				'color' : color,
				'x' : x,
				'y' : y
			};
		}
		// Call constructor
		Fractal.call(this);
		// Inheritance
		this.constructor.prototype = Object.create(Fractal.prototype);
	};
	$scope.leftCorner = 0;
	$scope.rightCorner = 0;

	$scope.drawSet = function () {
		var mandelbrotObj = new Mandelbrot();
		$scope.mObj = mandelbrotObj;
		$scope.leftCorner = mandelbrotObj.downLeftCorner.toString();
		$scope.rightCorner = mandelbrotObj.upRightCorner.toString();
	};

}]);
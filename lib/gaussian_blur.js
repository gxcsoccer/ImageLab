window.onload = function() {
	var canvas = document.getElementById("canvas"),
		context = canvas.getContext("2d"),
		canvasWidth = canvas.width,
		canvasHeight = canvas.height,
		btn = document.getElementById("gs_blur"),
		image = new Image();

	image.src = "img/img_5264.jpg";
	image.onload = function() {
		context.drawImage(image, 0, 0);
	};

	btn.addEventListener("click", function() {
		var imageData = context.getImageData(0, 0, canvas.width, canvas.height),
			pixels = imageData.data;
		context.clearRect(0, 0, canvasWidth, canvasHeight);
		var newPixels = gaussianBlur(pixels, canvasWidth, canvasHeight, 10);

		for(var i = 0; i < pixels.length; i++) {
			pixels[i] = newPixels[i];
		}

		context.putImageData(imageData, 0, 0);
	}, false);

	function gaussianBlur(pixels, width, height, radius) {
		var weightMatrix = calculateWeight(radius),
			newPixels = [],
			numPixels = canvasWidth * canvasHeight;

		for (var i = 0; i < numPixels; i++) {
			newPixels.push.apply(newPixels, calculateColor(pixels, i, radius, weightMatrix, width, height));
		};

		return newPixels;
	}

	function calculateColor(pixels, index, radius, weightMatrix, width, height) {
		var color = [0, 0, 0, 0],
			coord = index2Coord(index, width),
			i, ii = 0;

		for (var y = -radius; y <= radius; y++) {
			for (var x = -radius; x <= radius; x++) {
				i = coord2Index({
					x: coord.x + x,
					y: coord.y + y
				}, width, height);
				color[0] += pixels[i * 4] * weightMatrix[ii];
				color[1] += pixels[i * 4 + 1] * weightMatrix[ii];
				color[2] += pixels[i * 4 + 2] * weightMatrix[ii];
				color[3] += pixels[i * 4 + 3] * weightMatrix[ii];
				ii += 1;
			}
		}

		return color;
	}

	function index2Coord(index, width) {
		return {
			x: index % width,
			y: Math.floor(index / width)
		};
	}

	function coord2Index(coord, width, height) {
		var x, y
		if (coord.x < 0) {
			x = -coord.x;
		} else if (coord.x > (width - 1)) {
			x = 2 * width - coord.x - 2;
		} else {
			x = coord.x;
		}

		if (coord.y < 0) {
			y = -coord.y;
		} else if (coord.y > (height - 1)) {
			y = 2 * height - coord.y - 2;
		} else {
			y = coord.y;
		}
		return y * width + x;
	}

	function calculateWeight(radius) {
		var weightMatrix = [],
			sum = 0,
			weight;

		for (var y = -radius; y <= radius; y++) {
			for (var x = -radius; x <= radius; x++) {
				weight = gaussianKernal(x, y);
				sum += weight;
				weightMatrix.push(weight);
			}
		}

		return weightMatrix.map(function(w) {
			return w / sum;
		});
	}

	function gaussianKernal(x, y) {
		var sigma = 1.5;
		return Math.pow(Math.E, -(x * x + y * y) / (2 * sigma * sigma)) / (2 * Math.PI * sigma * sigma);
	}
};
// Graphable
var Graphable = (type, width, height, margin, data) => {

	if (typeof type == 'undefined' || typeof width == 'undefined' || typeof height == 'undefined' || typeof margin == 'undefined' || typeof data == 'undefined') {
		return;
	}

	function pointSibling (index, position) {
		position = position.toUpperCase();
		var prev,
				next;
		if (typeof point[index] != 'undefined' && point.length >= index && typeof position != 'undefined') {
			prev = point[index - 1],
			next = point[index + 1];

			prev = typeof prev == 'undefined' ? prev : { X: 0, Y: 0 };
			next = typeof next == 'undefined' ? next : { X: 0, Y: 0 };

			if (position == 'PREV') {
				return prev;
			}
			else if (position == 'NEXT') {
				return next;
			}
		}
		// else {
		// 	return {
		// 		X: ``,
		// 		Y: ``
		// 	}
		// }
	}

	function pointHandle (prev, current, next, interval) {
		const dx1 = prev.X - current.X,
					dy1 = prev.Y - current.Y,
					dx2 = current.X - next.X
					dy2 = current.Y - next.Y;

		const lineAngle1 = Math.atan2(dy1, dx1),
					lineAngle2 = Math.atan2(dy2, dx2);

		const tangentAngle = Math.atan2(
			Math.sin(lineAngle1) + Math.sin(lineAngle2),
			Math.cos(lineAngle1) + Math.cos(lineAngle2)
		)

		const controlPointX = current.X + Math.cos(tangentAngle) * interval,
					controlPointY = current.Y + Math.sin(tangentAngle) * interval;

		return {
			X: Math.round(controlPointX),
			Y: Math.round(controlPointY)
		}
	}

	var canvasW = width,
	    canvasH = height,
			margin = Array.isArray(margin) ? margin.length == 2 ? [margin[0], margin[1], margin[0], margin[1]] : margin : [margin, margin, margin, margin],
			pathW = canvasW - (margin[3] + margin[1]),
			pathH = canvasH - (margin[0] + margin[2]),
	    spaceX = 0,
	    spaceY = 0,
	    dataHighest = 0,
	    dataLowest = 0,
	    intervalX = 0,
	    intervalY = 0,
			curve = true,
	    point = [],
			pointCurve = [];

	// console.log(`Path Hight = ${pathH}`);
	dataHighest = Math.max.apply(null, data);
	dataLowest = Math.min.apply(null, data);

	// Update Interval X and Y
	intervalX = data.length;
	intervalY = Math.round(dataHighest - dataLowest);

	// Update Space X and Y
	spaceX = pathW / data.length;
	spaceY = pathH / intervalY;

	var start = margin[3],
			startX = start,
      end = `z`,
      comma = `,`,
      path = ``;

  for (var i = 0; i < data.length; i++) {
    var index = i + 1,
        length = data.length,
        first = i == 0,
        last = index == length,
				value = data[i],
        differenceY = dataHighest - value,
				pointXY = {
					X: ``,
					Y: ``
				};
		// Update
		startX = startX + spaceX;
		pointXY.X = startX;
		pointXY.Y = differenceY * spaceY;
		pointXY.Y = pointXY.Y + margin[0];
		// console.log(`Difference Y = ${differenceY}`);
		// Push Position X and Y to the Main Position Array
		// console.log(pointXY)
		point.push(pointXY);
  }

	// Draw Path
	for (var i = 0; i < point.length; i++) {
		var index = i + 1,
        length = point.length,
        first = i == 0,
				second = i == 1,
        last = index == length,
				secondLast = index == length - 1,
				pathStart = point[i].X - (spaceX / 2),
				pathEnd = point[i].X + (spaceX / 2),
				pathX = canvasW - margin[1],
				pathY = canvasH - margin[2],
				command = first ? 'M' : `L`;

		path += first ? `M${start} ${point[0].Y}${comma} ` : ``;
		path += `L ${pathStart} ${point[i].Y}${comma} `;
		path += last ? `L ${pathX} ${point[i].Y}, V${pathY} H${start} z` : ``;

		var prev = pointSibling(i, 'prev'),
				current = point[i],
				next = pointSibling(i, 'next'),
				interval = spaceX / 2;

		console.log(prev, current, next, interval)
		/*
		if (first == false || last == false) {
			var handle = pointHandle(
				pointSibling(i, 'prev'),
				point[i],
				pointSibling(i, 'next'),
				spaceX / 2
			)

			console.log(handle)
		}
		*/

	}


	// console.log(`Data = ${JSON.stringify(generate(DATA))}`);
	console.log(`Path = ${path}`);
	console.log(`Lowest = ${dataLowest}`);
	console.log(`Highest = ${dataHighest}`);
	console.log(`Interval X = ${intervalX}`);
	console.log(`Interval Y = ${intervalY}`);
	console.log(`Space X = ${spaceX}`);
	console.log(`Space Y = ${spaceY}`);
	console.log(`Point = ${JSON.stringify(point)}`);
  return {
		path,
		canvasW,
		canvasH,
		pathW,
		pathH
	}
}




// var DATA = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
var DATA = [1, 10, -5, 20, 8, 25, 60];

var lineGraph = Graphable('line', 600, 300, 20, DATA);


// console.log(`Data = ${JSON.stringify(generate(DATA))}`);
// console.log(`Path = ${JSON.stringify(generate(DATA))}`);
// console.log(`Lowest = ${dataLowest}`);
// console.log(`Highest = ${dataHighest}`);
// console.log(`Interval X = ${intervalX}`);
// console.log(`Interval Y = ${intervalY}`);
// console.log(`Space X = ${spaceX}`);
// console.log(`Space Y = ${spaceY}`);
// console.log(`Position = ${JSON.stringify(point)}`);

var div = document.querySelector("#root"),
		svgPath = `<path d="${lineGraph.path}" />`;

if (DATA.length) {
  var svg = `<svg width="${lineGraph.canvasW}px" height="${lineGraph.canvasH}px">${svgPath}</svg>`;
}
div.innerHTML = svg;

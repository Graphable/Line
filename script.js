// Graphable
var Graphable = (type, width, height, canvasMargin, data) => {

	// if (typeof type == 'undefined' || typeof width == 'undefined' || typeof height == 'undefined' || typeof canvasMargin == 'undefined' || typeof data == 'undefined') {
	// 	return;
	// }

	data = data.map((number) => {
		return parseFloat(Math.round(number * 100) / 100).toFixed(3);
	});

	console.log(`Data = ${data}`)

	function pointSibling (index, position) {
		position = position.toUpperCase();
		var prev,
				next;
		if (typeof point[index] != 'undefined' && point.length >= index && typeof position != 'undefined') {
			prev = point[index - 1],
			next = point[index + 1];

			prev = typeof prev != 'undefined' ? prev : { X: 0, Y: 0 };
			next = typeof next != 'undefined' ? next : { X: 0, Y: 0 };

			if (position == 'PREV') {
				return prev;
			}
			else if (position == 'NEXT') {
				return next;
			}
		}
	}

	function round(number, decimalPlace) {
		if (typeof number != 'undefined') {
			decimalPlace = typeof decimalPlace == 'undefined' ? 3 : decimalPlace;
			return parseFloat(Math.round(number * 100) / 100).toFixed(decimalPlace);
		}
	}

	function pointHandle (prev, current, next, interval) {
		const DX1 = prev.X - current.X,
					DY1 = prev.Y - current.Y,
					DX2 = current.X - next.X
					DY2 = current.Y - next.Y;

		const lineAngle1 = Math.atan2(DY1, DX1),
					lineAngle2 = Math.atan2(DY2, DX2);

		const tangentAngle = Math.atan2(
			Math.sin(lineAngle1) + Math.sin(lineAngle2),
			Math.cos(lineAngle1) + Math.cos(lineAngle2)
		)

		const controlPointX = current.X + Math.cos(tangentAngle) * interval,
					controlPointY = current.Y + Math.sin(tangentAngle) * interval;

		return {
			X: controlPointX,
			Y: controlPointY
		}
	}

	var canvasW = width,
	    canvasH = height,
			canvasMargin = Array.isArray(canvasMargin) ? canvasMargin.length == 2 ? [canvasMargin[0], canvasMargin[1], canvasMargin[0], canvasMargin[1]] : canvasMargin : [canvasMargin, canvasMargin, canvasMargin, canvasMargin],
			pathW = canvasW - (canvasMargin[3] + canvasMargin[1]),
			pathH = canvasH - (canvasMargin[0] + canvasMargin[2]),
			pathPadding = 0,
	    spaceX = 0,
	    spaceY = 0,
	    dataHighest = 0,
	    dataLowest = 0,
	    intervalX = 0,
	    intervalY = 0,
			offsetY = 2,
			curve = true,
	    point = [],
			pointCurve = [],
			start = canvasMargin[3],
			startX = start,
			path = ``,
			pathCurve = ``;

	// console.log(`Path Hight = ${pathH}`);
	// parseFloat(Math.round(number * 100) / 100).toFixed(3);

	// dataHighest = Math.max.apply(null, data);
	dataHighest = round(Math.max.apply(null, data));
	dataLowest = round(Math.min.apply(null, data));

	console.log(`Data Highest = ${dataHighest}`)
	console.log(`Data Lowest = ${dataLowest}`)

	// Update Interval X and Y
	intervalX = data.length;
	intervalY = round(dataHighest - dataLowest + offsetY);

	// Update OffsetY
	offsetY = intervalY <= 10 ? 0.5 : intervalY <= 20 ? 1 : 2;

	// Update Space X and Y
	spaceX = pathW / data.length;
	spaceY = round(pathH / intervalY);

	console.log(`Space X = ${spaceX}`)
	console.log(`Space Y = ${spaceY}`)

	// Update Path Padding
	pathPadding = pathH - (intervalY - offsetY) * spaceY;

	console.log(`Offset Y = ${offsetY}`)
	// console.log(`Path Padding = ${pathPadding}`)
	console.log(`Interval Y = ${intervalY}`)
	// console.log(`Space Y = ${spaceY}`)
	// console.log(`Height = ${pathH}`)

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
		pointXY.Y = pointXY.Y + canvasMargin[0] + pathPadding / 2;
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
				pathX = canvasW - canvasMargin[1],
				pathY = canvasH - canvasMargin[2];

		path += first ? `M${start} ${point[0].Y}, ` : ``;
		path += `L ${pathStart} ${point[i].Y}, `;
		path += last ? `L ${pathX} ${point[i].Y}, V${pathY} H${start} z` : ``;

		var prev = pointSibling(i, 'prev'),
				current = point[i],
				next = pointSibling(i, 'next'),
				interval = round(spaceX / 2);

		console.log(`Interval = ${interval}`)
		// console.log(prev, current, next, interval)
		if (typeof prev == 'undefined') {
			prev = {
				X: start,
				Y: point[0].Y
			}
		}
		else if (typeof next == 'undefined') {
			next = {
				X: pathX,
				Y: point[i].Y
			}
		}

		var handle = pointHandle(
			{ X: prev.X, Y: prev.Y},
			{ X: pathStart, Y: point[i].Y },
			{ X: last ? pathStart + pathX : next.X, Y: next.Y },
			spaceX / 2
		)


		if (first) {
			pathCurve += `M${start} ${point[0].Y} L ${pathStart}, ${point[i].Y} `;
		}
		else {
			pathCurve += `S${handle.X} ${handle.Y} ${pathStart} ${point[i].Y} `;
		}
		pathCurve += last ? `L ${pathX} ${point[i].Y} V${pathY} H${start} z` : ``;

	}

	// console.log(`Points = ${JSON.stringify(point)}`)

  return {
		path,
		pathCurve,
		canvasW,
		canvasH,
		pathW,
		pathH
	}
}

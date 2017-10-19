// Graphable
var Graphable = (type, width, height, margin, data) => {

	if (typeof type == 'undefined' || typeof width == 'undefined' || typeof height == 'undefined' || typeof margin == 'undefined' || typeof data == 'undefined') {
		return;
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
	    position = [];

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
				positionXY = {
					X: ``,
					Y: ``
				};
		// Update
		startX = startX + spaceX;
		positionXY.X = startX;
		positionXY.Y = differenceY * spaceY;
		positionXY.Y = positionXY.Y + margin[0];
		// console.log(`Difference Y = ${differenceY}`);

		// Push Position X and Y to the Main Position Array
		// console.log(positionXY)
		position.push(positionXY);
  }

	// Draw Path
	for (var i = 0; i < position.length; i++) {
		var index = i + 1,
        length = position.length,
        first = i == 0,
        last = index == length,
				pathStart = position[i].X - (spaceX / 2),
				pathEnd = position[i].X + (spaceX / 2),
				pathX = canvasW - margin[1],
				pathY = canvasH - margin[2],
				command = first ? 'M' : `L`;
		// Add to Beginning of the Path
		if (first) {
			path += `M${start} ${position[0].Y}${comma} `;
		}
		path += `L ${pathStart} ${position[i].Y}${comma}`;
		// Add to End of Path
		if (last) {
			path += `L ${pathX} ${position[i].Y}, V${pathY} H${start} z`;
		}
	}
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
// console.log(`Position = ${JSON.stringify(position)}`);

var div = document.querySelector("#root"),
		svgPath = `<path d="${lineGraph.path}" />`;

if (DATA.length) {
  var svg = `<svg width="${lineGraph.canvasW}px" height="${lineGraph.canvasH}px">${svgPath}</svg>`;
}
div.innerHTML = svg;

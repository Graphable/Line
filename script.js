// var pathFull = 'M90,125S30,53 30,53S60,77 90,77S121,59 150,53S180,51 210,50S242,40 270,50S300,101 330,101S362,60 390,50S420,46 450,50S480,65 510,65S540,54 570,50S600,55 630,50S690,29 690,29V690';

// M0, 690 0,125S30,53 30,53S60,77 90,77S121,59 150,53S180,51 210,50S242,40 270,50S300,101 330,101S362,60 390,50S420,46 450,50S480,65 510,65S540,54 570,50S600,55 630,50S690,29 690,29V690
var pathFull = [];

/*
pathFull.push(`
  M0 30
  L 30 60
  L 60 60
  L 90 30
  L 120 30
  L 150 40
  L 180 70
  L 210 90
  L 230 90
  L 250 40
  H 280 V 200
  L 0 200
  z
`);
*/

var data = [102.1, 10.7, 11.3, -10, 7.7, 16.2, 20, 0];
// var data = [1, 10, -5, 20, 8, 25, 60];

var canvasW = 360,
    canvasH = 180,
		margin = [10, 10, 10, 10],
		pathW = canvasW - (margin[3] + margin[1]),
		pathH = canvasH - (margin[0] + margin[2]),
    spaceX = 0,
    spaceY = 0,
    dataHighest = 0,
    dataLowest = 0,
    intervalX = 0,
    intervalY = 0,
		curve = true,
    // coordinate = [],
    position = [];
    // path;

console.log(`Path Hight = ${pathH}`);
// for (var i = 0; i < data.length; i++) {
//   dataHighest = data[i] >= dataHighest ? data[i] : dataHighest;
// }
// for (var i = 0; i < data.length; i++) {
//   dataLowest = data[i] <= dataHighest ? data[i] : dataLowest;
// }
dataHighest = Math.max.apply(null, data);
dataLowest = Math.min.apply(null, data);

// Update Interval X and Y
intervalX = data.length;
intervalY = Math.round(dataHighest - dataLowest);
// Update Space X and Y
spaceX = pathW / data.length;
// spaceY = Math.round(pathH / intervalY);
spaceY = pathH / intervalY;

// function round(val, dec) {
//   if (typeof dec == 'undefined') {
//     var dec = 1;
//   }
//   if (typeof value == "array") {
//     for (var i = 0; i < val.length; i++) {
//       val[i] = Number(Math.round(val[i], dec));
//     }
//   } else {
//     val = Number(Math.round(val, dec));
//   }
// }

// round(data, 1);

// Generate Path
function generate(arr) {
  var start = margin[3],
			// start = spaceX / 2,
			startX = start,
      end = `z`,
      comma = `,`,
      result = ``;

  for (var i = 0; i < arr.length; i++) {
    var index = i + 1,
        length = arr.length,
        first = i == 0,
        last = index == length,
        // value = Math.round(arr[i]),
        // differenceY = Math.round(dataHighest) - value,
				value = arr[i],
        differenceY = dataHighest - value,
				positionXY = {
					X: ``,
					Y: ``
				};
		// if (index != 1) {
		// 	startX = startX + spaceX;
		// }
		startX = startX + spaceX;
    // Calculate Position X and Y
		// if (first || last) {
		// 	startX = startX - start;
		// 	console.log(startX)
		// }
		positionXY.X = startX;
		// positionXY.Y = differenceY <= 1 ? 0 : (differenceY * spaceY);
		positionXY.Y = differenceY * spaceY;
		positionXY.Y = positionXY.Y + margin[0];
		console.log(`difference Y = ${differenceY}`);
		// Push Position X and Y to the Main Position Array
		console.log(positionXY)
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
				// pathX = canvasW - margin[1] - margin[3],
				// pathY = canvasH - margin[0] - margin[2],
				pathX = canvasW - margin[1],
				pathY = canvasH - margin[2],
				command = first ? 'M' : `L`;

		console.log(pathY)
		// Add to Beginning of the Path
		if (first) {
			result += `M${start} ${position[0].Y}${comma} `;
		}
		result += `L ${pathStart} ${position[i].Y}${comma}`;
		// Add to End of Path
		if (last) {
			// result += `L ${pathW} ${position[i].Y}, V${pathH} H${start} z`;
			// result += `L ${pathW} ${pathY}, V${pathY} H${start} z`;
			result += `L ${pathX} ${position[i].Y}, V${pathY} H${start} z`;
			// result += `H${spaceXHalf} V${pathH}, V${pathH} H${pathW}, L ${start} ${pathH} z`;
			// result += `V${canvasH} H${canvasW} z`;
		}
	}


  // Decrement x interval by 1 and use the remainder for the two sides, left and right
	/*
  for (var i = 0; i < arr.length; i++) {
    var index = i + 1;
    var first = i == 0;
    var last = index == arr.length;
    var val = Math.round(arr[i]);
    var difference = Math.round(arr) - val;

    posX = 0;
    posY = difference == 0 ? 0 : difference * spaceY;

    if (first) {
      result += `${start} 0 0${comma}`;
    }

    result += `L ${posX} ${posY}${comma}`;

    if (last) {
      result += `V 160 H 30 ${end}`;
    }

  }
	*/
  // result += `${end}`;
  return result;
}


console.log(data);
// console.log(generate(data))
console.log(`Lowest = ${dataLowest}`);
console.log(`Highest = ${dataHighest}`);
console.log(`Interval X = ${intervalX}`);
console.log(`Interval Y = ${intervalY}`);
console.log(`Space X = ${spaceX}`);
console.log(`Space Y = ${spaceY}`);
console.log(`Position = ${position}`);

// pathFull.push(`
//   m30 30,
//   c 50, 0 50, 100 100, 100 50, 0 50, -100 100, -100,
//   V 150 H 30 z
// `);

var div = document.querySelector("#root");
// var paths = "";
// for (var i = 0; i < pathFull.length; i++) {
//   paths += `<path d="${pathFull[i]}" />`;
// }

path = `<path d="${generate(data)}" />`

if (data.length) {
  var svg = `<svg width="${canvasW}px" height="${canvasH}px">${path}</svg>`;
}

div.innerHTML = svg;

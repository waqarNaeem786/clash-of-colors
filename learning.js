// chainable function
const context = document.getElementById("canvas").getContext("2d");
canvas.width = window.innerWidth
canvas.height = window.innerHeight

window.onload = () => {
    // for drawing the rectangles
    //    context.fillRect(25,25,100,100);
    //  context.strokeRect(50,50,50,50);

    // for drawing lines on the canvas grid system
    // context.beginPath();
    // context.moveTo(75, 50);
    // context.lineTo(100, 75);
    // context.lineTo(100, 25);
    // context.fill();

    // drawing circular arcs: arcs are related to circle half full etc
    // for (let i = 0; i < 4; i++) {
    //   for (let j = 0; j < 3; j++) {
    //     context.beginPath();
    //     const x = 25 + j * 50; // x coordinate
    //     const y = 25 + i * 50; // y coordinate
    //     const radius = 20; // Arc radius
    //     const startAngle = 0; // Starting point on circle
    //     const endAngle = Math.PI + (Math.PI * j) / 2; // End point on circle
    //     const counterclockwise = i % 2 !== 0; // clockwise or counterclockwise

    //     context.arc(x, y, radius, startAngle, endAngle, counterclockwise);

    //     if (i > 1) {
    //       context.fill();
    //     } else {
    //       context.stroke();
    //     }
    //   }
    // }

    // bezire curve and quadraticcurveto to drwa curves like prompt etc.
    // context.beginPath();
    // context.moveTo(75, 25);
    // //quadraticcurveto(cx, cy, x, y)
    // context.quadraticCurveTo(25, 25, 25, 62.5);
    // context.quadraticCurveTo(25, 100, 50, 100);
    // context.stroke()


    //canvas rotation
    // context.save();

    // // Translate to the canvas center
    // context.translate(canvas.width / 2, canvas.height / 2);

    // // Rotate by 45 degrees for an isometric-like grid
    // context.rotate(45 * Math.PI / 180);

    // // Draw a simple isometric grid
    // const gridSize = 50; // Size of each grid cell
    // const numCells = 10; // Number of cells in each direction

    // // Draw grid lines
    // context.beginPath();
    // for (let i = -numCells; i <= numCells; i++) {
    // 	// Vertical lines (in rotated coordinates)
    // 	context.moveTo(i * gridSize, -numCells * gridSize);
    // 	context.lineTo(i * gridSize, numCells * gridSize);
    // 	// Horizontal lines
    // 	context.moveTo(-numCells * gridSize, i * gridSize);
    // 	context.lineTo(numCells * gridSize, i * gridSize);
    // }
    // context.strokeStyle = 'black';
    // context.stroke();

    // // Restore the original context state
    // context.restore();

}


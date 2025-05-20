const context = document.getElementById("canvas").getContext("2d");
canvas.width = 1000;
canvas.height = 500;

let radius = 40;
let x = canvas.width-500;
let y = canvas.height-40;
let height;

function circle(){
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI);
    context.fill();
    context.closePath();
    height = 2 * 40;
}



function clear(){
     context.clearRect(0, 0, canvas.width, canvas.height);
}



function movement(){
    switch (event.key) {
    case 'ArrowUp':
        if (y - radius - 10 >= 0) {
            y -= 10;
        }
        break;

    case 'ArrowDown':
        if (y + radius + 10 <= canvas.height) {
            y += 10;
        }
        break;

    case 'ArrowLeft':
        if (x - radius - 10 >= 0) {
            x -= 10;
        }
        break;

    case 'ArrowRight':
        if (x + radius + 10 <= canvas.width) {
            x += 10;
        }
	event.preventDefault();
        break;
    }
    clear()
    circle()
}

document.addEventListener("keydown", movement)

circle();

//TODO: add the rain effect 
function colorDrops(){
    context.clearRect(0, 0, canvas.width, canvas.height);
    let dx = Math.random() * canvas.width;
    let dy = 0;
    let dradius = 10;
    const colors = ['red', 'green', 'blue', 'yellow'];
    context.beginPath();
    for(let i = 0; i < canvas.width; i++){
	dy += 3;
	context.arc(dx, dy, dradius, 0, 2 * Math.PI);
    }
    
    colors.forEach(element => {
	context.fillStyle = element
    })
    context.fill();
    context.closePath();
//    requestAnimationFrame(colorDrops); 
}

colorDrops();

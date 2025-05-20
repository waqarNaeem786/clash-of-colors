const context = document.getElementById("canvas").getContext("2d");
canvas.width = 1000;
canvas.height = 500;

let radius = 40;
let x = canvas.width-500;
let y = canvas.height-40;
const dradius = 10;
const drops = [];
const colors = ['red', 'green', 'blue', 'yellow'];
const circleColors = ['red', 'green', 'blue', 'yellow'];
let randomcolor = circleColors[Math.floor(Math.random()*colors.length)];


function spwanDrops(){
    const drop = {
	x : Math.random() * canvas.width,
	y: 0,
	color: colors[Math.floor(Math.random()*colors.length)]
    };

    drops.push(drop);
}


function circle(){
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI);
    context.fillStyle = randomcolor;
    context.fill();
    context.closePath();
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

        break;
    }
    event.preventDefault();
    circle()
}

document.addEventListener("keydown", movement)





const colorDrops = () =>{
  context.clearRect(0, 0, canvas.width, canvas.height);
    for(let drop of drops){
	drop.y += 3;
	context.beginPath();
	context.arc(drop.x, drop.y, dradius, 0, 2 * Math.PI);
	context.fillStyle = drop.color;
	context.fill();
	context.closePath();
    }
    
    if (Math.random() < 0.1) {
        spwanDrops()
    }

    circle();   
    requestAnimationFrame(colorDrops);

}

colorDrops();




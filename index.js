const context = document.getElementById("canvas").getContext("2d");
const context2 = document.getElementById("scoreCanvas").getContext("2d");

canvas.width = 1000;
canvas.height = 500;

let gamestate = "home"
let radius = 40;
let x = canvas.width-500;
let y = canvas.height-40;
const dradius = 10;
const drops = [];
const colors = ['red', 'green', 'blue', 'yellow'];
const circleColors = ['red', 'green', 'blue', 'yellow'];
let playercolor = circleColors[Math.floor(Math.random()*colors.length)];
let score = 0;
let animationId;
let clickBound = false;

function init (){
    if(gamestate === "home"){
	playButton()
    }

}

function playButton(){
    context.strokeRect(canvas.width / 2 - 120, canvas.height / 2, 200, 50)  
    context.font = "40px Mono";
    context.fillText("▶ Play", canvas.width / 2 - 80, 285);
    if (!clickBound) {
        canvas.addEventListener("click", handlePlayClick);
        clickBound = true;
    }
}

function handlePlayClick(event){
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const symbolX = canvas.width / 2 - 100;
    const symbolY = canvas.height / 2;
    const symbolWidth = 200;
    const symbolHeight = 50;

    if (
        mouseX >= symbolX &&
        mouseX <= symbolX + symbolWidth &&
        mouseY >= symbolY &&
        mouseY <= symbolY + symbolHeight
    ) {
        gamestate = "play";
	colorDrops();
    }
}


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
    context.fillStyle = playercolor;
    context.fill();
    context.closePath();
}

function movement(){
    switch (event.key) {
    case 'ArrowUp':
        if (y - radius - 20 >= 0) {
	    y -= 20;
        }
        break;

    case 'ArrowDown':
        if (y + radius + 20 <= canvas.height) {
	    y += 20;
        }
        break;

    case 'ArrowLeft':
        if (x - radius - 20 >= 0) {
	    x -= 20;
        }
        break;

    case 'ArrowRight':
        if (x + radius + 20 <= canvas.width) {
	    x += 20;
        }

        break;
    }
    event.preventDefault();
    circle()
}

document.addEventListener("keydown", movement)

const scoreUpdate = (scoreIncrease)=>{
    context2.clearRect(0, 0, canvas.width, canvas.height); 
    context2.beginPath();
    context2.arc(20, 30, 15, 0, 2 * Math.PI);
    context2.fillStyle = playercolor;
    context2.fill();
    context2.closePath();

    // Draw score text
    context2.fillStyle = "black";
    context2.font = "20px sans-serif";
    context2.fillText(`: ${scoreIncrease}`, 40, 35);
}

const endGame = () =>{
    cancelAnimationFrame(animationId); 
    context.fillStyle = "black";
    context.font = "48px sans-serif";
    context.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2)
    context.fillText("⟳", canvas.width - 500, canvas.height-200)
    canvas.addEventListener("click", (event) => {
	const rect = canvas.getBoundingClientRect();
	const mouseX = event.clientX - rect.left;
	const mouseY = event.clientY - rect.top;
	const symbolX = canvas.width - 500;
	const symbolY = canvas.height-200;
	const symbolWidth = 40;
	const symbolHeight = 48;

	if (
	    mouseX >= symbolX &&
		mouseX <= symbolX + symbolWidth &&
		mouseY >= symbolY - symbolHeight &&
		mouseY <= symbolY
	) {
	    gamestate = "play";
	    window.location.reload();
	
	}
    });
}



const colorDrops = () =>{
    if (gamestate !== "play") return;

    context.clearRect(0, 0, canvas.width, canvas.height);
    for(let i = 0; i < drops.length; i++){
	let drop = drops[i]
	drop.y += 3;
	context.beginPath();
	context.arc(drop.x, drop.y, dradius, 0, 2 * Math.PI);
	context.fillStyle = drop.color;
	context.fill();
	context.closePath();

	const dx = drop.x - x;
	const dy = drop.y - y;
	const distance = Math.sqrt(dx*dx + dy*dy)
	if(distance < dradius + radius){
	    if(drop.color === playercolor){
		score++;
		drops.splice(i, 1);
		i--;
		scoreUpdate(score);
	    }else{
		endGame();
		return
	    }
	}
    }
    
    if (Math.random() < 0.1) {
        spwanDrops()
    }
    
    circle();   

    animationId = requestAnimationFrame(colorDrops);
  

}

init();

import handleUser from './handleuser.js'
const context = document.getElementById("canvas").getContext("2d");
const context2 = document.getElementById("scoreCanvas").getContext("2d");

canvas.width = 1000;
canvas.height = 500;

let opponentScore = 0;
let opponentX = canvas.width - 800;
let opponentY = canvas.height - 40;
let socket = null;
const initUrlParser = new URLSearchParams(window.location.search);
const getRoomIdForUserAuth = initUrlParser.get("roomId")
let gamestate = "home"
let radius = 40;
let x = canvas.width-500;
let y = canvas.height-40;
const dradius = 10;
const drops = [];
const colors = ['red', 'green', 'blue', 'yellow'];
const circleColors = ['red', 'green', 'blue', 'yellow'];
let playercolor;
    //= circleColors[Math.floor(Math.random()*colors.length)];
let score = 0;
let animationId;
let clickBound = false;
let animationControl = true;
let move;

function init (){
    if(gamestate === "home"){
	playButton()
    }

}

if(getRoomIdForUserAuth){
    gamestate = "joining"
    userJoiningCheck(getRoomIdForUserAuth);
    
}else{
    gamestate = "home"
    playercolor = circleColors[Math.floor(Math.random()*colors.length)]
    init();
}

function createOpponent(opponentData){
      switch (opponentData.move) {
        case "ArrowUp":
            if (opponentY - radius - 20 >= 0) opponentY -= 20;
            break;
        case "ArrowDown":
            if (opponentY + radius + 20 <= canvas.height) opponentY += 20;
            break;
        case "ArrowLeft":
            if (opponentX - radius - 20 >= 0) opponentX -= 20;
            break;
        case "ArrowRight":
            if (opponentX + radius + 20 <= canvas.width) opponentX += 20;
            break;
    }
}

function userJoiningCheck(roomId){
    if (gamestate != "joining") return;
    socket = new WebSocket("ws://localhost:6969/ws")

    socket.onopen = () => {
	console.log("WebSocket connected!");
	if (getRoomIdForUserAuth != "") {
            socket.send(JSON.stringify({
		type: "join",
		roomId,
		move,
		score
		
            }))
	}
    };
    
    socket.onmessage = (e) =>{
	let serverdata = JSON.parse(e.data)
	console.log(serverdata)
	if(serverdata.message == "successful"){
	    playercolor = serverdata.color
	    gamestate = "play"
	    animationId = requestAnimationFrame(colorDrops);
	    inviteFriend()
	    
	}

	if(serverdata.type === "move"){
	    createOpponent(serverdata)
	    opponentScore = serverdata.score
	    scoreUpdate()
	}
	
	socket.onerror = (e) => {
	    console.error("WebSocket error:", e);
	}


	
    }
}

function copyUrlPrompt(urlToShow){
    const rectX = 100;
    const rectY = 150;
    const rectWidth = 800;
    const rectHeight = 100;

    context.fillStyle = "lightgray";
    context.fillRect(rectX, rectY, rectWidth, rectHeight);
    context.strokeStyle = "black";
//    context.strokeRect(rectX, rectY, rectWidth, rectHeight);
    context.fillStyle = "black";
    context.font = "20px Arial";
    context.fillText(urlToShow, rectX + 40, rectY + 50);
    cancelAnimationFrame(animationId);
    animationControl = false
    canvas.addEventListener("click", (event) => {
	const rect = canvas.getBoundingClientRect();
	const x = event.clientX - rect.left
	const y = event.clientY - rect.top;

        const insideRect =
              x > rectX &&
              x < rectX + rectWidth &&
              y > rectY &&
              y < rectY + rectHeight;

        if (insideRect) {
            navigator.clipboard.writeText(urlToShow)
                .then(() => {
		    alert("Copied: " + urlToShow)
		    context.clearRect(rectX, rectY, rectWidth, rectHeight)
		    animationControl = true;
		    animationId = requestAnimationFrame(colorDrops);
		     window.location.replace(urlToShow);
		})
                .catch(err => console.error("Copy failed:", err));
        }
    });

}

function inviteFriend(){
    if (document.getElementById("inviteFriend")) return;
    const button = document.createElement("Button")
    button.setAttribute("id","inviteFriend");
    button.textContent = "Invite Friend"
    const div = document.querySelector(".canvas")
    div.insertBefore(button, div.firstChild)
    button.onclick = async function (){
	let result = await handleUser()
	copyUrlPrompt(result)
//	window.location.replace(result)
	//history.replaceState({},'',result)
	
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
//	colorDrops();
	animationId = requestAnimationFrame(colorDrops)
	inviteFriend();

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
	    move = "ArrowUp"
	}
	
        break;

    case 'ArrowDown':
        if (y + radius + 20 <= canvas.height) {
	    y += 20;
	    move = "ArrowDown"
        }

        break;

    case 'ArrowLeft':
        if (x - radius - 20 >= 0) {
	    x -= 20;
	    move = "ArrowLeft"
        }

        break;

    case 'ArrowRight':
        if (x + radius + 20 <= canvas.width) {
	    x += 20;
	    move = "ArrowRight"
        }


        break;
    }
    event.preventDefault();
    circle()

    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
            type: "move",
            roomId: getRoomIdForUserAuth,
            move: move,
            score: score 
        }));
    }
}

document.addEventListener("keydown", movement)

const scoreUpdate = () => {
    // Clear entire score canvas once
    context2.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player score circle
    context2.beginPath();
    context2.arc(20, 30, 15, 0, 2 * Math.PI);
    context2.fillStyle = playercolor;
    context2.fill();
    context2.closePath();

    // Draw player score text
    context2.fillStyle = "black";
    context2.font = "20px sans-serif";
    context2.fillText(`: ${score}`, 40, 35);

    if (socket && socket.readyState === WebSocket.OPEN) {
	// Draw opponent score circle
	context2.beginPath();
	context2.arc(20, 60, 15, 0, 2 * Math.PI);
	// Opponent color opposite to player color
	if (playercolor === "green") {
            context2.fillStyle = "red";
	} else if (playercolor === "red") {
            context2.fillStyle = "green";
	}
	context2.fill();
	context2.closePath();

	// Draw opponent score text
	context2.fillStyle = "black";
	context2.font = "20px sans-serif";
	context2.fillText(`: ${opponentScore ?? 0}`, 40, 65);
    }
}


function handleRestartClick(event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const symbolX = canvas.width - 500;
    const symbolY = canvas.height - 200;
    const symbolWidth = 40;
    const symbolHeight = 48;

    if (
        mouseX >= symbolX &&
        mouseX <= symbolX + symbolWidth &&
        mouseY >= symbolY - symbolHeight &&
        mouseY <= symbolY
    ) {
        // Reset game state
        gamestate = "play";
        score = 0;
        drops.length = 0; // Clear drops array
        animationControl = true;


        // Remove this listener after first click
        canvas.removeEventListener("click", handleRestartClick);

        // Restart animation
        animationId = requestAnimationFrame(colorDrops);

        inviteFriend(); // optional
    }
}

const endGame = () => {
    cancelAnimationFrame(animationId);

    context.fillStyle = "black";
    context.font = "48px sans-serif";
    context.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2);
    context.fillText("⟳", canvas.width - 500, canvas.height - 200);

    // Avoid multiple registrations
    canvas.removeEventListener("click", handleRestartClick);
    canvas.addEventListener("click", handleRestartClick);
}




const colorDrops = () =>{
    if (gamestate !== "play" && !animationControl) return;

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
		scoreUpdate()
		drops.splice(i, 1);
		i--;
		
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

    if (socket && socket.readyState === WebSocket.OPEN) {
	context.beginPath();
	context.arc(opponentX, opponentY, radius, 0, 2 * Math.PI);
	if(playercolor === "green"){
	    context.fillStyle = "red";
	}else if(playercolor === "red"){
	    context.fillStyle = "green";
	}
	context.fill();
	context.closePath();
    }

    if(animationControl === true)    
	animationId = requestAnimationFrame(colorDrops);
    

}

init()

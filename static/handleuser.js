async function handleUser(){
    try{
	let url = "http://localhost:6969/newlink"
	let data = "create new link"
	let res = await fetch(url, {
	    method: "POST",
	    body: data
	    
	})
	let response = await res.text()
	return response
    }catch(error){
	console.error(error)
    }
}

function createWebSocket(){
//    console.log(window.location.search)
    if(window.location.search != ''){
	let socket = new WebSocket("ws://localhost:6969/ws")
	socket.onopen = (e) =>{
	    socket.send("Request from the Client")
	}
	
	socket.onmessage = (e) =>{
	    console.log(e.data)
	}
    }
   
}

createWebSocket()
export default handleUser

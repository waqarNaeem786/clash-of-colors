async function handleUser(){
    try{
	const currentParams = new URLSearchParams(window.location.search);
	const existingRoomId = currentParams.get("roomId");

	if (existingRoomId) {
            // Don't create a new link — reuse the existing one
            return `${window.location.origin}/?roomId=${existingRoomId}`;
	}
	
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


export default handleUser

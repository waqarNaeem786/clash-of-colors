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

export default handleUser

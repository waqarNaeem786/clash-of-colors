package main

import (
	"fmt"
	"net/http"
	"io"
	"github.com/google/uuid"
)

type userId struct{
	uid string
}

func createWebsocket(q string){
	fmt.println(q)

}
func createId(id string) string{
	if id == "create new link"{
		return uuid.New().String();
	}

	return id

}

func newlink(w http.ResponseWriter, r *http.Request){
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
        w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	bodyreq, err := io.ReadAll(r.Body)
	if err != nil{
		fmt.Println(err)
	}

	data := string(bodyreq)
	id := createId(data)
	path := r.URL.Path
	sendData := path+"?identifier="+id
	u := userId{uid: sendData}
	w.Write([]byte("http://localhost:6969"+u.uid))
	// when the link is opened create websocket
	query := r.URL.Query().Get("identifier")
	createWebsocket(query)
}

func main (){

	http.HandleFunc("/newlink", newlink)
	http.ListenAndServe(":6969", nil)
}

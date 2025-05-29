package main

import (
	"fmt"
	"net/http"
	"net/url"
	"io"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)
var connection bool;
var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true 
	},
}

type userId struct{
	uid string
}

func createWebsocket(w http.ResponseWriter, r *http.Request){
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil{
		fmt.Println(err)
		return
	}

	defer conn.Close()

	for {
		messageType, message, err:= conn.ReadMessage()
		if err != nil{
			fmt.Println(err)
			break
		}

		fmt.Println(string(message))
		serverMessage := "Request from Server"
		if err := conn.WriteMessage(messageType, []byte(serverMessage)); err != nil {
			fmt.Println("Write error:", err)
			break
		}		
	}
}


func createId(id string) string{
	if id == "create new link"{
		return uuid.New().String();
	}

	return id

}

func newlink(w http.ResponseWriter, r *http.Request){
	bodyreq, err := io.ReadAll(r.Body)
	if err != nil{
		fmt.Println(err)
	}

	reqFromInviteFriend := string(bodyreq)
	roomid := createId(reqFromInviteFriend)
	u := url.URL{
		Scheme: "http",
		Host:   "localhost:6969",
		Path:   r.URL.Path,
	}

	query := u.Query()
	query.Set("roomId", roomid)
	u.RawQuery = query.Encode()
	uid := userId{uid: u.String()}

	// when the link is opened create websocket
	if id := r.URL.Query().Get("roomId"); id != ""{
		http.Redirect(w, r, "/?roomId="+id, http.StatusFound)
	}
	w.Write([]byte(uid.uid))
}

func serveGame(w http.ResponseWriter, r *http.Request){
	if r.URL.Path == "/" {
		http.ServeFile(w, r, "static/index.html")
		return
	}
	http.StripPrefix("/static/", http.FileServer(http.Dir("static"))).ServeHTTP(w, r)

	
	if r.URL.Query().Get("roomId") != "" {
		connection = true
	}
}

func main (){
	http.HandleFunc("/", serveGame)
	http.HandleFunc("/newlink", newlink)
	http.HandleFunc("/ws", createWebsocket)
	http.ListenAndServe(":6969", nil)
	fmt.Println("server Running at 6969 ...")
}

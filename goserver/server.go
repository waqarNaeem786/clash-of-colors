// Home page will show play button with background showing falling bubbles
// on play screen on the right side add the add invite friend button
// user invites the friend which adds the second random circle on the screen
// if one player dies the other player can add him again
// or the one whose game ended can wither restart in the same room or can play on its on.



package main

import (
	"fmt"
	"net/http"
	"github.com/gorilla/websocket"
)

// Upgrader is used to upgrade the http to the websocket connection
var upgrader = websocket.Upgrader{
	CheckOrigin: func (r *http.Request) bool {
		return true
	},
}

func wsHandler(w http.ResponseWriter, r *http.Request){
	conn, _ := upgrader.Upgrade(w, r, nil)
	for {
		msgType, msg, err := conn.ReadMessage()
		if err != nil {
			return
		}

		fmt.Printf("%s sent: %s\n", conn.RemoteAddr(), string(msg))

		if err = conn.WriteMessage(msgType, msg); err != nil{
			return
		}
	}


}
func main (){
	http.HandleFunc("/ws", wsHandler)
	fmt.Println("WebSocket server started on :8080")
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		fmt.Println("Error starting server:", err)
	}
	




}

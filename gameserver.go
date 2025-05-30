package main

import (
	"fmt"
	"net/http"
	"net/url"
	"io"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
	"encoding/json"
	"log"
	"sync"
)
var connection bool;
var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true 
	},
}

type userId struct{
	Id []string
}

var (
	rooms = make(map[string]*Room)
	mu sync.Mutex
)


type PlayerColor struct{
	Color string `json:"color"`
	Message string `json:"message"`
}


type Room struct{
	Players []*websocket.Conn
}
var generatedIds userId;
type Message struct{
	Type string `json:"type"`
	RoomId string `json:"roomId"`
}


func createWebsocket(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println(err)
		return
	}
	defer conn.Close()

	var msg Message

	for {
		// Read message from client
		messageType, message, err := conn.ReadMessage()
		if err != nil {
			fmt.Println("Read error:", err)
			break
		}

		if err := json.Unmarshal(message, &msg); err != nil {
			log.Println("Unmarshal error:", err)
			continue
		}

		roomId := msg.RoomId
		if roomId == "" {
			fmt.Println("Missing roomId")
			continue
		}

		mu.Lock()

		// Get or create the room
		room, exists := rooms[roomId]
		if !exists {
			room = &Room{}
			rooms[roomId] = room
		}

		// Check if room is full
		if len(room.Players) >= 2 {
			mu.Unlock()
			errMsg := PlayerColor{Color: "none", Message: "room full"}
			errJson, _ := json.Marshal(errMsg)
			conn.WriteMessage(messageType, errJson)
			break
		}

		// Add the player
		room.Players = append(room.Players, conn)
		playerIndex := len(room.Players) - 1
		mu.Unlock()

		// Assign color
		color := "green"
		if playerIndex == 1 {
			color = "red"
		}

		resp := PlayerColor{Color: color, Message: "successful"}
		respJson, _ := json.Marshal(resp)
		if err := conn.WriteMessage(messageType, respJson); err != nil {
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
	generatedIds.Id = append(generatedIds.Id, roomid)
	fmt.Println(generatedIds)

	// when the link is opened create websocket
	if id := r.URL.Query().Get("roomId"); id != ""{
		http.Redirect(w, r, "/?roomId="+id, http.StatusFound)
	}
	w.Write([]byte(u.String()))
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

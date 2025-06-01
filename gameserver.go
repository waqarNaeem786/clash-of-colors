package main

import (
	"fmt"
	"net/http"
	"net/url"
	"io"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
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
	rooms = make(map[string][]*websocket.Conn)
	mu sync.Mutex
)


type PlayerProps struct{
	Color string `json:"color"`
	Message string `json:"message"`
	PlayerNo int `json:"playerNo"`
}



var generatedIds userId;
type Message struct{
	Type string `json:"type"`
	RoomId string `json:"roomId"`
	Move     string `json:"move"`    
	Score    int    `json:"score"`
	Color string `json:color`
}


func createWebsocket(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println(err)
		return
	}

	var msg Message
	var color string

	if err := conn.ReadJSON(&msg); err != nil {
		log.Println("Unmarshal error:", err)
		
	}

	roomId := msg.RoomId
	if roomId == ""{
		log.Fatal("Missing Roomid")
		return
	}

	defer func() {
		mu.Lock()
		defer mu.Unlock()
		room := rooms[roomId]
		for i, c := range room {
			if c == conn {
				rooms[roomId] = append(room[:i], room[i+1:]...)
				break
			}
		}
		conn.Close()
	}()



	mu.Lock()
	room, exists := rooms[roomId]
	if !exists {
		rooms[roomId] = []*websocket.Conn{conn}
	} else {
		rooms[roomId] = append(room, conn)
	}
	
	room = rooms[roomId]

	playerIndex := len(room)-1
	mu.Unlock()
	if playerIndex >= 2{

		errMsg := PlayerProps{
			Color: "none",
			Message: "room full",
		}
		conn.WriteJSON(errMsg)
		
	}else{
		
		color = "green"
		if playerIndex == 1 {
			color = "red"
		}
		
		resp := PlayerProps{
			Color: color,
			Message: "successful",
			PlayerNo: playerIndex + 1,
		}

		conn.WriteJSON(resp)
		
	}

	for {	
		if err := conn.ReadJSON(&msg); err != nil {
			log.Fatal("error:", err)
			break
			
		}

		mu.Lock()
		currentRoom := rooms[roomId]
		for i, c := range currentRoom {
			if i != playerIndex { // Don't send to self
				if err := c.WriteJSON(msg); err != nil {
					log.Println("Write error:", err)
				}
			}
		}
		mu.Unlock()
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
	//fmt.Println(generatedIds)

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

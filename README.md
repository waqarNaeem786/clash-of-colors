https://github.com/user-attachments/assets/48a9d5e5-ede2-4364-af44-9b0fad0a8f71


# Multiplayer Color Drop Game

A simple real-time multiplayer game built with Go backend and HTML5 Canvas frontend. Players collect drops matching their color while avoiding drops of other colors. The game uses WebSockets for real-time communication between clients.

## Features

* Real-time multiplayer gameplay with WebSocket connections.
* Room system for players to join and play together.
* Dynamic player assignment with color coding (green and red).
* Smooth animation of falling colored drops.
* Score tracking for both players.
* Invite friends via generated room links.
* Game restart functionality.

## Backend

* Implemented in Go using the Gorilla WebSocket library.
* Manages player connections and rooms.
* Handles message broadcasting between players.
* Generates unique room IDs for private game sessions.

## Frontend

* HTML5 Canvas used for rendering the game.
* JavaScript handles game logic, player movement, and rendering.
* Connects to backend WebSocket server.
* Displays scores and provides UI for inviting friends and restarting the game.

## Getting Started

### Prerequisites

* Go 1.18 or higher installed.
* Modern browser with WebSocket support.

### Running the Server

1. Clone the repository:

   ```
   git clone <repository-url>
   cd <repository-folder>
   ```
2. Run the Go server:

   ```
   go run main.go
   ```
3. Open a browser and navigate to:

   ```
   http://localhost:6969
   ```

### Playing the Game

* Click the "Play" button to start a new game.
* Use arrow keys to move your player circle.
* Collect drops matching your color to increase score.
* Avoid drops of other colors to prevent game over.
* Invite a friend using the generated link to play together in the same room.

## Project Structure

* `main.go` — Go server handling WebSocket connections and HTTP requests.
* `static/index.html` — Frontend HTML page.
* `static/js/` — JavaScript files containing game logic and WebSocket communication.
* `static/css/` — (If applicable) CSS styles for the frontend.

## Notes

* The server currently runs on localhost:6969. Update URLs in the frontend if deployed elsewhere.
* Room capacity is limited to 2 players.
* The backend accepts all WebSocket origins (`CheckOrigin` returns true). For production, restrict this for security.

## Future Improvements

* Add authentication for users.
* Persist game state in case of disconnects.
* Support more players per room.
* Improve UI/UX design.
* Add sound effects and animations.




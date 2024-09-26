const express = require('express');
const http = require('http');
const path = require('path');

const app = express();
const cors = require('cors');
const corsConfig = {
    origin: "*",
    credential: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
}
app.options("", cors(corsConfig));
app.use(cors(corsConfig));

const socketio = require("socket.io");
const server = http.createServer(app);
const io = socketio(server);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
    socket.on("send-location", (data) => {
        io.emit("receive-location", { id: socket.id, ...data });
    });
    
    socket.on("disconnect", () => {
        io.emit("user-disconnected", socket.id);
    })
})

app.get('/', (req, res) => {
    res.render("index");
})

server.listen(8000, () => {
    console.log("App is running on port 8000...");
});
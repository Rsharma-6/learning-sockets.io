import express from "express";
import { Server } from "socket.io";
import {createServer} from "http";

const port=3000;

const app=express();
const server=createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:5173",
     methods: ["GET", "POST"] }
}); 

io.on("connection",(Socket)=>{
    console.log("User Connected");
    console.log("ID", Socket.id);

    Socket.on("message", ({message,room})=>{
        console.log({message,room});
        io.to(room).emit("receive-message", message);   
     });

    Socket.emit("welcome",`welcome to the server`);

    Socket.broadcast.emit("welcome",`${Socket.id}  has joined the server`);

    Socket.on("join-room", (room)=>{
        Socket.join(room);
    });

    Socket.on("disconnect", ()=>{
        console.log("user disconnected", Socket.id);
    });
   
});

server.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
});
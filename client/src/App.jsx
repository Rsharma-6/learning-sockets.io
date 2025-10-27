import React from 'react'
import { useEffect,useMemo} from 'react';
import {io, Socket} from "socket.io-client"
import { Box,Button, Container, Stack,
  TextField, Typography
} from "@mui/material";
import { useState } from 'react';
const App = () => {
const socket = useMemo(() => io("http://localhost:3000"), []);
 const [message, setMessage]=useState("");
 const [room, setRoom]=useState("");
 const [socketID, setsocketID]=useState("");
const [messages, setMessages] = useState([]);

const handlesubmit = (e) => {
    e.preventDefault();
    socket.emit("message", {message, room});
   
  };

 useEffect(()=>{
  socket.on("connect", ()=>{
    setsocketID(socket.id)
    console.log("connected", socket.id);
  });
  socket.on("receive-message", (data)=>{
    console.log(data);
    setMessages((messages) => [...messages, data]);


  })
  socket.on("welcome",(s)=>{
    console.log(s);
  });
  
  return ()=>{
    socket.disconnect();
  }

},[]);

  return (
    <Container maxWidth="sm">
      <Typography variant='h1' component="div" gutterBottom>
        Learning Socket.io
      </Typography>
      <Typography variant='h4' color='success' component="div" gutterBottom>
        {socketID}
      </Typography>
      <form onSubmit={handlesubmit}>
        <TextField value={message} id="outlined-basic" label="message" variant='outlined' onChange={(e)=>setMessage(e.target.value )}/>
          <TextField value={room} id="outlined-basic" label="room" variant='outlined' onChange={(e)=>setRoom(e.target.value )}/>
          <Button type="submit" variant="contained" color="primary">
          Join
        </Button>
      </form>
        <Stack>
        {messages.map((m, i) => (
          <Typography key={i} variant="h4" color='primary' component="div" gutterBottom>
            {m}
          </Typography>
        ))}
      </Stack>
    </Container>
  )
}

export default App
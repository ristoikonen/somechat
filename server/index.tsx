// server/index.ts
//import React from 'react';
//import ReactDOM from 'react-dom/client';
import { Server } from 'socket.io';
import { createServer } from 'http';

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000', // Allow requests from React app
    methods: ['GET', 'POST'],
  },
});

io.on('connection', socket => {
  let username: string;

  socket.on('username', (name: string) => {
    username = name;
  });

  socket.on('chat message', msg => {
    io.emit('chat message', { ...msg, sender: username }); // Broadcast message to all clients
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

httpServer.listen(3001, () => {
  console.log('server listening on *:3001');
});

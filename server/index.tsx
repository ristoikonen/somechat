// server/index.ts
//import React from 'react';
//import ReactDOM from 'react-dom/client';
import { Server, Socket } from 'socket.io';
import { createServer } from 'http';

interface Message {
  text: string;
  sender: string;
  username: string;
  userId: string;
  senderId: string;
}

interface CustomSocket extends Socket {
  nickname?: string;
}

interface CustomSocket extends Socket {
  username?: string;
}

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000', // Allow requests from React app
    methods: ['GET', 'POST'],
  },

});

//io.sockets.setMaxListeners(4);



io.on('connection', socket => {
  let username: string;
  let sender: string;
  
  socket.on('username', (name: string) => {
    (socket as CustomSocket).username = name; // Add username attribute
  });

  socket.on('getUsername', () => {
    const name = (socket as CustomSocket).username;
    socket.emit('username', name); // Send username back to client
    socket.emit('sender', sender); // Send username back to client
  });

  socket.on('joinRoom', (room) => {
    socket.join(room);
  });

     // Handle the socket.io chat event
     socket.on("chat", (data) => {
     console.log("A user sent a message");
      // Send the message to all the sockets in the room
      io.to(data.room).emit("message", {
        user: data.user,
        text: data.text,
      });
    });

    
  socket.on('join', function (data) {
    socket.join(data.sender); // We are using room of socket io
    sender = data.sender;
    console.log('user joined room: ' + data.sender);
  });

/*   socket.on('setNickname', (nickname) => {
    socket.nickname = nickname; // Store nickname in socket object
  });
  socket.on('getNickname', () => {
    socket.emit('nickname', socket.nickname); // Send nickname back to client
  });
 */

  /* 
  io.on('connection', (socket) => {
    socket.on('chat message', (message) => {
      io.emit('chat message', {
        message,
        senderId: socket.id
      });
    });
  });
*/

  socket.on('chat message', msg => {
    //msg += msg + ' ' + (username ?? 'empty suername'); // Append username to the message
    //const m = msg + ' ' + (username ?? 'empty suername');
    //msg = m;
    
    io.emit('chat message', { ...msg,  senderId: socket.id , userId: msg.username }); // Broadcast message to all clients
  }); 

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

httpServer.listen(3001, () => {
  console.log('server listening on *:3001');
});

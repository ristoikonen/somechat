// client/src/App.tsx
import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './App.css';


const socket = io('http://localhost:3001'); // Connect to server

interface Message {
  text: string;
  sender: string;
  senderId: string;
  userId: string;
  time: Date;
}

let socketId = '';
//let UserId = ''; , userId: UserId

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessageText, setNewMessageText] = useState('');
  const [socketIdx, setSocketId] = useState<string>();
  const [username, setUsername] = useState('');

  const messageListRef = useRef<HTMLDivElement>(null);
  
  const messageInput = document.getElementById('message-input') as HTMLInputElement;

  //const sendButton = document.getElementById('send-button') as HTMLInputElement;
  
  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleUsernameEdit = (event: React.ChangeEvent<HTMLButtonElement>) => {
    setUsername(event.target.value);
  };

  useEffect(() => {

    socket.on("connect", () => {
      socketId = socket.id ?? '';
      setSocketId(socketId);
      console.log('socketId:', socketId ?? 'socketId is nuilli');
    });

    socket.on('chat message', (msg: Message) => {
      setMessages(prevMessages => [...prevMessages, msg]);
      //setIncomingMessageText(msg => msg);
      //const [newincomingMessage, setIncomingMessageText] = useState<Message>();
      console.log('Socket.on message for setIncomingMessage:', msg ?? 'msg is nuilli');
      console.log('from:', msg.senderId ?? 'senderId is nuilli');
      //console.log('messages:', messages ?? 'socketId is nuilli');
      console.log('username:', username ?? 'username is nuilli');

      //if (socketId && socketId.length > 0 && msg.sender !== username) {
      if (msg.sender !== username) {

        //setIncomingMessage(msg);
        console.log('setIncomingMessage called', msg ?? 'msg is nuilli');

        //if (socketIdx && socketIdx.length > 0 && msg.senderId !== socketIdx && msg.senderId !== socketIdx) {
        // if(msg.sender !== username){    }
    
        console.log('CREATING GREEM socketId:', socketIdx ?? 'socketId is nuilli');
        //console.log('setIncomingMessage msg:', msg);  //newMessage
        console.log('msg.sender !== socketId:', (msg.senderId !== socketIdx).toString());
    
        const messageArea = document.getElementById('message-container') as HTMLDivElement;
        const newMessageElement = document.createElement('div') as HTMLDivElement;
        const newMessageText = msg.text ?? ''; // messageInput.value : '';
          
        newMessageElement.className = 'message receiver-message'; 
        newMessageElement.textContent = newMessageText;
        messageArea.scrollTop = messageArea.scrollHeight;
    
        messageArea.appendChild(newMessageElement);

      }

      //setIncomingMessageText(msg);
      //console.log('from:', username ?? 'nuilli');
     
      if (messageListRef.current) {
        messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
      }
    });

    return () => {
      socket.off('chat message'); // Clean up listener
    };
  }, [username,socketIdx]);

/*
interface MMs {
  text: string;
  user: string;
  time: Date;
}


  const handleMessage = (value: MMs)=> {
    const message = {

      user: value.user || 'defaultUser',
      text: value.text || '',
      time: new Date()
    };

    //messages.add(message);
    sendM(message);

  }

  const sendM = (message: MMs) => {
   socket.emit('message', message);
  }
     const getUser = () => {
    socket.on("getUsername", (username: string) => {
      console.log('getUsername:', username ?? 'username is nuilli'); 
      UserId = username;   
    });
   }



*/



  
  const sendMessage = () => {

    //socket.emit('username', {name: username});

    if (newMessageText && username && username.trim() !== "") {
      console.log('sendMessage from:', username);
      const messageArea = document.getElementById('message-container') as HTMLDivElement;
      const newMessageElement: HTMLDivElement = document.createElement('div');
      const newMessageText = messageInput ? messageInput.value : '';
      newMessageElement.className = 'message sender-message'; 
      newMessageElement.textContent = newMessageText;
      messageArea.appendChild(newMessageElement);
      messageArea.scrollTop = messageArea.scrollHeight;
      socket.emit('chat message', { text: newMessageText, sender: username, senderId: socketIdx, time: new Date() });
    }

    
  };

/*
  const setIncomingMessage = (msg: Message) => {
    console.log('setIncomingMessage called', msg ?? 'msg is nuilli');

    //if (socketIdx && socketIdx.length > 0 && msg.senderId !== socketIdx && msg.senderId !== socketIdx) {
    // if(msg.sender !== username){    }

    console.log('CREATING GREEM socketId:', socketIdx ?? 'socketId is nuilli');
    //console.log('setIncomingMessage msg:', msg);  //newMessage
    console.log('msg.sender !== socketId:', (msg.senderId !== socketIdx).toString());

    const messageArea = document.getElementById('message-container') as HTMLDivElement;
    const newMessageElement = document.createElement('div') as HTMLDivElement;
    const newMessageText = msg.text ?? ''; // messageInput.value : '';
      
    newMessageElement.className = 'message receiver-message'; 
    newMessageElement.textContent = newMessageText;
    messageArea.scrollTop = messageArea.scrollHeight;

    messageArea.appendChild(newMessageElement);

  };
*/

  return (
    <div className="chat-container">


    <div>
      <label htmlFor="username">Username:</label>
      <input
        type="text"
        id="username"
        value={username}
        onChange={handleUsernameChange}
      />
      {/* ... other elements */}
    </div>


    {!username ? (
      <div className="login-screen">
        <input
          type="text"
          placeholder="Enter username"
          //value={username}
          //onChange={e => setUsername(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') {document.getElementById('usernameBtn')?.click();setUsername((e.target as HTMLInputElement).value)} }}
        />
        <button id="usernameBtn" onClick={() => { if (username) socket.emit('username', username) }}>Join Chat</button>
        <button onClick={() => handleUsernameEdit} id="edit-username-button">Join Chat</button>
      </div>
    ) : (
      <>
        <div className="message-list" ref={messageListRef}>
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender === username ? 'sent' : 'received'}`}>
              <span className="sender">{msg.sender}:</span> {msg.text}
            </div>
          ))}
        </div>

        <div className="chat-container">
        <div className="message-container" id="message-container">

          <div className="message receiver-message">

              Placeholder for guest message
          </div>

        
    </div>

    <div className="message" >
        <input type="text" 
                      id="message-input"
                      placeholder="Type a message..."
                      value={newMessageText}
                      onChange={e => setNewMessageText(e.target.value)}
                      //onKeyDown={(e) => { if (e.key === 'Enter') sendMessage() }}
                      ></input>
        <button onClick={sendMessage} id="send-button">Send</button>
      </div>
    </div>


          <div className="input-area">
            <input
              type="text"
              placeholder="Type a message..."
              value={newMessageText}
              //onChange={e => setNewMessage(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') sendMessage() }}
            />
            <button onClick={sendMessage}>Send</button>
            
          </div>
        </>
      )}
    </div>
  );
}

export default App;
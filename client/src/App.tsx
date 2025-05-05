// client/src/App.tsx
import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './App.css';

const users = new Map();

const defaultUser = {
  id: 'anon',
  name: 'Anonymous',
};

const socket = io('http://localhost:3001'); // Connect to server

interface Message {
  text: string;
  sender: string;
  senderId: string;
}

interface MMs {
  text: string;
  user: string;
  time: Date;
}

let socketId = '';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [newMessageWithSender, setNewMessageWithSender] = useState<Message>();
  const [newincomingMessage, setIncomingMessageText] = useState<Message>();
  const [username, setUsername] = useState('');
  const messageListRef = useRef<HTMLDivElement>(null);
  const messageInput = document.getElementById('message-input') as HTMLInputElement;
  const messageReceiver = document.getElementById('message receiver-message') as HTMLInputElement;

  const sendButton = document.getElementById('send-button') as HTMLInputElement;
  
  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  useEffect(() => {

    socket.on("connect", () => {
      socketId = socket.id ?? '';
      console.log('socketId:', socketId ?? 'socketId is nuilli');
    });

    socket.on('chat message', (msg: Message) => {
      setMessages(prevMessages => [...prevMessages, msg]);
      //setIncomingMessageText(msg => msg);
      //const [newincomingMessage, setIncomingMessageText] = useState<Message>();
      console.log('Socket.on message for setIncomingMessage:', msg ?? 'msg is nuilli');
      console.log('from:', msg.senderId ?? 'senderId is nuilli');
      console.log('socketId:', socketId ?? 'socketId is nuilli');

      if (socketId && socketId.length > 0 && msg.senderId !== socketId) {
        console.log('CREATING GREEM socketId:', socketId ?? 'socketId is nuilli');
        setIncomingMessage(msg);
      }

      //setIncomingMessageText(msg);
      //console.log('from:', username ?? 'nuilli');
     

      //TODO: do we need this?  Scroll to bottom when a new message arrives
      //setNewMessage(msg.text);

      if (messageListRef.current) {
        messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
      }
    });

    return () => {
      socket.off('chat message'); // Clean up listener
    };
  }, []);


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
  
  const sendMessage = () => {

    
    if (newMessage && username && username.trim() !== "") {
      console.log('sendMessage newMessage:', newMessage);
      console.log('sendMessage from:', username);
      const messageArea = document.getElementById('message-container') as HTMLDivElement;
      
      //const newMessageElement = document.getElementById('send-button') as HTMLInputElement;
      //const newMessageElement = document.createElement('div') as HTMLDivElement;
      const newMessageElement: HTMLDivElement = document.createElement('div');

      const newMessageText = messageInput ? messageInput.value : '';
      
      newMessageElement.className = 'message sender-message'; 
      newMessageElement.textContent = newMessageText;
      
      messageArea.appendChild(newMessageElement);
      //messageArea.appendChild(document.createElement('div'));
      //messageInput.innerHTML  = ''; // Clear the input field
      // Optionally, scroll to the bottom of the chat
      messageArea.scrollTop = messageArea.scrollHeight;

      socket.emit('chat message', { text: newMessage, sender: username });
      socket.emit('join', {sender: username});

      //setIncomingMessageText({ text: newMessage, sender: username });
      //console.log('sendMessage message:', newMessage);
      //console.log('sendMessage join:', username);
    }

  };


  const setMessage = () => {
    console.log('setMessage called');
    
    //if (username) {
      console.log('Sending message:', newMessage);
      console.log('from:', username);
      const messageArea = document.getElementById('message-container') as HTMLDivElement;
      if(newMessage && username) {
        
      
        //const newMessageElement = document.getElementById('send-button') as HTMLInputElement;
        const newMessageElement = document.createElement('div') as HTMLDivElement;
        const newMessageText = messageInput ? messageInput.value : '';
        
        newMessageElement.className = 'message receiver-message'; 
        newMessageElement.textContent = newMessageText;
        
        messageArea.appendChild(newMessageElement);
        messageArea.appendChild(document.createElement('div'));
      }

      else if(newMessage && (!username || username.trim() === "")) 
      {
        console.log('EI Sending message:', newMessage);
        console.log('EI from:', username);

        const newMessageElement = document.createElement('div') as HTMLDivElement;
        const newMessageText = messageInput ? messageInput.value : '';
        
        newMessageElement.className = 'message sender-message'; 
        newMessageElement.textContent = newMessageText;
        
        messageArea.appendChild(newMessageElement);
        messageArea.appendChild(document.createElement('div'));
      }

/*
      <div key={index} className={`message ${msg.sender === username ? 'sent' : 'received'}`}>
      <span className="sender">{msg.sender}:</span> {msg.text}
    </div>
*/

      //messageInput.innerHTML  = ''; // Clear the input field
      // Optionally, scroll to the bottom of the chat
      messageArea.scrollTop = messageArea.scrollHeight;

      //socket.emit('chat message', { text: newMessage, sender: username });
      //setNewMessage('');
      
    //}

  };


  const setIncomingMessage = (msg: Message) => {
    console.log('setIncomingMessage called');
    const messageArea = document.getElementById('message-container') as HTMLDivElement;



    if (socketId && socketId.length > 0 && msg.senderId !== socketId) {
      console.log('CREATING GREEM socketId:', socketId ?? 'socketId is nuilli');
      console.log('setIncomingMessage msg:', msg);  //newMessage
      console.log('msg.sender !== socketId:', (msg.senderId !== socketId).toString());


      const newMessageElement = document.createElement('div') as HTMLDivElement;
        const newMessageText = msg.text ?? ''; // messageInput.value : '';
        
        newMessageElement.className = 'message receiver-message'; 

        newMessageElement.textContent = newMessageText;
        
        messageArea.appendChild(newMessageElement);
        console.log('newMessageElement created from msg.text:', msg.text ?? 'nuill');
        console.log('newMessageElement :', newMessageElement ?? 'nuill');
    }
  /*  
      const newMessageElement: HTMLDivElement = document.createElement('div');
      const newMessageText = msg.text ? msg.text : '';
      
      newMessageElement.className = 'message receiver-message'; 
      newMessageElement.textContent = msg.text;
      
      messageArea.appendChild(newMessageElement); */

      // Optionally, scroll to the bottom of the chat
      messageArea.scrollTop = messageArea.scrollHeight;

    //}
  };


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
            value={username}
            onChange={e => setUsername(e.target.value)}
            //onKeyDown={(e) => { if (e.key === 'Enter') document.getElementById('usernameBtn')?.click() }}
          />
          <button id="usernameBtn" onClick={() => { if (username) socket.emit('username', username) }}>Join Chat</button>
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
                      value={newMessage}
                      onChange={e => setNewMessage(e.target.value)}
                      //onKeyDown={(e) => { if (e.key === 'Enter') sendMessage() }}
                      ></input>
        <button onClick={sendMessage} id="send-button">Send</button>
      </div>
    </div>


          <div className="input-area">
            <input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
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
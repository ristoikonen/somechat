// client/src/App.tsx
import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './App.css';

const socket = io('http://localhost:3001'); // Connect to server

interface Message {
  text: string;
  sender: string;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [newincomingMessage, setIncomingMessageText] = useState<Message>();
  const [username, setUsername] = useState('');
  const messageListRef = useRef<HTMLDivElement>(null);
  const messageInput = document.getElementById('message-input') as HTMLInputElement;
  const messageReceiver = document.getElementById('message receiver-message') as HTMLInputElement;
  //const newMessageElement = document.getElementById('message receiver-message') as HTMLInputElement;
  const sendButton = document.getElementById('send-button') as HTMLInputElement;
  
  useEffect(() => {

    /*
    messageInput.onkeydown = (e) => {
      if (e.key === 'Enter') {
        //sendButton.click();
        sendMessage();
      }
    };
    */

    socket.on('chat message', (msg: Message) => {
      setMessages(prevMessages => [...prevMessages, msg]);
      setIncomingMessageText(msg);

      console.log('Socket.on message:', msg.text);
      //messageReceiver.textContent = msg.text;
      console.log('from:', username);

      //TODO: do we need this?  Scroll to bottom when a new message arrives
      //setNewMessage(msg.text);
      //setIncomingMessageText(msg);

      if (messageListRef.current) {
        messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
      }
    });

    return () => {
      socket.off('chat message'); // Clean up listener
    };
  }, []);

  
  const sendMessage = () => {
    console.log('sendMessage called');
    
    if (newMessage && username) {
      console.log('Sending message:', newMessage);
      console.log('newMessage:', newMessage);
      console.log('from:', username);
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
      //setNewMessage('');
    }
        // not from username => others!
        else
        {
          console.log('Sending ncoming message:', newMessage);
          console.log('from:', username);
          //setIncomingMessage();
    
        }
  };


  const setMessage = () => {
    console.log('setMessage called');
    
    if (username) {
      console.log('Sending message:', newMessage);
      console.log('from:', username);
      const messageArea = document.getElementById('message-container') as HTMLDivElement;
      
      //const newMessageElement = document.getElementById('send-button') as HTMLInputElement;
      const newMessageElement = document.createElement('div') as HTMLDivElement;
      const newMessageText = messageInput ? messageInput.value : '';
      
      newMessageElement.className = 'message sender-message'; 
      newMessageElement.textContent = newMessageText;
      
      messageArea.appendChild(newMessageElement);
      messageArea.appendChild(document.createElement('div'));
      //messageInput.innerHTML  = ''; // Clear the input field
      // Optionally, scroll to the bottom of the chat
      messageArea.scrollTop = messageArea.scrollHeight;

      //socket.emit('chat message', { text: newMessage, sender: username });
      //setNewMessage('');
      
    }

  };


  const setIncomingMessage = (msg: Message) => {
    console.log('setIncomingMessage called');
    
    //if (username) {
      console.log('Sending message:', msg);  //newMessage
      console.log('from:', username);
      const messageArea = document.getElementById('message-container') as HTMLDivElement;
      
      //const newMessageElement = document.createElement('div') as HTMLDivElement;
      const newMessageElement: HTMLDivElement = document.createElement('div');
      const newMessageText = msg.text ? msg.text : '';
      
      newMessageElement.className = 'message sender-message'; 
      newMessageElement.textContent = msg.text;
      
      messageArea.appendChild(newMessageElement);

      // Optionally, scroll to the bottom of the chat
      messageArea.scrollTop = messageArea.scrollHeight;

    //}
  };


  return (
    <div className="chat-container">
      {!username ? (
        <div className="login-screen">
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') document.getElementById('usernameBtn')?.click() }}
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
        <div className="message sender-message">

            Hello there!
        </div>
        <div className="message receiver-message">

            Hi! How can I help you today?
        </div>
        <div className="message sender-message">

            I have a question about your products.
        </div>
        <div className="message receiver-message">

            Sure, feel free to ask!
        </div>
    </div>

    <div className="message" >
        <input type="text" 
                      id="message-input"
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={e => setNewMessage(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') sendMessage() }}
                      ></input>
        <button onClick={sendMessage} id="send-button">Send</button>
      </div>
    </div>


          <div className="input-area">
            <input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
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
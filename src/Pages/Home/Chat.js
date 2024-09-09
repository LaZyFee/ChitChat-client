import React, { useState, useEffect, useRef } from 'react';
import { FaPhoneAlt, FaVideo, FaEllipsisV, FaSmile, FaPaperclip, FaPaperPlane } from 'react-icons/fa';
import { io } from 'socket.io-client';
import convertBufferToBase64 from '../../Utils/convertBufferToBase64';

const ENDPOINT = 'http://localhost:5000';
let typingTimeout;

const Chat = ({ selectedUser }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [userStatus, setUserStatus] = useState(selectedUser?.active || false); // Default to false
  const [isTyping, setIsTyping] = useState(false);
  const [typingMessage, setTypingMessage] = useState('');
  const socket = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!selectedUser) return;

    socket.current = io(ENDPOINT);
    socket.current.emit('setup', { _id: localStorage.getItem('userId') });

    socket.current.on('connected', () => {
      console.log('Socket connected');
    });

    socket.current.on('message received', (newMessage) => {
      console.log('Message received:', newMessage);
      if (newMessage.chat._id === selectedUser._id) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    });

    socket.current.on('typing', (typingUser) => {
      if (typingUser._id === selectedUser._id) {
        setTypingMessage(`${typingUser.name} is typing...`);
      }
    });

    socket.current.on('stop typing', () => {
      setTypingMessage('');
    });

    socket.current.on('user online', ({ userId, online }) => {
      if (selectedUser && selectedUser._id === userId) {
        setUserStatus(online);
      }
    });

    socket.current.on('user offline', ({ userId, online }) => {
      if (selectedUser && selectedUser._id === userId) {
        setUserStatus(online);
      }
    });

    return () => {
      socket.current.off('message received');
      socket.current.off('typing');
      socket.current.off('stop typing');
      socket.current.off('user online');
      socket.current.off('user offline');
      socket.current.disconnect();
    };
  }, [selectedUser]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser) {
        setMessages([]);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const messageResponse = await fetch('http://localhost:5000/messages/all', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (messageResponse.ok) {
          const allMessages = await messageResponse.json();
          const filteredMessages = allMessages.filter(
            (msg) => msg.sender._id === selectedUser._id || msg.receiver._id === selectedUser._id
          );
          setMessages(filteredMessages);
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        } else {
          console.error('Error fetching messages:', messageResponse.statusText);
          setMessages([]);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
        setMessages([]);
      }
    };

    if (selectedUser) {
      fetchMessages();
    }
  }, [selectedUser, messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const typingTimeoutRef = useRef(null);

  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      socket.current.emit('typing', { _id: localStorage.getItem('userId'), chatId: selectedUser._id });
    }

    clearTimeout(typingTimeoutRef.current);  // Clear the existing timeout
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socket.current.emit('stop typing', { _id: localStorage.getItem('userId'), chatId: selectedUser._id });
    }, 3000);
  };

  const sendMessage = async () => {
    if (!message.trim() || !selectedUser?._id) return;

    clearTimeout(typingTimeout);
    setIsTyping(false);
    socket.current.emit('stop typing', { _id: localStorage.getItem('userId'), chatId: selectedUser._id });

    try {
      const response = await fetch('http://localhost:5000/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          content: message,
          chatId: selectedUser._id,
          receiverId: selectedUser._id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages((prevMessages) => [...prevMessages, data]);
        setMessage('');
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

        socket.current.emit('new message', {
          chat: {
            _id: selectedUser._id,
            users: [selectedUser._id],
          },
          sender: {
            _id: localStorage.getItem('userId'),
          },
          content: message,
        });
      } else {
        console.error('Error sending message:', await response.text());
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    } else {
      handleTyping();
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      {selectedUser ? (
        <>
          {/* Header */}
          <div className="flex items-center justify-between p-4 text-white shadow-sm">
            <div className="flex items-center">
              <img
                src={selectedUser?.profilePicture?.data
                  ? `data:${selectedUser.profilePicture.contentType};base64,${convertBufferToBase64(selectedUser.profilePicture.data)}`
                  : '/default-avatar.png'}
                alt={`${selectedUser.name} profile`}
                className="w-10 h-10 rounded-full mr-4"
              />

              <div>
                <h2 className="text-lg font-bold">{selectedUser.name}</h2>
                <p className={`font-semibold ${userStatus ? 'text-green-500' : 'text-red-500'}`}>
                  {typingMessage ? typingMessage : (userStatus ? 'Active' : 'Offline')}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full hover:bg-gray-700">
                <FaPhoneAlt />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-700">
                <FaVideo />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-700">
                <FaEllipsisV />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-auto">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-20">No conversation yet!! Please start conversation</div>
            ) : (
              messages.map((msg, index) => (
                <div key={index} className={`my-2 text-white ${msg.sender._id === selectedUser._id ? 'text-left' : 'text-right'}`}>
                  <p className={`inline-block p-2 rounded-xl ${msg.sender._id === selectedUser._id ? 'bg-blue-400' : 'bg-green-400'}`}>
                    {msg.content}
                  </p>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Typing Indicator */}
          {typingMessage && (
            <div className="px-4 py-2 text-sm text-gray-500">
              {typingMessage}
            </div>
          )}

          {/* Message Input */}
          <div className="p-4 flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-gray-700">
              <FaSmile />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-700">
              <FaPaperclip />
            </button>
            <input
              type="text"
              placeholder="Type a message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 p-2 rounded-full bg-gray-700 text-white"
            />
            <button className="p-2 rounded-full hover:bg-gray-700" onClick={sendMessage}>
              <FaPaperPlane />
            </button>
          </div>
        </>
      ) : (
        <div className="flex-1 text-center text-gray-500 mt-20">
          Select a conversation
        </div>
      )}
    </div>
  );
};

export default Chat;
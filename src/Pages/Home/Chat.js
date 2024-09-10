import React, { useState, useEffect, useRef } from 'react';
import { FaPhoneAlt, FaVideo, FaEllipsisV, FaSmile, FaPaperclip, FaPaperPlane } from 'react-icons/fa';
import convertBufferToBase64 from '../../Utils/convertBufferToBase64';

const Chat = ({ selectedUser }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser) {
        setMessages([]);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/messages/all', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const allMessages = await response.json();
          const filteredMessages = allMessages.filter(
            (msg) => msg.sender._id === selectedUser._id || msg.receiver._id === selectedUser._id
          );
          setMessages(filteredMessages);
        } else {
          console.error('Error fetching messages:', response.statusText);
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
  }, [selectedUser]);

  const sendMessage = async () => {
    if (!message.trim() || !selectedUser?._id) return;

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
      } else {
        const errorText = await response.text();
        console.error('Error sending message:', errorText);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
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
                src={selectedUser.profilePicture?.data
                  ? `data:${selectedUser.profilePicture.contentType};base64,${convertBufferToBase64(selectedUser.profilePicture.data)}`
                  : '/default-avatar.png'}
                alt={`${selectedUser.name} profile`}
                className="w-10 h-10 rounded-full mr-4"
              />
              <div>
                <h2 className="text-lg font-bold">{selectedUser.name}</h2>
                <p className={`font-semibold ${selectedUser.active ? 'text-green-500' : 'text-red-500'}`}>
                  {selectedUser.active ? 'Online' : 'Offline'}
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
          <div className="flex-1 p-6 overflow-y-auto">
            {messages.length > 0 ? (
              messages.map((msg, index) => (
                <div key={index} className={`my-2 text-white ${msg.sender._id === selectedUser._id ? 'text-left' : 'text-right'}`}>
                  <p className={`inline-block p-2 rounded-xl ${msg.sender._id === selectedUser._id ? 'bg-blue-400 self-end' : 'bg-green-400 self-start'}`}
                    style={{ maxWidth: '50%', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                    {msg.content}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center my-5">No messages yet. Start the conversation!</p>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-gray-700">
              <FaSmile />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-700">
              <FaPaperclip />
            </button>
            <textarea
              placeholder="Type a message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 p-2 rounded-xl bg-gray-700 text-white resize-none"
              rows={2}
              style={{ whiteSpace: 'pre-wrap' }}
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

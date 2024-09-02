import React, { useState, useEffect } from 'react';
import { FaPhoneAlt, FaVideo, FaEllipsisV, FaSmile, FaPaperclip, FaPaperPlane } from 'react-icons/fa';

const Chat = ({ selectedUser }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser) return;

      console.log('Fetching messages for:', selectedUser._id);

      try {
        const response = await fetch(`http://localhost:5000/conversations/${selectedUser._id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Fetched messages:', data);
          setMessages(data.messages || []);
        } else {
          console.error('Error fetching messages:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [selectedUser]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      const response = await fetch('http://localhost:5000/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: message, chatId: selectedUser._id }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages((prevMessages) => [...prevMessages, data]);
        setMessage('');
      } else {
        console.error('Error sending message:', response.statusText);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      {selectedUser ? (
        <>
          <div className="flex items-center justify-between p-4 text-white shadow-sm">
            <div className="flex items-center">
              <img
                src={selectedUser.profilePicture}
                alt={`${selectedUser.name} profile`}
                className="w-10 h-10 rounded-full mr-4"
              />
              <div>
                <h2 className="text-lg font-bold">{selectedUser.name}</h2>
                <p className={`font-semibold ${selectedUser.active ? 'text-green-500' : 'text-red-500'}`}>
                  {selectedUser.active ? 'Active' : 'Offline'}
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

          <div className="flex-1 p-6 overflow-y-auto">
            {messages.length > 0 ? (
              messages.map((msg, index) => (
                <div key={index}>
                  <p className="bg-blue-400 p-2 inline-block rounded-xl">{msg.content}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No messages yet. Start the conversation!</p>
            )}
          </div>

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

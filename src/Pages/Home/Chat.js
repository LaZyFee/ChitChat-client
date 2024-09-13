import React, { useState, useEffect, useRef } from 'react';
import { FaPhoneAlt, FaVideo, FaEllipsisV, FaSmile, FaPaperclip, FaPaperPlane, FaArrowLeft } from 'react-icons/fa';
import convertBufferToBase64 from '../../Utils/convertBufferToBase64';

const Chat = ({ selectedUser, setShowChatOnMobile }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null); // Ref for contentEditable div

  useEffect(() => {
    console.log("Chat component: Selected user:", selectedUser);
  }, [selectedUser]);

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
            Authorization: `Bearer ${token}`,
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
          Authorization: `Bearer ${localStorage.getItem('token')}`,
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
        inputRef.current.innerText = ''; // Clear contentEditable div
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
      if (e.shiftKey) {
        e.preventDefault();
        setMessage((prevMessage) => prevMessage + '\n');
      } else {
        e.preventDefault();
        sendMessage();
      }
    }
  };

  return (
    <div className="flex flex-col w-screen h-screen overflow-y-auto">
      {selectedUser ? (
        <>
          {/* Header */}
          <div className="flex items-center justify-between p-4 text-white shadow-sm mt-7 lg:mt-0">
            <button className="lg:hidden p-2 rounded-full hover:bg-gray-700" onClick={() => setShowChatOnMobile(false)}>
              <FaArrowLeft />
            </button>
            <div className="flex items-center">
              <img
                src={
                  selectedUser.profilePicture?.data
                    ? `data:${selectedUser.profilePicture.contentType};base64,${convertBufferToBase64(
                      selectedUser.profilePicture.data
                    )}`
                    : '/default-avatar.png'
                }
                alt={`${selectedUser.name} profile`}
                className="w-10 h-10 rounded-full mr-4"
              />
              <div>
                <h2 className="text-lg font-bold">
                  <span className="hidden md:inline">{selectedUser.name}</span>
                  <span className="inline md:hidden">
                    {selectedUser.name.split(' ').length > 1
                      ? `${selectedUser.name.split(' ')[0]} ${selectedUser.name.split(' ').slice(-1)}`
                      : selectedUser.name}
                  </span>
                </h2>
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
                <div key={index} className={`flex ${msg.sender._id === selectedUser._id ? 'justify-start' : 'justify-end'} my-2 text-white`}>
                  <p className={`inline-block p-2 rounded-xl ${msg.sender._id === selectedUser._id ? 'bg-blue-400' : 'bg-green-400'}`}
                    style={{ maxWidth: '90%', wordWrap: 'break-word', overflowWrap: 'break-word', whiteSpace: 'pre-wrap' }}>
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
          <div className="p-4 flex items-center space-x-4 w-full max-w-4xl mx-auto">
            <div className="relative flex items-center rounded-xl p-2 w-full">
              <button className="absolute left-2 p-2 rounded-full hover:bg-gray-600 text-white">
                <FaSmile />
              </button>
              <div
                ref={inputRef}
                className="flex-1 mx-12 p-2 text-white bg-transparent resize-none outline-none w-full max-w-full"
                contentEditable
                suppressContentEditableWarning={true} // Suppress the warning
                onInput={(e) => setMessage(e.target.innerText)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                style={{ whiteSpace: 'pre-wrap' }}
              >
                {!isFocused && !message && (
                  <div className="absolute top-2 left-12 text-gray-400 pointer-events-none">
                    Type a message...
                  </div>
                )}
              </div>
              <button className="absolute right-2 p-2 rounded-full hover:bg-gray-600 text-white">
                <FaPaperclip />
              </button>
            </div>

            <button className="p-2 rounded-full hover:bg-gray-700" onClick={sendMessage}>
              <FaPaperPlane />
            </button>
          </div>
        </>
      ) : (
        <div className="flex-1 text-center text-gray-500 mt-20">Select a conversation</div>
      )}
    </div>
  );
};

export default Chat;

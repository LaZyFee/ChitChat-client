import React, { useState, useEffect, useRef } from 'react';
import { FaPhoneAlt, FaVideo, FaEllipsisV, FaSmile, FaPaperclip, FaPaperPlane, FaArrowLeft } from 'react-icons/fa';
import { SlOptionsVertical } from "react-icons/sl";
import convertBufferToBase64 from '../../Utils/convertBufferToBase64';
import EmojiPicker from 'emoji-picker-react';

const Chat = ({ selectedUser, setShowChatOnMobile }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [attachments, setAttachments] = useState([]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [menuVisible, setMenuVisible] = useState(null); // to track which message has an open menu
  const menuRef = useRef(null); // Ref for context menu
  const buttonRef = useRef(null); // Ref for the options button

  const toggleMenu = (index) => {
    // If the menu for the current message is already visible, close it
    if (menuVisible === index) {
      setMenuVisible(null); // Close the menu if it's already open
    } else {
      setMenuVisible(index); // Open the menu for the clicked message
    }
  };
  const closeMenu = () => {
    setMenuVisible(null);
  };

  // useEffect to handle clicks outside of the context menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      // If the click is outside the menu or the button, close the menu
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuRef, buttonRef]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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
          scrollToBottom();
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

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
        inputRef.current.innerText = '';
        scrollToBottom();
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

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    const formData = new FormData();

    files.forEach((file) => {
      formData.append('attachments', file);
    });

    try {
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const { fileUrls } = await response.json();
        setAttachments((prev) => [...prev, ...fileUrls]);
        setMessage((prevMessage) => `${prevMessage} ${fileUrls.join(' ')}`);
        setShowAttachmentOptions(false);
      } else {
        console.error('Error uploading files:', response.statusText);
      }
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };

  const handleEmojiClick = (emojiObject) => {
    const emoji = emojiObject.emoji;
    const input = inputRef.current;

    if (input) {
      const selection = window.getSelection();
      const range = selection.getRangeAt(0);

      const textNode = document.createTextNode(emoji);
      range.deleteContents();
      range.insertNode(textNode);

      range.setStartAfter(textNode);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);

      setMessage(input.innerText);
      setShowEmojiPicker(false);
    }
  };

  return (
    <div className="flex flex-col w-screen h-screen">
      {selectedUser ? (
        <>
          <div className="flex items-center justify-between p-4 text-white shadow-sm">
            <button
              className="lg:hidden p-2 rounded-full hover:bg-gray-700"
              onClick={() => setShowChatOnMobile(null)}
            >
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

          <div className="flex-1 p-6 overflow-y-auto">
            {messages.length > 0 ? (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.sender._id === selectedUser._id ? 'justify-start' : 'justify-end'} my-2`}
                >
                  <div style={{ position: 'relative', maxWidth: '70%' }}>
                    {/* Message Content */}
                    <p
                      className={`inline-block p-2 rounded-xl ${msg.sender._id === selectedUser._id ? 'bg-blue-400' : 'bg-green-400'}`}
                      style={{
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word',
                        whiteSpace: 'pre-wrap',
                        maxWidth: '100%',
                      }}
                    >
                      {msg.content}
                    </p>

                    {/* Options Button */}
                    <button
                      ref={buttonRef}
                      onClick={() => toggleMenu(index)} // Open menu on click
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: msg.sender._id !== selectedUser._id ? '-30px' : 'auto', // Left for sent messages
                        right: msg.sender._id === selectedUser._id ? '-30px' : 'auto', // Right for received messages
                        transform: 'translateY(-50%)',
                        zIndex: 10,
                      }}
                    >
                      <SlOptionsVertical />
                    </button>

                    {/* Context Menu */}
                    {menuVisible === index && (
                      <div
                        ref={menuRef} // Add ref for detecting outside clicks
                        className="absolute z-20 bg-gray-800 text-white rounded-lg shadow-md p-2"
                        style={{
                          top: '-100%', // Always show the menu at the top of the message
                          left: msg.sender._id !== selectedUser._id ? '-120px' : 'auto',
                          right: msg.sender._id === selectedUser._id ? '-120px' : 'auto',
                        }}
                      >
                        <ul>
                          <li className="p-2 hover:bg-gray-700 cursor-pointer" onClick={closeMenu}>Reply</li>
                          <li className="p-2 hover:bg-gray-700 cursor-pointer" onClick={closeMenu}>Copy</li>
                          <li className="p-2 hover:bg-gray-700 cursor-pointer" onClick={closeMenu}>Forward</li>
                          <li className="p-2 hover:bg-gray-700 cursor-pointer" onClick={closeMenu}>Delete</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center my-5">No messages yet. Start the conversation!</p>
            )}
            <div ref={messagesEndRef} />
          </div>


          <div className="p-4 flex items-center space-x-4 w-full max-w-4xl mx-auto">
            <div className="relative flex items-center rounded-xl p-2 w-full">
              <button
                className="absolute left-2 p-2 rounded-full hover:bg-gray-600 text-white"
                onClick={() => setShowEmojiPicker((prev) => !prev)}
              >
                <FaSmile />
              </button>

              {showEmojiPicker && (
                <div className="absolute bottom-12 left-0">
                  <EmojiPicker onEmojiClick={handleEmojiClick} />
                </div>
              )}

              <div
                ref={inputRef}
                className="flex-1 mx-12 p-2 text-white bg-transparent resize-none outline-none w-full max-w-full"
                contentEditable
                suppressContentEditableWarning={true}
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

              <button
                className="absolute right-2 p-2 rounded-full hover:bg-gray-600 text-white"
                onClick={() => setShowAttachmentOptions((prev) => !prev)}
              >
                <FaPaperclip />
              </button>

              {showAttachmentOptions && (
                <div className="absolute bottom-12 right-0 bg-gray-800 p-2 rounded-md">
                  <label className="block p-2 text-sm hover:bg-gray-600 rounded-md cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      multiple
                      onChange={handleFileChange}
                    />
                    Attach Images
                  </label>
                  <label className="block p-2 text-sm hover:bg-gray-600 rounded-md cursor-pointer">
                    <input
                      type="file"
                      accept="audio/*"
                      className="hidden"
                      multiple
                      onChange={handleFileChange}
                    />
                    Attach Audio
                  </label>
                  <label className="block p-2 text-sm hover:bg-gray-600 rounded-md cursor-pointer">
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      multiple
                      onChange={handleFileChange}
                    />
                    Attach Videos
                  </label>
                </div>
              )}
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

import React from 'react';
import { FaPhoneAlt, FaVideo, FaEllipsisV, FaSmile, FaPaperclip, FaPaperPlane } from 'react-icons/fa';

const Chat = ({ selectedUser }) => {
  return (
    <div className="flex flex-col h-full w-full">
      {selectedUser ? (
        <>
          {/* Navbar */}
          <div className="flex items-center justify-between p-4 text-white shadow-sm">
            <div className="flex items-center">
              <img
                src={selectedUser.avatar}
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
            {/* Icons for calling, video, and more options */}
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

          {/* Chat Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div>
              <p className="bg-blue-400 p-2 inline-block rounded-xl">{selectedUser.message}</p>
              {/* Render more detailed messages here */}
            </div>
          </div>

          {/* Chat Input Area */}
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
              className="flex-1 p-2 rounded-full bg-gray-700 text-white"
            />
            <button className="p-2 rounded-full hover:bg-gray-700">
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

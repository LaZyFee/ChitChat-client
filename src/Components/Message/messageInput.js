import React, { useState } from 'react';

const MessageInput = ({ chatId }) => {
    const [message, setMessage] = useState('');
    const token = localStorage.getItem('token');

    const handleSendMessage = async () => {
        if (!message || !chatId) return;

        try {
            const response = await fetch('http://localhost:5000/messages', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content: message, chatId })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to send message');
            }

            setMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div className="p-4 border-t border-gray-700">
            <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="w-full p-2 border rounded-md"
            />
            <button onClick={handleSendMessage} className="mt-2 bg-blue-500 text-white p-2 rounded-md">Send</button>
        </div>
    );
};

export default MessageInput;

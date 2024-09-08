import React, { useEffect, useState } from 'react';
import moment from 'moment';
import convertBufferToBase64 from '../../Utils/convertBufferToBase64';

const Users = ({ selectedUser, setSelectedUser }) => {
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const fetchUsersAndMessages = async () => {
            try {
                const token = localStorage.getItem('token');

                // Fetch users
                const userResponse = await fetch('http://localhost:5000/users', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!userResponse.ok) {
                    throw new Error(`Error fetching users: ${userResponse.statusText}`);
                }
                const userData = await userResponse.json();

                if (!Array.isArray(userData)) {
                    console.error('Expected an array but got:', userData);
                    setUsers([]);
                    return;
                }

                // Fetch all messages
                const messageResponse = await fetch('http://localhost:5000/messages/all', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!messageResponse.ok) {
                    throw new Error(`Error fetching messages: ${messageResponse.statusText}`);
                }
                const messageData = await messageResponse.json();

                if (Array.isArray(messageData)) {
                    setMessages(messageData);

                    // Extract unique receiver object
                    const uniqueReceiverObj = messageData.reduce((acc, message) => {
                        if (message.receiver && message.receiver._id) {
                            acc[message.receiver._id] = message.receiver;
                        }
                        return acc;
                    }, {});

                    // Compare uniqueReceiverObj with userData
                    const filteredUsers = userData.filter(user => uniqueReceiverObj[user._id]);

                    // Set the filtered users
                    setUsers(filteredUsers);

                    // // Logging the unique receiver object and filtered users
                    // console.log("Unique Receiver Object:", uniqueReceiverObj);
                    // console.log("Filtered Users:", filteredUsers);
                } else {
                    console.error('Expected an array but got:', messageData);
                }

            } catch (error) {
                console.error('Error fetching users or messages:', error);
            }
        };

        fetchUsersAndMessages();
    }, []);


    const getLatestMessage = (userId) => {
        // Filter messages where user is either the sender or receiver
        const userMessages = messages.filter(message =>
            (message.sender && message.sender._id === userId) ||
            (message.receiver && message.receiver._id === userId)
        );
        return userMessages.length ? userMessages[userMessages.length - 1] : null;
    };

    return (
        <div className="lg:w-1/3 p-2">
            <ul>
                {users.map((user) => {
                    const latestMessage = getLatestMessage(user._id);
                    return (
                        <li
                            key={user._id || user.id || `${user.name}-${user.createdAt}`} // Fallback key
                            className={`flex items-center space-x-4 p-2 cursor-pointer hover:bg-gray-700 rounded-md ${selectedUser?._id === user._id ? 'bg-gray-700' : ''}`}
                            onClick={() => setSelectedUser(user)}
                        >
                            <img
                                src={user.profilePicture?.data
                                    ? `data:${user.profilePicture.contentType};base64,${convertBufferToBase64(user.profilePicture.data)}`
                                    : '/default-avatar.png'}
                                alt="avatar"
                                className="w-12 h-12 rounded-full"
                            />
                            <div>
                                <p className={`font-semibold ${user.active ? 'text-green-500' : 'text-red-500'}`}>
                                    {user.name}
                                </p>
                                <p className="text-sm text-gray-400">{latestMessage ? latestMessage.content : 'No messages yet'}</p>
                                <p className="text-xs text-blue-500 text-end">{latestMessage ? moment(latestMessage.createdAt).fromNow() : ''}</p>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default Users;

import React, { useEffect, useState, useCallback } from 'react';
import moment from 'moment';
import convertBufferToBase64 from '../../Utils/convertBufferToBase64';

const Users = ({ selectedUser, setSelectedUser }) => {
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const loggedInUserId = JSON.parse(localStorage.getItem('user'))?._id;

    // Memoized function to get the latest message for a user
    const getLatestMessage = useCallback(
        (userId) => {
            const userMessages = messages.filter(message =>
                (message.sender && message.receiver) && (
                    (message.sender._id === userId && message.receiver._id === loggedInUserId) ||
                    (message.sender._id === loggedInUserId && message.receiver._id === userId)
                )
            );

            return userMessages.length ? userMessages[userMessages.length - 1] : null;
        },
        [messages, loggedInUserId] // Dependency array includes messages and loggedInUserId
    );

    // Memoized function to get the latest message timestamp
    const getLatestMessageTimestamp = useCallback(
        (userId) => {
            const latestMessage = getLatestMessage(userId);
            return latestMessage ? new Date(latestMessage.createdAt).getTime() : 0;
        },
        [getLatestMessage] // Depend on getLatestMessage
    );

    // Function to sort users by the latest message timestamp
    const sortUsersByLatestMessage = (users) => {
        return [...users].sort((a, b) => b.latestTimestamp - a.latestTimestamp);
    };

    useEffect(() => {
        const fetchUsersAndMessages = async () => {
            try {
                const token = localStorage.getItem('token');

                if (!loggedInUserId) {
                    console.error('Logged-in user ID is undefined.');
                    return;
                }

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

                    // Extract users from messages where the logged-in user is either the sender or receiver
                    const uniqueUserObj = {};

                    messageData.forEach(message => {
                        const { sender, receiver } = message;

                        // Check if the logged-in user is the sender or receiver, and add the other party
                        if (sender && sender._id === loggedInUserId) {
                            uniqueUserObj[receiver._id] = receiver;
                        } else if (receiver && receiver._id === loggedInUserId) {
                            uniqueUserObj[sender._id] = sender;
                        }
                    });

                    // Compare uniqueUserObj with userData
                    const filteredUsers = userData.filter(user => uniqueUserObj[user._id]);

                    // Attach latest message timestamp to each user
                    const usersWithTimestamp = filteredUsers.map(user => {
                        const latestTimestamp = getLatestMessageTimestamp(user._id);
                        return { ...user, latestTimestamp };
                    });

                    // Set the users, sorting based on latest timestamp
                    setUsers(sortUsersByLatestMessage(usersWithTimestamp));
                } else {
                    console.error('Expected an array but got:', messageData);
                }

            } catch (error) {
                console.error('Error fetching users or messages:', error);
            }
        };

        fetchUsersAndMessages();
    }, [getLatestMessageTimestamp, loggedInUserId, selectedUser]);

    return (
        <div className="lg:w-1/3 p-2">
            <ul>
                {users.map((user) => {
                    const latestMessage = getLatestMessage(user._id);
                    return (
                        <li
                            key={user._id}
                            className={`flex items-center space-x-4 p-2 cursor-pointer hover:bg-gray-700 rounded-md ${selectedUser?._id === user._id ? 'bg-gray-700' : ''}`}
                            onClick={() => setSelectedUser(user)}
                        >
                            <img
                                src={user.profilePicture?.data
                                    ? `data:${user.profilePicture.contentType};base64,${convertBufferToBase64(user.profilePicture.data)}`
                                    : '/default-avatar.png'}
                                alt="avatar"
                                className="w-14 h-16 rounded-badge"
                            />
                            <div className="flex-1 ">
                                <p className="font-semibold text-green-500 my-1" >
                                    {user.name}
                                </p>
                                <p className="text-sm text-gray-400">
                                    {latestMessage ?
                                        (latestMessage.content.split(' ').length > 5
                                            ? latestMessage.content.split(' ').slice(0, 5).join(' ') + '...'
                                            : latestMessage.content)
                                        : 'No messages yet'}
                                </p>

                                <p className="text-xs text-blue-500 text-end">
                                    {latestMessage ? moment(latestMessage.createdAt).fromNow() : ''}
                                </p>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default Users;

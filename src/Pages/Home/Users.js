import React, { useEffect, useState } from 'react';
import moment from 'moment';

const fetchUsers = async (token) => {
    const response = await fetch('http://localhost:5000/users', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch users');
    }

    return response.json();
};

const fetchChats = async (token) => {
    const response = await fetch('http://localhost:5000/chat', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch chats');
    }

    return response.json();
};

const Users = ({ selectedUser, setSelectedUser }) => {
    console.log('Users selectedUser:', selectedUser);
    const [users, setUsers] = useState([]);
    const [chats, setChats] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const fetchAndSetData = async () => {
            try {
                const userList = await fetchUsers(token);
                const chatList = await fetchChats(token);

                const chatUsers = chatList.flatMap(chat => chat.users.map(user => user._id));
                const filteredUsers = userList.filter(user => chatUsers.includes(user._id));

                setUsers(filteredUsers);
                setChats(chatList);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchAndSetData();
    }, []);

    const handleSelectUser = (user) => {
        setSelectedUser(user);
    };

    return (
        <div className="w-1/3 p-4">
            <ul>
                {users.map((user) => (
                    <li
                        key={user._id}
                        className={`flex items-center space-x-4 p-2 cursor-pointer hover:bg-gray-700 rounded-md ${selectedUser?._id === user._id ? 'bg-gray-700' : ''}`}
                        onClick={() => handleSelectUser(user)}
                    >
                        <img src={user.avatar} alt="avatar" className="w-12 h-12 rounded-full" />
                        <div>
                            <p className={`font-semibold ${user.active ? 'text-green-500' : 'text-red-500'}`}>
                                {user.name}
                            </p>
                            <p className="text-sm text-gray-400">{user.message}</p>
                            <p className="text-xs text-blue-500 text-end">{moment(user.timestamp).fromNow()}</p>
                        </div>
                    </li>
                ))}
            </ul>
            <div className="mt-4">
                <h3 className="text-lg font-semibold">Chats</h3>
                <ul>
                    {chats.map((chat) => (
                        <li key={chat._id} className="p-2 border-b">
                            <p className="font-semibold">{chat.chatName}</p>
                            <p className="text-sm text-gray-500">{chat.latestMessage ? chat.latestMessage.content : 'No messages yet'}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Users;

import React, { useEffect, useState } from 'react';
import moment from 'moment';
import convertBufferToBase64 from '../../Utils/convertBufferToBase64';

const Users = ({ selectedUser, setSelectedUser }) => {

    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:5000/users', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const data = await response.json();
                if (Array.isArray(data)) {
                    setUsers(data);
                } else {
                    console.error('Expected an array but got:', data);
                    setUsers([]);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className="lg:w-1/3 p-2">
            <ul>
                {users.map((user) => (
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
                            <p className="text-sm text-gray-400">{user.message}</p>
                            <p className="text-xs text-blue-500 text-end">{moment(user.createdAt).fromNow()}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Users;

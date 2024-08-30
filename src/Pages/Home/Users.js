import React from 'react';
import moment from 'moment';

const users = [
    { id: 1, name: 'Glen Brahimi', message: 'Mo nua jacket bday pain', avatar: 'link_to_avatar', active: true, timestamp: '2024-08-28T10:30:00Z' },
    { id: 2, name: 'Roland Dushku', message: 'Had you asked him to ...', avatar: 'link_to_avatar', active: false, timestamp: '2024-08-28T09:15:00Z' },
    { id: 3, name: 'Rabiul', message: 'Had you asked him to ...', avatar: 'link_to_avatar', active: false, timestamp: '2024-08-28T09:15:00Z' },
    { id: 4, name: 'Rafee', message: 'Had you asked him to ...', avatar: 'link_to_avatar', active: false, timestamp: '2024-08-28T09:15:00Z' },
    // Add more users...
];

const Users = ({ selectedUser, setSelectedUser }) => {
    return (
        <div className="w-1/3 p-4">
            <ul>
                {users.map((user) => (
                    <li
                        key={user.id}
                        className={`flex items-center space-x-4 p-2 cursor-pointer hover:bg-gray-700 rounded-md ${selectedUser?.id === user.id ? 'bg-gray-700' : ''}`}
                        onClick={() => setSelectedUser(user)}
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
        </div>
    );
};

export default Users;

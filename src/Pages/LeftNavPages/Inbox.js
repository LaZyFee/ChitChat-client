import React from 'react';
import Users from '../Home/Users';
import Chat from '../Home/Chat';

const Inbox = ({ selectedUser, setSelectedUser }) => {
    console.log('Inbox selectedUser:', selectedUser, 'setSelected user', setSelectedUser);

    return (
        <div className="flex h-screen text-white">
            <Users selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
            <Chat selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
        </div>
    );
};

export default Inbox;

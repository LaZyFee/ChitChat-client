import React, { useState } from 'react';
import Users from '../Home/Users';
import Chat from '../Home/Chat';

const Inbox = () => {
    const [selectedUser, setSelectedUser] = useState(null);

    return (
        <div className="flex h-screen text-white">
            <Users selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
            <Chat selectedUser={selectedUser} />
        </div>
    );
};

export default Inbox;
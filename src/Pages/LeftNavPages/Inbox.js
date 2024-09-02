import React, { useEffect } from 'react';
import Users from '../Home/Users';
import Chat from '../Home/Chat';

const Inbox = ({ selectedUser }) => {
    useEffect(() => {
        console.log('Inbox useEffect:', selectedUser);
    }, [selectedUser]);

    return (
        <div className="flex h-screen text-white">
            <Users selectedUser={selectedUser} />
            <Chat selectedUser={selectedUser} />
        </div>
    );
};

export default Inbox;
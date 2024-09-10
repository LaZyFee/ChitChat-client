import React, { useState } from 'react';
import Users from '../Home/Users';
import Chat from '../Home/Chat';

const Inbox = ({ selectedUser, setSelectedUser }) => {
    const [showChatOnMobile, setShowChatOnMobile] = useState(false); // State to control mobile view

    // Handle selection of a user (for mobile)
    const handleUserSelect = (user) => {
        setSelectedUser(user);
        setShowChatOnMobile(true); // Show chat in full screen when a user is selected
    };

    return (
        <div className="h-screen text-white">
            {/* Desktop/Tablet Layout - Users and Chat side by side */}
            <div className="hidden lg:flex h-full">
                <Users
                    selectedUser={selectedUser}
                    setSelectedUser={handleUserSelect}
                    setShowChatOnMobile={setShowChatOnMobile}  // Pass for Users
                />
                <Chat
                    selectedUser={selectedUser}
                    setSelectedUser={setSelectedUser}
                    setShowChatOnMobile={setShowChatOnMobile}  // Pass for Chat
                />
            </div>

            {/* Mobile Layout - Toggle between Users and Chat */}
            <div className="lg:hidden h-full">
                {showChatOnMobile && selectedUser ? (
                    // Show Chat full screen if a user is selected
                    <Chat
                        selectedUser={selectedUser}
                        setSelectedUser={setSelectedUser}
                        setShowChatOnMobile={setShowChatOnMobile}  // Pass for Chat
                    />
                ) : (
                    // Show Users full screen if no user is selected
                    <Users
                        selectedUser={selectedUser}
                        setSelectedUser={handleUserSelect}
                        setShowChatOnMobile={setShowChatOnMobile}  // Pass for Users
                    />
                )}
            </div>
        </div>
    );
};

export default Inbox;

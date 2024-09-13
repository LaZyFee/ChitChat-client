import React, { useState, useEffect } from 'react';
import Users from '../Home/Users';
import Chat from '../Home/Chat';
import Navbar from '../Shared/Navbar';

const Inbox = ({ selectedUser, setSelectedUser }) => {
    const [showChatOnMobile, setShowChatOnMobile] = useState(false); // State to control mobile view

    const handleUserSelect = (user) => {
        setSelectedUser(user);
        setShowChatOnMobile(true);
    };

    useEffect(() => {
        console.log("Updated showChatOnMobile:", showChatOnMobile);
    }, [showChatOnMobile]);



    return (
        <div className="h-screen text-white">
            {/* Navbar - Only hide on mobile when chat is shown */}
            <Navbar
                setSelectedUser={setSelectedUser}
                showNavbar={!showChatOnMobile || window.innerWidth >= 1024} // Show navbar on desktop or when chat is hidden
            />

            {/* Desktop/Tablet Layout - Users and Chat side by side */}
            <div className="hidden lg:flex h-full">
                <Users
                    selectedUser={selectedUser}
                    setSelectedUser={handleUserSelect}
                />
                <Chat
                    selectedUser={selectedUser}
                    setSelectedUser={setSelectedUser}
                />
            </div>

            {/* Mobile Layout - Toggle between Users and Chat */}
            <div className="lg:hidden h-full">
                {showChatOnMobile && selectedUser ? (
                    <Chat
                        selectedUser={selectedUser}
                        setSelectedUser={setSelectedUser}
                        setShowChatOnMobile={setShowChatOnMobile}
                    />
                ) : (
                    <Users
                        selectedUser={selectedUser}
                        setSelectedUser={handleUserSelect}
                        setShowChatOnMobile={setShowChatOnMobile}
                    />
                )}
            </div>
        </div>
    );
};

export default Inbox;

import React, { useState, useEffect } from 'react';
import debounce from 'lodash.debounce';
import Users from '../Home/Users';
import Chat from '../Home/Chat';

const Inbox = ({ selectedUser, setSelectedUser }) => {
    const [isMobile, setIsMobile] = useState(false);

    // Function to detect window size and set isMobile accordingly
    const handleResize = debounce(() => {
        setIsMobile(window.innerWidth <= 768); // Mobile if width is 768px or less
    }, 200); // Adjust debounce delay as needed

    useEffect(() => {
        handleResize(); // Set initial state
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="h-screen text-white">
            {/* Desktop View (Flex layout for larger screens) */}
            {!isMobile ? (
                <div className="flex h-full">
                    <Users selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
                    <Chat selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
                </div>
            ) : (
                // Mobile View
                <div className="h-full">
                    {!selectedUser ? (
                        // Show Users list when no user is selected
                        <Users selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
                    ) : (
                        // Show Chat when a user is selected
                        <Chat selectedUser={selectedUser} setSelectedUser={setSelectedUser} setShowChatOnMobile={setSelectedUser} />
                    )}
                </div>
            )}
        </div>
    );
};

export default Inbox;

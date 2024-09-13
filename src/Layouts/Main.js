import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../Pages/Shared/Navbar';
import Inbox from '../Pages/LeftNavPages/Inbox';
import LeftNav from '../Pages/Shared/LeftNav';

const Main = () => {
    const location = useLocation();
    const hideNavbar = location.pathname === '/login' || location.pathname === '/signup';

    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        // Add any side effects here related to selectedUser
    }, [selectedUser]);

    return (
        <div className='flex flex-col max-h-screen overflow-y-auto'>
            {/* Show Navbar unless on /login or /signup */}
            {!hideNavbar && <Navbar setSelectedUser={setSelectedUser} />}

            <div className='flex flex-1'>
                {/* Show LeftNav for all routes except /login and /signup */}
                {!hideNavbar && <LeftNav />}

                {/* Main content or Inbox component */}
                <div className='flex-1 overflow-y-auto'>
                    {location.pathname === '/' || location.pathname === '/messages' ? (
                        <Inbox selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
                    ) : (
                        <Outlet />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Main;
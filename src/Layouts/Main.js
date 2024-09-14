import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../Pages/Shared/Navbar';
import Inbox from '../Pages/LeftNavPages/Inbox';

const Main = () => {
    const location = useLocation();
    const hideNavbar = location.pathname === '/login' || location.pathname === '/signup';

    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        // Add any side effects here related to selectedUser
    }, [selectedUser]);

    return (
        <div className='max-h-screen'>
            {!hideNavbar && <Navbar />}

            {location.pathname === '/' || location.pathname === '/messages' ? (
                <Inbox selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
            ) : (
                <Outlet />
            )}
        </div>
    );
};

export default Main;

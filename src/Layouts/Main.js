import React, { useState, useContext } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../Pages/Shared/Navbar';
import Inbox from '../Pages/LeftNavPages/Inbox';
import { EffectContext } from '../App'; // Import the context

const Main = () => {
    const location = useLocation();
    const hideNavbar = location.pathname === '/login' || location.pathname === '/signup';
    const [selectedUser, setSelectedUser] = useState(null);

    // Access the context value (handleEffectChange)
    const { handleEffectChange } = useContext(EffectContext);

    return (
        <div className='min-h-screen'>
            {!hideNavbar && <Navbar onChangeTheme={handleEffectChange} />}
            {location.pathname === '/' || location.pathname === '/messages' ? (
                <Inbox selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
            ) : (
                <Outlet />
            )}
        </div>
    );
};

export default Main;

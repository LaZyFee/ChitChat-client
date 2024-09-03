import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../Pages/Shared/Navbar';
import Inbox from '../Pages/LeftNavPages/Inbox';
import Users from '../Pages/Home/Users';
import Chat from '../Pages/Home/Chat';


const Main = () => {
    const location = useLocation();
    const hideNavbar = location.pathname === '/login' || location.pathname === '/signup';
    const showInbox = location.pathname === '/';

    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        // console.log('Selected user from Main:', selectedUser);
    }, [selectedUser]);

    return (
        <div className='md:w-10/12 mx-auto my-5 card max-h-screen'>
            {!hideNavbar && <Navbar setSelectedUser={setSelectedUser} />}
            {/* {showInbox ? <Inbox selectedUser={selectedUser} setSelectedUser={setSelectedUser} /> : <Outlet />} */}
            <div className="flex h-screen">
                <Users selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
                <Chat selectedUser={selectedUser} />
            </div>
        </div>
    );
};

export default Main;

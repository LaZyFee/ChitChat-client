import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../Pages/Shared/Navbar';
import Inbox from '../Pages/LeftNavPages/Inbox'; // Assuming you have an Inbox component

const Main = () => {
    const location = useLocation();
    const hideNavbar = location.pathname === '/login' || location.pathname === '/signup';
    const showInbox = location.pathname === '/';

    return (
        <div className='md:w-10/12 mx-auto my-10'>
            {!hideNavbar && <Navbar />}
            {showInbox ? <Inbox /> : <Outlet />}
        </div>
    );
};

export default Main;

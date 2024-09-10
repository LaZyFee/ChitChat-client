import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../Pages/Shared/Navbar';
import Inbox from '../Pages/LeftNavPages/Inbox';
import LeftNav from '../Pages/Shared/LeftNav';

const Main = () => {
    const location = useLocation();
    const hideForLoginOrSignup = location.pathname === '/login' || location.pathname === '/signup';

    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        // Add any side effects here related to selectedUser
    }, [selectedUser]);

    return (
        <div className="h-screen flex relative">
            {/* LeftNav will be displayed except for login/signup routes */}
            {!hideForLoginOrSignup && (
                <div
                    className="absolute z-50 w-1/4 h-full mt-5 ml-5"
                    style={{ left: 0 }}
                >
                    <LeftNav setSelectedUser={setSelectedUser} />
                </div>
            )}

            {/* Main content area */}
            <div className="flex-1 w-full flex flex-col">
                {/* Show Navbar only for '/' or '/messages' */}
                {(location.pathname === '/' || location.pathname === '/messages') && !hideForLoginOrSignup && (
                    <Navbar setSelectedUser={setSelectedUser} />
                )}

                {/* Main section: Inbox or Outlet */}
                <div className="flex-grow">
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

import React, { useState } from 'react';
import LeftNav from './LeftNav';
import { HiMiniPlusSmall } from "react-icons/hi2";
import UserListModal from '../../Components/Modals/UserListModal';
import { fetchUsers } from '../../Services/userService';

const Navbar = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    const handleFetchUsers = async () => {
        try {
            console.log('Fetching users...');
            const token = localStorage.getItem('token');
            const userList = await fetchUsers(token);
            console.log('Users:', userList);
            setUsers(userList);
            document.getElementById('user_list_modal').showModal();
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const handleUserClick = (user) => {
        console.log('Selected user:', user);
        setSelectedUser(user);
        document.getElementById('user_list_modal').close(); // Close modal after selection
    };

    return (
        <div className="navbar px-4 py-2 flex justify-between items-center shadow-sm">
            <div className="flex items-center space-x-4">
                {/* Left Navigation with Menu Button */}
                <LeftNav />

                <div className="ml-12">
                    <input
                        type="text"
                        placeholder="Search contact, messages or options here."
                        className="input input-bordered w-full"
                    />
                </div>

                {/* Add Button */}
                <button className="text-pink-500" onClick={handleFetchUsers}>
                    <HiMiniPlusSmall className="text-3xl" />
                </button>
            </div>

            {/* Right Section with User Info */}
            <div className="flex items-center space-x-4">
                {user && (
                    <>
                        <div className="text-white">
                            <p className="font-semibold">{user.name}</p>
                            <p className="text-sm text-green-400">Online</p>
                        </div>
                        <div className="avatar">
                            <div className="w-10 rounded-full ring ring-white ring-offset-base-100 ring-offset-2">
                                <img src={user.profilePicture} alt="User Avatar" />
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Modal for displaying users */}
            <UserListModal
                users={users}
                onUserClick={handleUserClick}
            />
        </div>
    );
};

export default Navbar;

import React, { useState, useEffect } from 'react';
import LeftNav from './LeftNav';
import { HiMiniPlusSmall } from "react-icons/hi2";
import UserListModal from '../../Components/Modals/UserListModal';
import { fetchUsers } from '../../Services/userService';
import { toast } from 'react-hot-toast';

const Navbar = ({ setSelectedUser }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const [users, setUsers] = useState([]);

    // Fetch users when the component mounts
    useEffect(() => {
        const preFetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                const userList = await fetchUsers(token);
                setUsers(userList);
            } catch (error) {
                console.error("Error pre-fetching users:", error);
            }
        };

        preFetchUsers();
    }, []);

    const handleFetchUsers = async () => {
        try {
            document.getElementById('user_list_modal').showModal();
        } catch (error) {
            toast.error("Error displaying user list.", { id: 'fetching-users' });
            console.error("Error displaying user list:", error);
        }
    };

    const handleUserClick = (user) => {
        setSelectedUser(user);
        document.getElementById('user_list_modal').close(); // Close modal after selection
    };

    return (
        <div className="navbar px-4 py-2 flex justify-between items-center shadow-sm">
            <div className="flex items-center space-x-4">
                <LeftNav />
                <div className="ml-12">
                    <input
                        type="text"
                        placeholder="Search contact, messages or options here."
                        className="input input-bordered w-full"
                    />
                </div>
                <button className="text-pink-500" onClick={handleFetchUsers}>
                    <HiMiniPlusSmall className="text-3xl" />
                </button>
            </div>
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
            <UserListModal
                users={users}
                onUserClick={handleUserClick} // Pass handleUserClick here
            />
        </div>
    );
};

export default Navbar;

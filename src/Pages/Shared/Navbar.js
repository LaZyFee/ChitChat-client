import React, { useState, useEffect } from 'react';
import { HiMiniPlusSmall } from "react-icons/hi2";
import UserListModal from '../../Components/Modals/UserListModal';
import { fetchUsers } from '../../Services/userService';
import { toast } from 'react-hot-toast';

const Navbar = ({ setSelectedUser }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false); // Loading state

    // Fetch users when the component mounts
    useEffect(() => {
        const preFetchUsers = async () => {
            try {
                setIsLoading(true); // Show loading modal
                const token = localStorage.getItem('token');
                const userList = await fetchUsers(token);
                setUsers(userList);
            } catch (error) {
                console.error("Error pre-fetching users:", error);
            } finally {
                setIsLoading(false); // Hide loading modal
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
                        {/* Larger devices layout */}
                        <div className="hidden md:flex items-center space-x-4 text-white">
                            <div>
                                <p className="font-semibold">{user.name}</p>
                                <p className="text-sm text-green-400">Online</p>
                            </div>
                            <div className="w-10 h-10 rounded-full ring ring-white ring-offset-base-100 ring-offset-2 overflow-hidden">
                                <img src={user.profilePicture} alt="User Avatar" className="w-full h-full object-cover" />
                            </div>
                        </div>

                        {/* Mobile devices layout */}
                        <div className="md:hidden dropdown dropdown-end">
                            <div
                                tabIndex={0}
                                role="button"
                                className="btn btn-ghost btn-circle avatar w-10 h-10 rounded-full ring ring-white ring-offset-base-100 ring-offset-2 overflow-hidden"
                            >
                                <img src={user.profilePicture} alt="User Avatar" className="w-full h-full object-cover" />
                            </div>
                            <ul
                                tabIndex={0}
                                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
                            >
                                <li>
                                    <p className="font-semibold">{user.name}</p>
                                </li>
                                <li><p className="text-sm text-green-400">Online</p></li>
                            </ul>
                        </div>
                    </>
                )}
            </div>


            <UserListModal
                users={users}
                onUserClick={handleUserClick}
            />

            {/* Loading Modal */}
            {isLoading && (
                <dialog open className="modal">
                    <div className="modal-box flex justify-center items-center">
                        <span className="loading loading-spinner text-primary"></span>
                        <p className="ml-4">Loading users...</p>
                    </div>
                </dialog>
            )}
        </div>
    );
};

export default Navbar;

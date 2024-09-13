import React, { useState, useEffect } from 'react';
import { BsPersonAdd } from "react-icons/bs";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import UserListModal from '../../Components/Modals/UserListModal';
import CreateGroupModal from '../../Components/Modals/CreateGroupModal';
import { fetchUsers } from '../../Services/userService';
import { toast } from 'react-hot-toast';

const Navbar = ({ setSelectedUser, showNavbar }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);

    useEffect(() => {
        const preFetchUsers = async () => {
            try {
                setIsLoading(true);
                const token = localStorage.getItem('token');
                const userList = await fetchUsers(token);
                setUsers(userList);
            } catch (error) {
                console.error("Error pre-fetching users:", error);
            } finally {
                setIsLoading(false);
            }
        };

        preFetchUsers();
    }, []);

    const handleFetchUsers = () => {
        try {
            document.getElementById('user_list_modal').showModal();
        } catch (error) {
            toast.error("Error displaying user list.", { id: 'fetching-users' });
            console.error("Error displaying user list:", error);
        }
    };

    const handleCreateGroup = () => {
        setIsCreateGroupModalOpen(true);
    };

    const handleUserClick = (user) => {
        setSelectedUser(user);
        document.getElementById('user_list_modal').close(); // Close UserListModal
    };

    if (!showNavbar) return null;

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
                    <BsPersonAdd className="text-3xl" />
                </button>
                <button className="text-pink-500" onClick={handleCreateGroup}>
                    <AiOutlineUsergroupAdd className="text-3xl" />
                </button>
            </div>
            <div className="flex items-center space-x-4">
                {user && (
                    <div className="flex items-center space-x-4 text-white">
                        <div className="hidden md:block">
                            <p className="font-semibold">{user.name}</p>
                            <p className="text-sm text-green-400">Online</p>
                        </div>
                        <div className="w-10 h-10 rounded-full ring ring-white ring-offset-base-100 ring-offset-2 overflow-hidden hidden md:block">
                            <img src={user.profilePicture} alt="User Avatar" className="w-full h-full object-cover" />
                        </div>
                        <div className="md:hidden dropdown dropdown-end">
                            <div
                                tabIndex={0}
                                role="button"
                                className="btn btn-ghost btn-circle avatar w-10 h-10 rounded-full overflow-hidden"
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
                    </div>
                )}
            </div>
            <UserListModal
                users={users}
                onUserClick={handleUserClick}
            />

            {isCreateGroupModalOpen && (
                <CreateGroupModal
                    users={users}
                    onUserClick={handleUserClick}
                    onClose={() => setIsCreateGroupModalOpen(false)}
                />
            )}

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

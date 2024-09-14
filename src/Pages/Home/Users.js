import React, { useEffect, useState, useCallback } from 'react';
import moment from 'moment';
import convertBufferToBase64 from '../../Utils/convertBufferToBase64';
import { BsPersonAdd } from "react-icons/bs";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { LuListFilter } from "react-icons/lu";
import { fetchUsers } from '../../Services/userService';
import { toast } from 'react-hot-toast';
import UserListModal from '../../Components/Modals/UserListModal';
import CreateGroupModal from '../../Components/Modals/CreateGroupModal';
import FilterModal from '../../Components/Modals/FilterModal';

const Users = ({ selectedUser, setSelectedUser }) => {
    const [users, setUsers] = useState([]);
    const [userwithconvo, setUserwithconvo] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    const loggedInUserId = JSON.parse(localStorage.getItem('user'))?._id;

    // Toggle Filter Modal
    const toggleFilterModal = () => {
        setIsFilterModalOpen((prev) => !prev);
    };

    // Prefetch Users on Component Mount
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

    // Memoized function to get the latest message for a user
    const getLatestMessage = useCallback(
        (userId) => {
            const userMessages = messages.filter(message =>
                (message.sender && message.receiver) && (
                    (message.sender._id === userId && message.receiver._id === loggedInUserId) ||
                    (message.sender._id === loggedInUserId && message.receiver._id === userId)
                )
            );

            return userMessages.length ? userMessages[userMessages.length - 1] : null;
        },
        [messages, loggedInUserId] // Dependency array includes messages and loggedInUserId
    );

    // Memoized function to get the latest message timestamp
    const getLatestMessageTimestamp = useCallback(
        (userId) => {
            const latestMessage = getLatestMessage(userId);
            return latestMessage ? new Date(latestMessage.createdAt).getTime() : 0;
        },
        [getLatestMessage] // Depend on getLatestMessage
    );

    // Function to sort users by the latest message timestamp
    const sortUsersByLatestMessage = (users) => {
        return [...users].sort((a, b) => b.latestTimestamp - a.latestTimestamp);
    };

    // Fetch Messages and Associate with Users
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const token = localStorage.getItem('token');

                // Fetch all messages
                const messageResponse = await fetch('http://localhost:5000/messages/all', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!messageResponse.ok) {
                    throw new Error(`Error fetching messages: ${messageResponse.statusText}`);
                }
                const messageData = await messageResponse.json();
                setMessages(messageData);

                // Extract users with whom conversations exist
                const uniqueUserObj = {};

                messageData.forEach(message => {
                    const { sender, receiver } = message;
                    if (sender && sender._id === loggedInUserId) {
                        uniqueUserObj[receiver._id] = receiver;
                    } else if (receiver && receiver._id === loggedInUserId) {
                        uniqueUserObj[sender._id] = sender;
                    }
                });

                const filteredUsers = users.filter(user => uniqueUserObj[user._id]);

                const usersWithTimestamp = filteredUsers.map(user => {
                    const latestTimestamp = getLatestMessageTimestamp(user._id);
                    return { ...user, latestTimestamp };
                });

                setUserwithconvo(sortUsersByLatestMessage(usersWithTimestamp));
            } catch (error) {
                console.error('Error fetching users or messages:', error);
            }
        };

        fetchMessages();
    }, [getLatestMessageTimestamp, loggedInUserId, users]);


    // Handle Search Input Change
    const handleSearchChange = (e) => {
        const searchTerm = e.target.value.toLowerCase(); // Convert search term to lowercase
        setSearchTerm(searchTerm);

        if (searchTerm.trim() === '') {
            setFilteredUsers(users); // Reset to all users if the search term is empty
        } else {
            // Filter users based on name or email matching the search term
            const filtered = users.filter(user =>
                user.name.toLowerCase().includes(searchTerm) ||  // Match by name
                user.email.toLowerCase().includes(searchTerm)    // Match by email
            );
            setFilteredUsers(filtered);
        }
    };


    return (
        <div className="lg:w-1/3 p-2 h-screen w-screen">
            <div className="flex items-center space-x-4 shadow-xl my-5 justify-between">
                <h1 className="text-2xl font-bold">Chats</h1>
                <div className="flex items-center space-x-4">
                    <button className="text-pink-500" onClick={handleFetchUsers}>
                        <BsPersonAdd className="text-3xl" />
                    </button>
                    <button className="text-pink-500" onClick={handleCreateGroup}>
                        <AiOutlineUsergroupAdd className="text-3xl" />
                    </button>
                    <button className="text-pink-500" onClick={toggleFilterModal}>
                        <LuListFilter className="text-3xl" />
                    </button>
                </div>
            </div>
            <div className="my-5">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Search name, email, contact here...."
                    className="input input-bordered w-full"
                />
                {searchTerm && (
                    <ul className="absolute bg-gray-300 shadow-lg  z-10">
                        {filteredUsers.map(user => (
                            <li
                                key={user._id}
                                className="p-2 hover:bg-white hover:text-black cursor-pointer"
                                onClick={() => setSelectedUser(user)}
                            >
                                {user.name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <ul>
                {userwithconvo.map((user) => {
                    const latestMessage = getLatestMessage(user._id);
                    return (
                        <li
                            key={user._id}
                            className={`flex items-center space-x-4 p-2 cursor-pointer hover:bg-gray-700 rounded-md ${selectedUser?._id === user._id ? 'lg:bg-gray-700' : ''}`}
                            onClick={() => setSelectedUser(user)}
                        >
                            <img
                                src={
                                    user.profilePicture?.data
                                        ? `data:${user.profilePicture.contentType};base64,${convertBufferToBase64(user.profilePicture.data)}`
                                        : '/default-avatar.png' // Fallback to default avatar if there's no profile picture
                                }
                                alt={`${user.name}'s avatar`}
                                className="w-14 h-16 rounded-badge"
                            />

                            <div className="flex-1">
                                <p className="font-semibold text-green-500 my-1">{user.name}</p>
                                <p className="text-sm text-gray-400">
                                    {latestMessage
                                        ? latestMessage.content.split(' ').length > 5
                                            ? latestMessage.content.split(' ').slice(0, 5).join(' ') + '...'
                                            : latestMessage.content
                                        : 'No messages yet'}
                                </p>
                                <p className="text-xs text-blue-500 text-end">
                                    {latestMessage ? moment(latestMessage.createdAt).fromNow() : ''}
                                </p>
                            </div>
                        </li>
                    );
                })}
            </ul>
            <UserListModal users={users} onUserClick={handleUserClick} />

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
            {/* Conditionally render the FilterModal */}
            {isFilterModalOpen && <FilterModal onClose={toggleFilterModal} />}
        </div>
    );
};

export default Users;

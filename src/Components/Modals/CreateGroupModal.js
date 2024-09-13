import React, { useState } from 'react';
import { FcAddImage } from "react-icons/fc";
import convertBufferToBase64 from '../../Utils/convertBufferToBase64';
import { toast } from 'react-hot-toast';

const CreateGroupModal = ({ users, onClose }) => {
    const [groupName, setGroupName] = useState('');
    const [groupPhoto, setGroupPhoto] = useState(null);
    const [selectedUsers, setSelectedUsers] = useState([]);

    const handleGroupPhotoChange = (e) => {
        const file = e.target.files[0];
        if (file && file.size > 2 * 1024 * 1024) { // Example: Check if file is larger than 2MB
            toast.error('Image size exceeds 2MB');
            return;
        }
        setGroupPhoto(file);
    };

    const handleUserSelection = (userId) => {
        setSelectedUsers((prevSelected) =>
            prevSelected.includes(userId)
                ? prevSelected.filter((id) => id !== userId)
                : [...prevSelected, userId]
        );
    };

    const handleCreateGroup = () => {
        if (!groupName.trim()) {
            toast.error('Group name is required');
            return;
        }

        if (selectedUsers.length === 0) {
            toast.error('Please select at least one user');
            return;
        }

        if (groupPhoto) {
        }

        onClose(); // Close modal after creating group
        toast.success('Group created successfully');
    };

    return (
        <dialog open className="modal">
            <div className="modal-box card">
                <h2 className="bg-indigo-700 text-white text-center p-4 rounded">Create Group</h2>
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        placeholder="Enter group name"
                        required
                        className="flex-1 p-2 border border-gray-300 rounded-lg"
                    />
                    <label htmlFor="group-photo" className="relative">
                        <input
                            type="file"
                            id="group-photo"
                            accept="image/*"
                            onChange={handleGroupPhotoChange}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        <div className="flex items-center justify-center bg-gray-200 rounded-lg p-2 cursor-pointer">
                            <FcAddImage className="text-3xl" />
                        </div>
                    </label>
                </div>

                <h3 className="text-xl text-white mb-2">Select Users</h3>
                <ul>
                    {users.map((user) => (
                        <li
                            key={user._id}
                            className="flex items-center space-x-4 p-2 cursor-pointer hover:bg-gray-700"
                        >
                            <img
                                src={
                                    user.profilePicture?.data
                                        ? `data:${user.profilePicture.contentType};base64,${convertBufferToBase64(user.profilePicture.data)}`
                                        : '/default-avatar.png'
                                }
                                alt="avatar"
                                className="w-14 h-16 rounded-badge"
                            />
                            <div className="flex-1">
                                <p className="font-semibold text-green-500 my-1">{user.name}</p>
                            </div>
                            <input
                                type="checkbox"
                                className="checkbox border-orange-400 [--chkbg:theme(colors.indigo.600)] [--chkfg:orange] checked:border-indigo-800"
                                id={user._id}
                                checked={selectedUsers.includes(user._id)}
                                onChange={() => handleUserSelection(user._id)}
                            />
                        </li>
                    ))}
                </ul>
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={onClose}
                        className="mr-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleCreateGroup}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-800"
                    >
                        Create Group
                    </button>
                </div>
            </div>
        </dialog>
    );
};

export default CreateGroupModal;

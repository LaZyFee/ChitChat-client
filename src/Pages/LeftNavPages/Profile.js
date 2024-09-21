import React, { useState } from 'react';
import axios from 'axios'; // Use Axios for making HTTP requests
import { toast } from 'react-hot-toast'; // Importing react-hot-toast

const Profile = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const [profilePicture, setProfilePicture] = useState(user.profilePicture);
    const [name, setName] = useState(user.name); // Track name change
    const [showMenu, setShowMenu] = useState(false);
    const [hover, setHover] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    // Function to handle profile picture changes
    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setProfilePicture(e.target.result);
            };
            reader.readAsDataURL(file);
        }
        setShowMenu(false); // Close the menu
    };

    // Function to handle profile updates
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page reload
        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append('name', name);
            if (profilePicture) {
                formData.append('profile_pic', document.getElementById('fileInput').files[0]); // Append the file to FormData
            }
            formData.append('currentPassword', currentPassword); // Add current password
            formData.append('newPassword', newPassword); // Add new password

            // Send a request to update the user
            const response = await axios.put('http://localhost:5000/update-user', formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data' // Make sure it's a multipart form request
                },
            });

            if (response.status === 200) {
                // Show success toast
                toast.success('Profile updated successfully!');

                // Update the local storage if necessary
                localStorage.setItem('user', JSON.stringify({ ...user, name, profilePicture }));

                // Close modal and refresh page after success
                setShowModal(false);
                window.location.reload(); // Refresh the page to show the updated profile picture
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            // Show error toast
            toast.error('There was an error updating your profile.');
        } finally {
            setIsSubmitting(false);
        }
    };


    const handleViewImage = () => {
        setShowModal(true);
        setShowMenu(false); // Close the menu after selecting
    };

    const handleRemoveImage = () => {
        setProfilePicture(null);
        setShowMenu(false); // Close the menu after selecting
    };

    return (
        <div className="hero max-h-screen">
            <div className="hero-content flex-col lg:flex-row-reverse">
                <div className="text-center lg:text-left">
                    <h1 className="text-5xl font-bold whitespace-nowrap">Update Profile</h1>
                </div>
                <div className="card w-full max-w-sm shrink-0 shadow-2xl">
                    <form className="card-body" onSubmit={handleSubmit}>
                        <div
                            className="relative form-control flex flex-col items-center"
                            onMouseEnter={() => setHover(true)}
                            onMouseLeave={() => setHover(false)}
                        >
                            <img
                                src={profilePicture || 'default-avatar-url'}
                                alt="Profile"
                                className="rounded-full w-40 h-40 object-cover mb-4"
                            />
                            {hover && (
                                <div
                                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full cursor-pointer"
                                    onClick={() => setShowMenu(!showMenu)}
                                >
                                    <span className="text-white">✏️</span>
                                </div>
                            )}
                            {showMenu && (
                                <div className="absolute top-32 bg-gray-800 text-white rounded-lg shadow-lg">
                                    <ul className="py-2">
                                        <li className="px-4 py-2 cursor-pointer hover:bg-gray-700" onClick={handleViewImage}>
                                            View Image
                                        </li>
                                        <li className="px-4 py-2 cursor-pointer hover:bg-gray-700" onClick={() => document.getElementById('fileInput').click()}>
                                            Change Image
                                        </li>
                                        <li className="px-4 py-2 cursor-pointer hover:bg-gray-700" onClick={handleRemoveImage}>
                                            Remove Image
                                        </li>
                                    </ul>
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleProfilePictureChange}
                                id="fileInput"
                                style={{ display: 'none' }}
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Username</span>
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)} // Capture name change
                                className="input input-bordered"
                                required
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input
                                type="email"
                                defaultValue={user.email}
                                className="input input-bordered"
                                readOnly
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Phone Number</span>
                            </label>
                            <input
                                type="tel"
                                defaultValue={user.mobile}
                                className="input input-bordered"
                                readOnly
                            />
                        </div>

                        {/* Add current password input */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Current Password</span>
                            </label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="input input-bordered"
                                required
                            />
                        </div>

                        {/* Add new password input */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">New Password</span>
                            </label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="input input-bordered"
                                required
                            />
                        </div>

                        <div className="form-control mt-6">
                            <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Updating...' : 'UPDATE'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-75">
                    <div className="relative">
                        <img
                            src={profilePicture || 'default-avatar-url'}
                            alt="Profile"
                            className="rounded-lg max-w-md w-full"
                        />
                        <button
                            className="absolute top-2 right-2 bg-white text-black rounded-full px-3 py-1"
                            onClick={() => setShowModal(false)}
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;

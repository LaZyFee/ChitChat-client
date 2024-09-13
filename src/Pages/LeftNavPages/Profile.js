import React, { useState } from 'react';

const Profile = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const [profilePicture, setProfilePicture] = useState(user.profilePicture);
    const [showMenu, setShowMenu] = useState(false); // State to show the dropdown menu
    const [hover, setHover] = useState(false); // State to handle hover
    const [showModal, setShowModal] = useState(false); // State to show the image modal

    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setProfilePicture(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleViewImage = () => {
        setShowModal(true); // Show the image modal
    };

    const handleRemoveImage = () => {
        setProfilePicture(null); // Removes the image
    };

    return (
        <div className="hero max-h-screen">
            <div className="hero-content flex-col lg:flex-row-reverse">
                <div className="text-center lg:text-left">
                    <h1 className="text-5xl font-bold whitespace-nowrap">Update Profile</h1>
                </div>
                <div className="card w-full max-w-sm shrink-0 shadow-2xl">
                    <form className="card-body">
                        {/* Profile Picture with Hover Effect */}
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
                                    <span className="text-white">
                                        ✏️
                                    </span>
                                </div>
                            )}

                            {/* Dropdown Menu */}
                            {showMenu && (
                                <div className="absolute top-32 bg-gray-800 text-white rounded-lg shadow-lg">
                                    <ul className="py-2">
                                        <li
                                            className="px-4 py-2 cursor-pointer hover:bg-gray-700"
                                            onClick={handleViewImage}
                                        >
                                            View Image
                                        </li>
                                        <li
                                            className="px-4 py-2 cursor-pointer hover:bg-gray-700"
                                            onClick={() => document.getElementById('fileInput').click()}
                                        >
                                            Change Image
                                        </li>
                                        <li
                                            className="px-4 py-2 cursor-pointer hover:bg-gray-700"
                                            onClick={handleRemoveImage}
                                        >
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
                                style={{ display: 'none' }} // Hidden file input
                            />
                        </div>

                        {/* Username */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Username</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Username"
                                defaultValue={user.name}
                                className="input input-bordered"
                                required
                            />
                        </div>

                        {/* Email (Read Only) */}
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

                        {/* Phone Number (Read Only) */}
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

                        {/* Password */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input
                                type="password"
                                placeholder="Current password"
                                className="input input-bordered"
                            />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Change Password</span>
                            </label>
                            <input
                                type="password"
                                placeholder="New password"
                                className="input input-bordered"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="form-control mt-6">
                            <button className="btn btn-primary">UPDATE</button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Modal for Viewing Image */}
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
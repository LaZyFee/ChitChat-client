import React from 'react';
import LeftNav from './LeftNav';
import { HiMiniPlusSmall } from "react-icons/hi2";

const Navbar = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    console.log(user);

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
                <button className="text-pink-500">
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
        </div>
    );
};

export default Navbar;

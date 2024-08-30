import React, { useState, useEffect, useRef } from 'react';
import { CiPower } from "react-icons/ci";
import { RiMessageLine } from "react-icons/ri";
import { IoMdPerson } from "react-icons/io";
import { MdGroups2 } from "react-icons/md";
import { CiSettings } from "react-icons/ci";
import { HiMenuAlt2 } from "react-icons/hi";
import { TbExchange } from "react-icons/tb";
import { Link } from 'react-router-dom';

const LeftNav = () => {
    const [isOpen, setIsOpen] = useState(false);
    const drawerRef = useRef(null);

    const toggleDrawer = () => {
        setIsOpen(!isOpen);
    };

    const handleClickOutside = (event) => {
        if (drawerRef.current && !drawerRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="relative flex items-center">
            {/* Menu Button */}
            <button
                className="text-white"
                onClick={toggleDrawer}
            >
                <HiMenuAlt2 className="text-3xl" />
            </button>

            {/* Drawer */}
            <div
                ref={drawerRef}
                className={`fixed top-0 left-0 h-full bg-gray-800 text-white w-64 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    } transition-transform duration-300 ease-in-out z-20`}
            >
                <button
                    className="absolute top-4 right-4 text-white text-2xl"
                    onClick={toggleDrawer}
                >
                    &times;
                </button>
                <div className="flex flex-col justify-between h-full mt-4">
                    <div>
                        <ul className="menu p-4">
                            <li>
                                <Link className="text-2xl m-3" to="/">
                                    <CiPower /> <p className="text-sm">Logout</p>
                                </Link>
                            </li>
                            <li>
                                <Link className="text-2xl m-3" to="/messages">
                                    <RiMessageLine /> <p className="text-sm">Inbox</p>
                                </Link>
                            </li>
                            <li>
                                <Link className="text-2xl m-3" to="/profile">
                                    <IoMdPerson /> <p className="text-sm">Profile</p>
                                </Link>
                            </li>
                            <li>
                                <Link className="text-2xl m-3" to="/menu">
                                    <MdGroups2 /> <p className="text-sm">Create Group</p>
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <ul className="menu p-4">
                            <li>
                                <Link className="text-2xl m-3" to="/setting">
                                    <CiSettings /> <p className="text-sm">Setting</p>
                                </Link>
                            </li>
                            <li>
                                <Link className="text-2xl m-3" to="/more">
                                    <TbExchange /> <p className="text-sm">Change Theme</p>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeftNav;

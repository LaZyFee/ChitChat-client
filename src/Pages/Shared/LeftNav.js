import React, { useState, useEffect, useRef } from 'react';
import { HiMenuAlt2 } from 'react-icons/hi';
import { Link, useNavigate } from 'react-router-dom';
import { TbExchange } from 'react-icons/tb';
import { IoMdPerson } from 'react-icons/io';
import { RiMessageLine } from 'react-icons/ri';
import { CiSettings, CiPower } from 'react-icons/ci';

const LeftNav = ({ onChangeTheme }) => { // Accept onChangeTheme prop here
    const [isOpen, setIsOpen] = useState(false);
    const drawerRef = useRef(null);
    const navigate = useNavigate();

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

    const handleLogout = async () => {
        try {
            await fetch('http://localhost:5000/logout', {  // Adjust the URL to match your backend server's URL
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };


    return (
        <div className="relative">
            <button
                className={`text-white z-30 ${isOpen ? 'hidden' : ''}`}
                onClick={toggleDrawer}
            >
                <HiMenuAlt2 className="text-3xl" />
            </button>
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
                <div className="flex flex-col justify-evenly h-full">
                    <div>
                        <ul className="menu p-4">
                            <li>
                                <button className="text-2xl m-3" onClick={onChangeTheme}> {/* Call onChangeTheme here */}
                                    <TbExchange /> <p className="text-sm">Change Theme</p>
                                </button>
                            </li>
                            <li>
                                <Link className="text-2xl m-3" to="/profile">
                                    <IoMdPerson /> <p className="text-sm">Profile</p>
                                </Link>
                            </li>
                            <li>
                                <Link className="text-2xl m-3" to="/messages">
                                    <RiMessageLine /> <p className="text-sm">Inbox</p>
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <ul className="menu">
                            <li>
                                <Link className="text-2xl m-3" to="/setting">
                                    <CiSettings /> <p className="text-sm">Setting</p>
                                </Link>
                            </li>
                            <li>
                                <button className="text-2xl m-3" onClick={handleLogout}>
                                    <CiPower /> <p className="text-sm">Logout</p>
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeftNav;

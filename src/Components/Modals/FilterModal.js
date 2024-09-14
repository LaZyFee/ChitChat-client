import React, { useRef, useEffect } from 'react';

const FilterModal = ({ onClose }) => {
    const modalRef = useRef(null);

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                onClose(); // Close modal when clicking outside
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [onClose]);

    return (
        <dialog open className="modal">
            <div ref={modalRef} className="modal-box p-2">
                <h3 className="text-lg font-bold mb-4">Filter chats by</h3>
                <ul className="space-y-3">
                    <li className="cursor-pointer flex items-center space-x-2 hover:bg-gray-200 hover:text-black  p-2 rounded">
                        <span>📩</span>
                        <span>Unread</span>
                    </li>
                    <li className="cursor-pointer flex items-center space-x-2 hover:bg-gray-200 hover:text-black p-2 rounded">
                        <span>👤</span>
                        <span>Contacts</span>
                    </li>
                    <li className="cursor-pointer flex items-center space-x-2 hover:bg-gray-200 hover:text-black p-2 rounded">
                        <span>🧑‍💼</span>
                        <span>Non-contacts</span>
                    </li>
                    <li className="cursor-pointer flex items-center space-x-2 hover:bg-gray-200 hover:text-black p-2 rounded">
                        <span>👥</span>
                        <span>Groups</span>
                    </li>
                    <li className="cursor-pointer flex items-center space-x-2 hover:bg-gray-200 hover:text-black p-2 rounded">
                        <span>📝</span>
                        <span>Drafts</span>
                    </li>
                </ul>
            </div>
        </dialog>
    );
};

export default FilterModal;

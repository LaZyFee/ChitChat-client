import React from 'react';
import convertBufferToBase64 from '../../Utils/convertBufferToBase64';

const UserListModal = ({ users, onUserClick }) => {
    return (
        <dialog id="user_list_modal" className="modal">
            <div className="modal-box card">
                <h2 className="bg-indigo-700 text-white text-center p-4 rounded">Users</h2>
                <ul>
                    {users.map((u) => (
                        <li
                            key={u._id}
                            className="py-2 flex items-center cursor-pointer bg-gray-700 rounded-lg mb-2 hover:bg-green-500 hover:text-white"
                            onClick={() => onUserClick(u)}
                        >
                            <div className="avatar mr-4">
                                <div className="w-12 h-12 rounded-full">
                                    {u.profilePicture && u.profilePicture.data ? (
                                        <img src={`data:${u.profilePicture.contentType};base64,${convertBufferToBase64(u.profilePicture.data)}`} alt={`${u.name} Avatar`} />
                                    ) : (
                                        <img src="/default-avatar.png" alt="Default Avatar" />
                                    )}
                                </div>
                            </div>
                            <div>
                                <p className="font-semibold">{u.name}</p>
                            </div>
                        </li>
                    ))}
                </ul>

            </div>
            <form method="dialog" className="modal-backdrop">
                <button>Close</button>
            </form>
        </dialog>
    );
};

export default UserListModal;

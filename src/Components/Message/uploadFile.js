import React, { useState } from 'react';

const UploadFile = ({ chatId }) => {
    const [file, setFile] = useState(null);
    const [content, setContent] = useState('');
    const token = localStorage.getItem('token');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file || !chatId) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('chatId', chatId);
        formData.append('senderId', localStorage.getItem('userId')); // Ensure userId is stored in localStorage
        formData.append('content', content);

        try {
            const response = await fetch('http://localhost:5000/upload', {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to upload file');
            }

            setFile(null);
            setContent('');
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    return (
        <div className="p-4 border-t border-gray-700">
            <input type="file" onChange={handleFileChange} />
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Add a description..."
                className="w-full p-2 border rounded-md mt-2"
            />
            <button onClick={handleUpload} className="mt-2 bg-blue-500 text-white p-2 rounded-md">Upload</button>
        </div>
    );
};

export default UploadFile;

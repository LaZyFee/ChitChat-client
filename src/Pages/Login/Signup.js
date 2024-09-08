import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        password: '',
        image: null,
    });
    const [loading, setLoading] = useState(false); // Loading state

    const navigate = useNavigate();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData({ ...formData, image: reader.result });
        };
        reader.readAsDataURL(file);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Start loading
        // console.log("Form Data:", formData);
        // Client-side validation
        if (!formData.name || !formData.email || !formData.mobile || !formData.password) {
            toast.error("All fields are required");
            setLoading(false); // Stop loading on validation error
            return;
        }

        const response = await fetch('http://localhost:5000/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const result = await response.json();
        // console.log("Response:", result);

        setLoading(false); // Stop loading

        if (response.ok) {
            localStorage.setItem('token', result.token);
            localStorage.setItem('user', JSON.stringify(result.user));
            navigate('/messages');
        } else {
            toast.error(result.error);
        }
    };

    return (
        <div className='h-[600px] flex justify-center items-center'>
            <Toaster />
            <div className='w-96 p-7'>
                <h2 className='text-xl text-center'>Sign Up</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-control w-full max-w-xs">
                        <label className="label">Name</label>
                        <input
                            type="text"
                            name="name"
                            onChange={handleChange}
                            className="input input-bordered w-full max-w-xs"
                            disabled={loading} // Disable input while loading
                        />
                    </div>
                    <div className="form-control w-full max-w-xs">
                        <label className="label">Email</label>
                        <input
                            type="email"
                            name="email"
                            onChange={handleChange}
                            className="input input-bordered w-full max-w-xs"
                            disabled={loading} // Disable input while loading
                        />
                    </div>
                    <div className="form-control w-full max-w-xs">
                        <label className="label">Mobile</label>
                        <input
                            type="text"
                            name="mobile"
                            onChange={handleChange}
                            className="input input-bordered w-full max-w-xs"
                            disabled={loading} // Disable input while loading
                        />
                    </div>
                    <div className="form-control w-full max-w-xs">
                        <label className="label">Password</label>
                        <input
                            type="password"
                            name="password"
                            onChange={handleChange}
                            className="input input-bordered w-full max-w-xs"
                            disabled={loading} // Disable input while loading
                        />
                    </div>
                    <div className="form-control w-full max-w-xs">
                        <label className="label">Profile Picture</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="input input-bordered w-full max-w-xs"
                            disabled={loading} // Disable input while loading
                        />
                    </div>
                    <button
                        className='btn btn-accent w-full mt-4'
                        type="submit"
                        disabled={loading} // Disable button while loading
                    >
                        {loading ? 'Signing Up...' : 'Sign Up'} {/* Show loading text */}
                    </button>
                </form>
                <p>Already have an account? <Link className='text-secondary' to="/login">Please Login</Link></p>
            </div>
        </div>
    );
};

export default Signup;
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (response.ok) {
            toast.success(result.message);
            // Save JWT token in localStorage
            localStorage.setItem('token', result.token);
            // Save user data in localStorage
            localStorage.setItem('user', JSON.stringify(result.user));
            // Redirect to the inbox or another protected route
            navigate('/messages');
        } else {
            toast.error(result.error);
        }
    };


    return (
        <div className='h-[600px] flex justify-center items-center'>
            <Toaster />
            <div className='w-96 p-7'>
                <h2 className='text-xl text-center'>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-control w-full max-w-xs">
                        <label className="label">Email</label>
                        <input type="email" name="email" onChange={handleChange} className="input input-bordered w-full max-w-xs" />
                    </div>
                    <div className="form-control w-full max-w-xs">
                        <label className="label">Password</label>
                        <input type="password" name="password" onChange={handleChange} className="input input-bordered w-full max-w-xs" />
                    </div>
                    <input className='btn btn-accent w-full mt-4' value="Login" type="submit" />
                </form>
                <p>Don't have an account? <Link className='text-secondary' to="/signup">Sign Up</Link></p>
            </div>
        </div>
    );
};

export default Login;

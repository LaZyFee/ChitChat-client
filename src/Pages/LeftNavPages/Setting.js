import React from 'react';
import Loader from '../Shared/Loader';

const Setting = () => {
    return (
        <div className='flex items-center justify-center h-screen'>
            <div className='text-center'>
                <h1 className='text-4xl font-bold text-purple-900'>Setting</h1>
                <h1 className='text-4xl font-bold text-purple-900'>Update coming soon</h1>
                <Loader />
            </div>
        </div>

    );
};

export default Setting;
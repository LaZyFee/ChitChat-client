import { createBrowserRouter } from 'react-router-dom';
import Main from '../../Layouts/Main';
import Login from '../../Pages/Login/Login';
import Signup from '../../Pages/Login/Signup';
import Profile from '../../Pages/LeftNavPages/Profile';
import Setting from '../../Pages/LeftNavPages/Setting';
import Option from '../../Pages/LeftNavPages/Option';
import Inbox from '../../Pages/LeftNavPages/Inbox';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Main />,
        children: [
            { path: 'login', element: <Login /> },
            { path: 'signup', element: <Signup /> },
            { path: 'messages', element: <Inbox /> },
            { path: 'profile', element: <Profile /> },
            { path: 'setting', element: <Setting /> },
            { path: 'more', element: <Option /> },
        ],
    },
]);

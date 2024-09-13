import { createBrowserRouter } from "react-router-dom";
import Main from "../../Layouts/Main";
import Login from "../../Pages/Login/Login";
import Signup from "../../Pages/Login/Signup";
import Profile from "../../Pages/LeftNavPages/Profile";
import Setting from "../../Pages/LeftNavPages/Setting";
import Option from "../../Pages/LeftNavPages/Option";
import Inbox from "../../Pages/LeftNavPages/Inbox";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Main />, // Main layout
        children: [
            {
                path: 'login', // No leading slash, as it's relative to the parent
                element: <Login />
            },
            {
                path: 'signup', // No leading slash, as it's relative to the parent
                element: <Signup />
            },
            {
                path: 'messages', // No leading slash, as it's relative to the parent
                element: <Inbox />
            },
            {
                path: 'profile',
                element: <Profile />
            },

            {
                path: 'setting',
                element: <Setting />
            },
            {
                path: 'more',
                element: <Option />
            }
        ]
    }
]);

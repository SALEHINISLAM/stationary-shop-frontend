import { createBrowserRouter } from "react-router-dom";
import App from '../App.tsx'
import Login from "../pages/login/page.tsx";
import Dashboard from "../pages/dashboard/page.tsx";
import AdminDashboard from "../pages/dashboard/admin/page.tsx";
import UsersDashboard from "../pages/dashboard/users/page.tsx";
import { authLoader, roleLoader, roleRedirectLoader } from "./PrivateRoutes.ts";
import DashboardHome from "../pages/dashboard/home/page.tsx";

export const router = createBrowserRouter([
    {
        path: '/',
        Component: App,
    },
    {
        path: "/login",
        Component: Login
    },
    {
        path: "/dashboard",
        Component: Dashboard,
        loader: authLoader,
        children: [
            {
                index: true,
                loader: () => roleRedirectLoader(),
                Component: DashboardHome
            },
            {
                path: 'admin',
                Component: AdminDashboard,
                loader: () => roleLoader(['admin', 'superAdmin'])
            },
            {
                path: 'users',
                Component: UsersDashboard,
                loader: () => roleLoader(['user'])
            }
        ]
    }
])
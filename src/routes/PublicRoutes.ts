import { createBrowserRouter } from "react-router-dom";
import App from '../App.tsx'
import Login from "../pages/login/page.tsx";
import Dashboard from "../pages/dashboard/page.tsx";
import AdminDashboard from "../pages/dashboard/admin/page.tsx";
import UsersDashboard from "../pages/dashboard/users/page.tsx";
import { authLoader, redirectIfLoggedInLoader, roleLoader, roleRedirectLoader } from "./PrivateRoutes.ts";
import DashboardHome from "../pages/dashboard/home/page.tsx";
import LoadingScreen from "../components/loading.tsx";

export const router = createBrowserRouter([
    {
        path: '/',
        Component: App,
        loader:LoadingScreen
    },
    {
        path: "/login",
        Component: Login,
        loader:redirectIfLoggedInLoader
    },
    {
        path: "/dashboard",
        Component: Dashboard,
        loader: authLoader,
        children: [
            {
                index: true,
                loader: () => roleRedirectLoader(),
                Component: DashboardHome,
                HydrateFallback: LoadingScreen
            },
            {
                path: 'admin',
                Component: AdminDashboard,
                loader: () => roleLoader(['admin', 'superAdmin']),
                HydrateFallback: LoadingScreen
            },
            {
                path: 'users',
                Component: UsersDashboard,
                loader: () => roleLoader(['user'])
            }
        ]
    }
])
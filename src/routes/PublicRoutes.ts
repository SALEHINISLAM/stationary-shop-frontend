import { createBrowserRouter, redirect } from "react-router-dom";
import App from '../App.tsx'
import Login from "../pages/login/page.tsx";
import Dashboard from "../pages/dashboard/page.tsx";
import AdminDashboard from "../pages/dashboard/admin/page.tsx";
import UsersDashboard from "../pages/dashboard/users/page.tsx";
import { authLoader, redirectIfLoggedInLoader, roleLoader, roleRedirectLoader } from "./PrivateRoutes.ts";
import DashboardHome from "../pages/dashboard/home/page.tsx";
import LoadingScreen from "../components/loading.tsx";
import AllProducts from "../pages/dashboard/admin/allProducts/page.tsx";
import AddProduct from "../pages/dashboard/admin/addProduct/page.tsx";
import UpdateProduct from "../pages/dashboard/admin/updateProduct/page.tsx";
import DeleteProduct from "../pages/dashboard/admin/deleteProduct/page.tsx";
import ManageUsers from "../pages/dashboard/admin/manageUsers/page.tsx";
import ManageOrders from "../pages/dashboard/admin/manageOrders/page.tsx";

export const router = createBrowserRouter([
    {
        path: '/',
        Component: App,
        HydrateFallback:LoadingScreen
    },
    {
        path: "/login",
        Component: Login,
        loader:redirectIfLoggedInLoader,
    },
    {
        path:"/loading",
        Component: LoadingScreen,
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
                HydrateFallback: LoadingScreen,
                children:[
                    {
                        index:true,
                        loader:()=>{
                            return redirect('/dashboard/admin/all-products')
                        }
                    },
                    {
                        path:'all-products',
                        loader: () => roleLoader(['admin', 'superAdmin']),
                        Component:AllProducts
                    },
                    {
                        path:'add-product',
                        loader: () => roleLoader(['admin', 'superAdmin']),
                        Component:AddProduct
                    },
                    {
                        path:'update-product',
                        loader: () => roleLoader(['admin', 'superAdmin']),
                        Component:UpdateProduct
                    },
                    {
                        path:'delete-product',
                        loader: () => roleLoader(['admin', 'superAdmin']),
                        Component:DeleteProduct
                    },
                    {
                        path:'manage-users',
                        loader: () => roleLoader(['admin', 'superAdmin']),
                        Component:ManageUsers
                    },
                    {
                        path:'manage-orders',
                        loader: () => roleLoader(['admin', 'superAdmin']),
                        Component:ManageOrders
                    }
                ]
            },
            {
                path: 'users',
                Component: UsersDashboard,
                loader: () => roleLoader(['user'])
            }
        ]
    }
])
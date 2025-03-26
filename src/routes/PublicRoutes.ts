import { createBrowserRouter } from "react-router-dom";
import App from '../App.tsx'
import Login from "../pages/login/page.tsx";

export const router=createBrowserRouter([
    {
        path:'/',
        Component:App
    },
    {
        path:"/login",
        Component:Login
    }
])
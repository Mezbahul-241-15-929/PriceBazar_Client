import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import { Component } from "react";
import Home from "../pages/Home/Home/Home";
import Products from "../pages/Products/Products";
import About from "../pages/About/About";
import Contact from "../pages/Contact/Contact";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Auth/Login/Login";
import Register from "../pages/Auth/Register/Register";
import Profile from "../pages/Profile/Profile";
import PrivateRoute from "./PrivateRoute";
import Profile2 from "../pages/Profile/Profile2";
import AdminLayout from "../layouts/DashboardLayout";
import AllUsers from "../layouts/DashBoardComponents/AllUsers";
import AddProuducts from "../layouts/DashBoardComponents/AddProuduct";

export const router = createBrowserRouter([
    {
        path: "/",
        Component: RootLayout,
        children: [
            {
                index: true,
                Component: Home
            },
            {
                path: "/products",
                Component: Products
            },
            {
                path: "/about",
                Component: About
            },
            {
                path: "/contact",
                Component: Contact
            },
            {
                path: "/profile",
                element: <PrivateRoute><Profile></Profile></PrivateRoute>,
            }
        ]

    },

    {
        path: '/',
        Component: AuthLayout,
        children: [
            {
                path: 'login',
                Component: Login
            },
            {
                path: 'register',
                Component: Register
            }
        ]
    },

    {
        path: '/dashboard',
        Component: AdminLayout,
        children: [
            {
                path: '/dashboard/all-users',
                Component: AllUsers
            },
            {
                path: '/dashboard/add-product',
                Component: AddProuducts
            }

        ]

    },
]);

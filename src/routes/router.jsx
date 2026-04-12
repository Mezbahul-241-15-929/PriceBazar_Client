import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import { Component } from "react";
import Home from "../pages/Home/Home/Home";
import Products from "../pages/Products/Products";
import ProductDetails from "../pages/Products/ProductDetails";
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
import MyProducts from "../layouts/DashBoardComponents/MyProducts";
import AddAdvertisement from "../layouts/DashBoardComponents/AddAdvertisement";
import MyAdvertisements from "../layouts/DashBoardComponents/MyAdvertisements";
import AllProducts from "../layouts/DashBoardComponents/AllProducts";
import AllAdvertisements from "../layouts/DashBoardComponents/AllAdvertisements";
import PriceTrends from "../layouts/DashBoardComponents/PriceTrends";
import Watchlist from "../layouts/DashBoardComponents/Watchlist";
import Payment from "../pages/Payment/Payment";

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
                path: "/product-details/:id",
                element: <PrivateRoute><ProductDetails /></PrivateRoute>
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
            },
            {
                path: "/payment/:id",
                element: <PrivateRoute><Payment /></PrivateRoute>,
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
                path: '/dashboard/all-product',
                Component: AllProducts
            },
            {
                path: '/dashboard/add-product',
                Component: AddProuducts
            },
            {
                path: '/dashboard/my-products',
                Component: MyProducts
            },
            {
                path: '/dashboard/all-ads',
                Component: AllAdvertisements
            },
            {
                path: '/dashboard/add-advertisement',
                Component: AddAdvertisement
            },
            {
                path: '/dashboard/my-advertisements',
                Component: MyAdvertisements
            },
            {
                path: '/dashboard/price-trends',
                Component: PriceTrends
            },
            {
                path: '/dashboard/watchlist',
                Component: Watchlist
            }

        ]

    },
]);

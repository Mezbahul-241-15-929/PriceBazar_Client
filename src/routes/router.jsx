import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import { Component } from "react";
import Home from "../pages/Home/Home/Home";
import Products from "../pages/Products/Products";
import ProductDetails from "../pages/Products/ProductDetails";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Auth/Login/Login";
import Register from "../pages/Auth/Register/Register";
import Profile from "../pages/Profile/Profile";
import PrivateRoute from "./PrivateRoute";
import RoleBasedRoute from "./RoleBasedRoute";
import Profile2 from "../pages/Profile/Profile2";
import AdminLayout from "../layouts/DashboardLayout";
import Dashboard from "../layouts/DashBoardComponents/Dashboard";
import AdminDashboard from "../layouts/DashBoardComponents/AdminDashboard";
import VendorDashboard from "../layouts/DashBoardComponents/VendorDashboard";
import UserDashboard from "../layouts/DashBoardComponents/UserDashboard";
import AllUsers from "../layouts/DashBoardComponents/AllUsers";
import AddProuducts from "../layouts/DashBoardComponents/AddProuduct";
import MyProducts from "../layouts/DashBoardComponents/MyProducts";
import AddAdvertisement from "../layouts/DashBoardComponents/AddAdvertisement";
import MyAdvertisements from "../layouts/DashBoardComponents/MyAdvertisements";
import AllProducts from "../layouts/DashBoardComponents/AllProducts";
import AllAdvertisements from "../layouts/DashBoardComponents/AllAdvertisements";
import AllOrders from "../layouts/DashBoardComponents/AllOrders";
import PriceTrends from "../layouts/DashBoardComponents/PriceTrends";
import Watchlist from "../layouts/DashBoardComponents/Watchlist";
import MyOrderList from "../layouts/DashBoardComponents/MyOrderList";
import Payment from "../pages/Payment/Payment";
import ErrorElement from "./ErrorElement";

export const router = createBrowserRouter([
    {
        path: "/",
        Component: RootLayout,
        errorElement: <ErrorElement />,
        children: [
            {
                index: true,
                Component: Home,
                errorElement: <ErrorElement />
            },
            {
                path: "/products",
                Component: Products,
                errorElement: <ErrorElement />
            },
            {
                path: "/product-details/:id",
                element: <PrivateRoute><ProductDetails /></PrivateRoute>,
                errorElement: <ErrorElement />
            },
            {
                path: "/profile",
                element: <PrivateRoute><Profile></Profile></PrivateRoute>,
                errorElement: <ErrorElement />
            },
            {
                path: "/payment/:product_id",
                element: <PrivateRoute><Payment /></PrivateRoute>,
                errorElement: <ErrorElement />
            }
        ]

    },

    {
        path: '/',
        Component: AuthLayout,
        errorElement: <ErrorElement />,
        children: [
            {
                path: 'login',
                Component: Login,
                errorElement: <ErrorElement />
            },
            {
                path: 'register',
                Component: Register,
                errorElement: <ErrorElement />
            }
        ]
    },

    {
        path: '/dashboard',
        Component: AdminLayout,
        errorElement: <ErrorElement />,
        children: [
            {
                index: true,
                element: <PrivateRoute><Dashboard /></PrivateRoute>,
                errorElement: <ErrorElement />
            },
            {
                path: '/dashboard/all-users',
                element: <RoleBasedRoute allowedRoles={['admin']}><AllUsers /></RoleBasedRoute>,
                errorElement: <ErrorElement />
            },
            {
                path: '/dashboard/all-product',
                element: <RoleBasedRoute allowedRoles={['admin']}><AllProducts /></RoleBasedRoute>,
                errorElement: <ErrorElement />
            },
            {
                path: '/dashboard/add-product',
                element: <RoleBasedRoute allowedRoles={['vendor']}><AddProuducts /></RoleBasedRoute>,
                errorElement: <ErrorElement />
            },
            {
                path: '/dashboard/my-products',
                element: <RoleBasedRoute allowedRoles={['vendor']}><MyProducts /></RoleBasedRoute>,
                errorElement: <ErrorElement />
            },
            {
                path: '/dashboard/all-ads',
                element: <RoleBasedRoute allowedRoles={['admin']}><AllAdvertisements /></RoleBasedRoute>,
                errorElement: <ErrorElement />
            },
            {
                path: '/dashboard/all-orders',
                element: <RoleBasedRoute allowedRoles={['admin']}><AllOrders /></RoleBasedRoute>,
                errorElement: <ErrorElement />
            },
            {
                path: '/dashboard/add-advertisement',
                element: <RoleBasedRoute allowedRoles={['vendor']}><AddAdvertisement /></RoleBasedRoute>,
                errorElement: <ErrorElement />
            },
            {
                path: '/dashboard/my-advertisements',
                element: <RoleBasedRoute allowedRoles={['vendor']}><MyAdvertisements /></RoleBasedRoute>,
                errorElement: <ErrorElement />
            },
            {
                path: '/dashboard/price-trends',
                element: <RoleBasedRoute allowedRoles={['user']}><PriceTrends /></RoleBasedRoute>,
                errorElement: <ErrorElement />
            },
            {
                path: '/dashboard/watchlist',
                element: <RoleBasedRoute allowedRoles={['user']}><Watchlist /></RoleBasedRoute>,
                errorElement: <ErrorElement />
            },
            {
                path: '/dashboard/my-orders',
                element: <RoleBasedRoute allowedRoles={['user']}><MyOrderList /></RoleBasedRoute>,
                errorElement: <ErrorElement />
            }

        ]

    },
]);

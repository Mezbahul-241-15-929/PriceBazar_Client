import { Outlet } from 'react-router';
import Navbar from '../pages/shared/Navbar/Navbar';
import Footer from '../pages/shared/Footer/Footer';

import { useState } from "react";
import { Link, useLocation } from "react-router";
import {
    FiMenu,
    FiHome,
    FiPackage,
    FiPlusSquare,
    FiShield,
    FiTrendingUp,
    FiBookmark,
    FiShoppingCart,
} from "react-icons/fi";

import useUserRole from '../hooks/useUserRole';

const DashboardLayout = () => {

    const location = useLocation();
    const pathname = location.pathname;

    const { role, roleLoading } = useUserRole();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);

    const menuItemClass = (path, isCollapsed = false) =>
        `w-full py-2 rounded-lg transition flex items-center gap-2 ${isCollapsed ? "justify-center px-2" : "text-left px-4"
        } ${pathname === path
            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow"
            : "hover:bg-gray-100 text-gray-700"
        }`;

    return (
        <div>
            <Navbar></Navbar>

            <div className='max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8'>
                <div className="bg-gray-50 min-h-screen">

                    <div className="py-6 sm:py-8 md:py-10">
                        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">

                            {/* Sidebar */}
                            <aside className={`w-full ${isDesktopCollapsed ? "lg:w-20" : "lg:w-72"}`}>
                                <div className="rounded-2xl border border-gray-100 bg-white shadow-lg p-4">

                                    {/* Header */}
                                    <div className="flex items-center justify-between mb-3 lg:justify-start">

                                        <button
                                            onClick={() => setIsMenuOpen((prev) => !prev)}
                                            className="lg:hidden w-full flex items-center justify-between text-sm font-semibold text-gray-600"
                                        >
                                            <span className="inline-flex items-center gap-2">
                                                <FiMenu size={16} />
                                                Admin Menu
                                            </span>
                                            <span className="text-xs text-gray-400">
                                                {isMenuOpen ? "Close" : "Open"}
                                            </span>
                                        </button>

                                        <button
                                            onClick={() => setIsDesktopCollapsed((prev) => !prev)}
                                            className="hidden lg:inline-flex items-center gap-2 px-3 h-9 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 transition"
                                        >
                                            <FiMenu size={16} />
                                            {!isDesktopCollapsed && "Admin Menu"}
                                        </button>
                                    </div>

                                    {/* ================= MOBILE MENU ================= */}
                                    <div className="lg:hidden">
                                        <div className={`overflow-hidden transition-all duration-300 ${isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
                                            <div className="mt-2 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 p-3">
                                                <div className="flex flex-col gap-2">

                                                    {/* Dashboard always */}
                                                    <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}
                                                        className={`${menuItemClass("/dashboard")} bg-indigo-50 border border-indigo-100`}>
                                                        <FiHome size={16} /> Dashboard
                                                    </Link>

                                                    {!roleLoading && role === "admin" && (
                                                        <>
                                                            <Link to="/dashboard/all-users" className={menuItemClass("/dashboard/all-users")}>
                                                                <FiPackage size={16} /> All users
                                                            </Link>
                                                            <Link to="/dashboard/all-product" className={menuItemClass("/dashboard/all-product")}>
                                                                <FiPackage size={16} /> All product
                                                            </Link>
                                                            <Link to="/dashboard/all-ads" className={menuItemClass("/dashboard/all-ads")}>
                                                                <FiShield size={16} /> All Advertisement
                                                            </Link>
                                                            <Link to="/dashboard/all-orders" className={menuItemClass("/dashboard/all-orders")}>
                                                                <FiShoppingCart size={16} /> All Order
                                                            </Link>
                                                        </>
                                                    )}

                                                    {!roleLoading && role === "vendor" && (
                                                        <>
                                                            <Link to="/dashboard/add-product" className={menuItemClass("/dashboard/add-product")}>
                                                                <FiPlusSquare size={16} /> Add Product
                                                            </Link>
                                                            <Link to="/dashboard/my-products" className={menuItemClass("/dashboard/my-products")}>
                                                                <FiPackage size={16} /> My Products
                                                            </Link>
                                                            <Link to="/dashboard/add-advertisement" className={menuItemClass("/dashboard/add-advertisement")}>
                                                                <FiShield size={16} /> Add Advertisement
                                                            </Link>
                                                            <Link to="/dashboard/my-advertisements" className={menuItemClass("/dashboard/my-advertisements")}>
                                                                <FiShield size={16} /> My Advertisements
                                                            </Link>
                                                        </>
                                                    )}

                                                    {!roleLoading && role === "user" && (
                                                        <>
                                                            <Link to="/dashboard/price-trends" className={menuItemClass("/dashboard/price-trends")}>
                                                                <FiTrendingUp size={16} /> View price trends
                                                            </Link>
                                                            <Link to="/dashboard/watchlist" className={menuItemClass("/dashboard/watchlist")}>
                                                                <FiBookmark size={16} /> Manage watchlist
                                                            </Link>
                                                            <Link to="/dashboard/my-orders" className={menuItemClass("/dashboard/my-orders")}>
                                                                <FiShoppingCart size={16} /> My Order List
                                                            </Link>
                                                        </>
                                                    )}

                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ================= DESKTOP MENU ================= */}
                                    <div className="hidden lg:block">
                                        <div className={`flex flex-col gap-2 ${isDesktopCollapsed ? "items-center" : ""}`}>

                                            {/* Dashboard always */}
                                            <Link to="/dashboard"
                                                className={`${menuItemClass("/dashboard", isDesktopCollapsed)} bg-indigo-50 border border-indigo-100`}>
                                                <FiHome size={16} />
                                                {!isDesktopCollapsed && "Dashboard"}
                                            </Link>

                                            {!roleLoading && role === "admin" && (
                                                <>
                                                    <Link to="/dashboard/all-users" className={menuItemClass("/dashboard/all-users", isDesktopCollapsed)}>
                                                        <FiPackage size={16} />
                                                        {!isDesktopCollapsed && "All users"}
                                                    </Link>
                                                    <Link to="/dashboard/all-product" className={menuItemClass("/dashboard/all-product", isDesktopCollapsed)}>
                                                        <FiPackage size={16} />
                                                        {!isDesktopCollapsed && "All product"}
                                                    </Link>
                                                    <Link to="/dashboard/all-ads" className={menuItemClass("/dashboard/all-ads", isDesktopCollapsed)}>
                                                        <FiShield size={16} />
                                                        {!isDesktopCollapsed && "All Advertisement"}
                                                    </Link>
                                                    <Link to="/dashboard/all-orders" className={menuItemClass("/dashboard/all-orders", isDesktopCollapsed)}>
                                                        <FiShoppingCart size={16} />
                                                        {!isDesktopCollapsed && "All Order"}
                                                    </Link>
                                                </>
                                            )}

                                            {!roleLoading && role === "vendor" && (
                                                <>
                                                    <Link to="/dashboard/add-product" className={menuItemClass("/dashboard/add-product", isDesktopCollapsed)}>
                                                        <FiPlusSquare size={16} />
                                                        {!isDesktopCollapsed && "Add Product"}
                                                    </Link>
                                                    <Link to="/dashboard/my-products" className={menuItemClass("/dashboard/my-products", isDesktopCollapsed)}>
                                                        <FiPackage size={16} />
                                                        {!isDesktopCollapsed && "My Products"}
                                                    </Link>
                                                    <Link to="/dashboard/add-advertisement" className={menuItemClass("/dashboard/add-advertisement", isDesktopCollapsed)}>
                                                        <FiShield size={16} />
                                                        {!isDesktopCollapsed && "Add Advertisement"}
                                                    </Link>
                                                    <Link to="/dashboard/my-advertisements" className={menuItemClass("/dashboard/my-advertisements", isDesktopCollapsed)}>
                                                        <FiShield size={16} />
                                                        {!isDesktopCollapsed && "My Advertisements"}
                                                    </Link>
                                                </>
                                            )}

                                            {!roleLoading && role === "user" && (
                                                <>
                                                    <Link to="/dashboard/price-trends" className={menuItemClass("/dashboard/price-trends", isDesktopCollapsed)}>
                                                        <FiTrendingUp size={16} />
                                                        {!isDesktopCollapsed && "View price trends"}
                                                    </Link>
                                                    <Link to="/dashboard/watchlist" className={menuItemClass("/dashboard/watchlist", isDesktopCollapsed)}>
                                                        <FiBookmark size={16} />
                                                        {!isDesktopCollapsed && "Manage watchlist"}
                                                    </Link>
                                                    <Link to="/dashboard/my-orders" className={menuItemClass("/dashboard/my-orders", isDesktopCollapsed)}>
                                                        <FiShoppingCart size={16} />
                                                        {!isDesktopCollapsed && "My Order List"}
                                                    </Link>
                                                </>
                                            )}

                                        </div>
                                    </div>

                                </div>
                            </aside>

                            {/* Main Content */}
                            <div className="flex-1">
                                <Outlet></Outlet>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <Footer></Footer>
        </div>
    );
};

export default DashboardLayout;
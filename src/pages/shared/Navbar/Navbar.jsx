import { Link, NavLink } from 'react-router';
import { FiMenu, FiX, FiHome, FiShoppingCart, FiInfo, FiMail, FiUser, FiSettings, FiLogOut } from 'react-icons/fi';
import { AiOutlineUser } from 'react-icons/ai';
import { useState } from 'react';
import useAuth from '../../../hooks/useAuth';
// import { useQuery } from '@tanstack/react-query';
// import useAxiosSecure2 from '../../../hooks/useAxiosSecure2';




const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, logOut } = useAuth();

    // const { data: profile } = useQuery({
    //     queryKey: ["profile", user?.email],
    //     enabled: !!user?.email,
    //     queryFn: async () => {
    //         const res = await useAxiosSecure2.get(`/users/${user.email}`);
    //         return res.data;
    //     },
    // });

    const handleSignOut = () => {
        logOut().then(() => {
            console.log('singed out user')
        })
            .catch(error => {
                console.log(error)
            })
    }

    // Central Tailwind CSS classes
    const getLinkClass = (isActive) =>
        `flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${isActive
            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
            : 'text-gray-700 hover:bg-gray-100'
        }`;

    const signInBtnClass = 'px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center gap-2';

    // const signInBtnMobileClass = 'w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2';

    const links = (
        <>
            <NavLink
                to='/'
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) => getLinkClass(isActive)}
            >
                <FiHome size={18} /> Home
            </NavLink>
            <NavLink
                to='/products'
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) => getLinkClass(isActive)}
            >
                <FiShoppingCart size={18} /> Products
            </NavLink>
            <NavLink
                to='/about'
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) => getLinkClass(isActive)}
            >
                <FiInfo size={18} /> About
            </NavLink>
            <NavLink
                to='/contact'
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) => getLinkClass(isActive)}
            >
                <FiMail size={18} /> Contact
            </NavLink>
        </>
    );

    return (
        <nav className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo/Brand */}
                    <div className="flex-shrink-0">
                        <NavLink
                            to='/'
                            className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300"
                        >
                            PriceBazar
                        </NavLink>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-2">
                        {links}
                    </div>

                    {/* Right Side Actions */}
                    {
                        user ? (
                            <div className='hidden md:flex items-center gap-4'>
                                <div className="flex items-center gap-3">
                                    {/* Avatar + name (dropdown trigger) */}
                                    <div className="dropdown dropdown-end ">
                                        <label tabIndex={0} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg flex items-center gap-3 cursor-pointer p-1 lg:pr-5 rounded-full hover:bg-gray-100 transition">
                                            <div className="relative">
                                                <div className="w-10 h-10 rounded-full overflow-hidden ring-1 ring-gray-100 shadow-sm">
                                                    <img
                                                        alt="User avatar"
                                                        src={user?.photoURL || 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                {/* online indicator */}
                                                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 ring-2 ring-white rounded-full" />
                                            </div>

                                            <div className="hidden lg:flex flex-col text-left">
                                                <span className="text-sm font-medium  leading-tight">
                                                    {user?.displayName || 'Welcome'}
                                                </span>
                                                <span className="text-xs  leading-tight">
                                                    {user?.email || 'User'}
                                                </span>
                                            </div>
                                        </label>

                                        <ul
                                            tabIndex={0}
                                            className="menu menu-sm dropdown-content bg-white rounded-box z-10 mt-3 w-56 p-2 shadow-lg border"
                                        >
                                            <li>
                                                <NavLink to="/profile" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-50">
                                                    <FiUser /> Profile
                                                </NavLink>
                                            </li>
                                            <li>
                                                <NavLink to="/settings" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-50">
                                                    <FiSettings /> Settings
                                                </NavLink>
                                            </li>
                                            <li>
                                                <button
                                                    onClick={handleSignOut}
                                                    className="w-full text-left flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-50 text-red-600"
                                                >
                                                    <FiLogOut /> Logout
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Link to='login'>
                                <div className=" hidden md:flex items-center gap-4">
                                    <button className={signInBtnClass + ' cursor-pointer flex items-center gap-2'}>
                                        <AiOutlineUser size={18} /> Sign In
                                    </button>
                                </div>
                            </Link>
                        )
                    }


                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md hover:bg-gray-100 focus:outline-none transition-colors duration-200"
                        >
                            {isMenuOpen ? (
                                <FiX size={24} className="text-gray-700" />
                            ) : (
                                <FiMenu size={24} className="text-gray-700" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <>
                    <div className="fixed inset-0 z-40 md:hidden">
                        {/* Backdrop */}
                        <div
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                            onClick={() => setIsMenuOpen(false)}
                            aria-hidden="true"
                        />

                        {/* Panel */}
                        <div className="absolute top-16 left-4 right-4 bg-white rounded-lg shadow-xl p-4 transform transition-transform duration-300 ease-out">
                            <div className="flex items-center justify-between">
                                {/* Avatar + name */}
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                                        <img
                                            src={user?.photoURL || 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'}
                                            alt="User avatar"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-800">
                                            {user?.displayName || 'Welcome'}
                                        </div>
                                        {user?.email && <div className="text-sm text-gray-500">{user.email}</div>}
                                    </div>
                                </div>

                                {/* Close button */}
                                <button
                                    onClick={() => setIsMenuOpen(false)}
                                    className="p-2 rounded-md hover:bg-gray-100 text-gray-700"
                                    aria-label="Close menu"
                                >
                                    <FiX size={20} />
                                </button>
                            </div>

                            {/* Links */}
                            <div className="mt-4 grid gap-2">
                                {links}
                            </div>

                            {/* Actions */}
                            <div className="mt-4 border-t pt-4 flex flex-col gap-2">
                                {user ? (
                                    <>
                                        <NavLink
                                            to="/profile"
                                            onClick={() => setIsMenuOpen(false)}
                                            className={({ isActive }) =>
                                                `w-full text-left px-4 py-2 rounded-lg transition ${isActive ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' : 'text-gray-700 hover:bg-gray-50'}`
                                            }
                                        >
                                            Profile
                                        </NavLink>

                                        <NavLink
                                            to="/settings"
                                            onClick={() => setIsMenuOpen(false)}
                                            className={({ isActive }) =>
                                                `w-full text-left px-4 py-2 rounded-lg transition ${isActive ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' : 'text-gray-700 hover:bg-gray-50'}`
                                            }
                                        >
                                            Settings
                                        </NavLink>

                                        <button
                                            onClick={() => {
                                                handleSignOut();
                                                setIsMenuOpen(false);
                                            }}
                                            className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:opacity-95 transition"
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <Link to="login" onClick={() => setIsMenuOpen(false)}>
                                        <button className="cursor-pointer w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg">
                                            <AiOutlineUser size={18} className="inline-block mr-2" /> Sign In
                                        </button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </nav>
    );
};

export default Navbar;

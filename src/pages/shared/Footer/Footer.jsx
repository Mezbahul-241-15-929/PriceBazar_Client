import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { Link } from 'react-router';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                            PriceBazar
                        </Link>
                        <p className="text-sm leading-relaxed text-gray-400">
                            Your trusted companion for tracking market prices, discovering the best deals, and monitoring price trends across multiple markets in Bangladesh.
                        </p>
                        <div className="flex gap-4 pt-2">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors"><FaFacebook size={20} /></a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors"><FaTwitter size={20} /></a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors"><FaInstagram size={20} /></a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors"><FaLinkedin size={20} /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h6 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Quick Links</h6>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/" className="hover:text-emerald-400 transition-colors">Home</Link></li>
                            <li><Link to="/products" className="hover:text-emerald-400 transition-colors">Products</Link></li>
                            <li><Link to="/dashboard" className="hover:text-emerald-400 transition-colors">User Dashboard</Link></li>
                            <li><Link to="/profile" className="hover:text-emerald-400 transition-colors">My Profile</Link></li>
                        </ul>
                    </div>

                    {/* Categories Section */}
                    <div>
                        <h6 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Categories</h6>
                        <ul className="space-y-2 text-sm">
                            <li className="hover:text-emerald-400 cursor-pointer transition-colors">Vegetables</li>
                            <li className="hover:text-emerald-400 cursor-pointer transition-colors">Fruits</li>
                            <li className="hover:text-emerald-400 cursor-pointer transition-colors">Dairy & Eggs</li>
                            <li className="hover:text-emerald-400 cursor-pointer transition-colors">Meat & Fish</li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h6 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Contact Us</h6>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-center gap-3">
                                <FaMapMarkerAlt className="text-emerald-400" />
                                <span>Dhaka, Bangladesh</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <FaPhone className="text-emerald-400" />
                                <span>+880 1234-567890</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <FaEnvelope className="text-emerald-400" />
                                <span>support@pricebazar.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
                    <p>© {new Date().getFullYear()} PriceBazar. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-gray-300">Privacy Policy</a>
                        <a href="#" className="hover:text-gray-300">Terms of Service</a>
                        <a href="#" className="hover:text-gray-300">Cookie Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
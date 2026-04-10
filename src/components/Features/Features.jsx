import React from 'react';
import { motion } from 'framer-motion';

const Features = () => {
    const features = [
        { icon: '🛒', title: 'Wide Selection', desc: 'Browse thousands of products from trusted vendors' },
        { icon: '💰', title: 'Best Prices', desc: 'Compare prices and get the best deals on quality items' },
        { icon: '⚡', title: 'Fast Delivery', desc: 'Quick and reliable delivery to your doorstep' },
        { icon: '🔒', title: 'Secure Checkout', desc: 'Safe and secure payment methods to protect you' }
    ];

    return (
        <motion.div 
            className="w-full bg-white py-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
        >
            <div className="max-w-6xl mx-auto px-4">
                <motion.div 
                    className="text-center mb-10"
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                        ✨ Why Choose PriceBazar?
                    </h2>
                    <p className="text-gray-600 text-sm md:text-base">
                        We provide the best platform for buying and selling quality products
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-linear-to-br from-emerald-50 to-teal-50 p-6 rounded-lg text-center hover:shadow-lg transition-shadow"
                        >
                            <motion.div 
                                className="text-4xl mb-3"
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                transition={{ duration: 0.4, delay: index * 0.1 + 0.1 }}
                                viewport={{ once: true }}
                            >
                                {feature.icon}
                            </motion.div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                            <p className="text-gray-600 text-sm">
                                {feature.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default Features;

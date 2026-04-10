import React from 'react';
import { motion } from 'framer-motion';

const Stats = () => {
    const stats = [
        { number: '10K+', label: 'Active Users', desc: 'Trusted by thousands' },
        { number: '5K+', label: 'Products', desc: 'Variety at your choice' },
        { number: '500+', label: 'Vendors', desc: 'Quality assured' },
        { number: '98%', label: 'Satisfaction', desc: 'Customer happiness' }
    ];

    return (
        <motion.div 
            className="w-full bg-linear-to-b from-gray-50 to-white py-12"
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
                        📊 By The Numbers
                    </h2>
                    <p className="text-gray-600 text-sm md:text-base">
                        Join thousands of satisfied customers and vendors
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow"
                        >
                            <motion.div 
                                className="text-4xl font-bold text-emerald-600 mb-2"
                                initial={{ opacity: 0, y: -10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 + 0.1 }}
                                viewport={{ once: true }}
                            >
                                {stat.number}
                            </motion.div>
                            <p className="text-gray-600 font-semibold">{stat.label}</p>
                            <p className="text-gray-500 text-sm mt-1">{stat.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default Stats;

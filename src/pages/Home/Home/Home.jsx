import React from 'react';
import Banner from '../../../components/Banner/Banner';
import ProductSection from '../../../components/ProductSection/ProductSection';
import Advertisement from '../../../components/Advertisement/Advertisement';
import Features from '../../../components/Features/Features';
import Stats from '../../../components/Stats/Stats';

const Home = () => {
    return (
        <div className="w-full">
            <Banner />
            <ProductSection />
            <Advertisement />
            <Features />
            <Stats />
        </div>
    );
};

export default Home;
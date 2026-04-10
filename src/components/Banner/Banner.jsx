import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';

const Banner = () => {
    const navigate = useNavigate();

    const slides = [
        {
            id: 1,
            image: 'https://media.istockphoto.com/id/1203599923/photo/food-background-with-assortment-of-fresh-organic-vegetables.jpg?s=612x612&w=0&k=20&c=DZy1JMfUBkllwiq1Fm_LXtxA4DMDnExuF40jD8u9Z0Q=',
            title: 'Fresh Produce',
            subtitle: 'Get the finest fresh vegetables and fruits from local farmers',
            cta: 'Shop Now',
            overlay: 'bg-gradient-to-r from-black/70 via-black/50 to-transparent'
        },
        {
            id: 2,
            image: 'https://i.pinimg.com/736x/04/cc/b8/04ccb8c40bb9ae8291c23098c9236634.jpg',
            title: 'Local Market',
            subtitle: 'Connect directly with farmers and get the best prices',
            cta: 'Explore',
            overlay: 'bg-gradient-to-r from-blue-900/70 via-blue-800/50 to-transparent'
        },
        {
            id: 3,
            image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dmVnZXRhYmxlJTIwc2hvcHxlbnwwfHwwfHx8MA%3D%3D',
            title: 'Quality Guaranteed',
            subtitle: 'Premium quality products delivered to your doorstep',
            cta: 'Browse Products',
            overlay: 'bg-gradient-to-r from-green-900/70 via-green-800/50 to-transparent'
        },
        {
            id: 4,
            image: 'https://thumbs.dreamstime.com/b/supermarket-vegetables-18215426.jpg',
            title: 'Best Prices',
            subtitle: 'Affordable prices without compromising on quality',
            cta: 'View All',
            overlay: 'bg-gradient-to-r from-orange-900/70 via-orange-800/50 to-transparent'
        }
    ];

    const handleCTA = () => {
        navigate('/products');
    };

    return (
        <div className="w-full h-96">
            <Swiper
                modules={[Navigation, Pagination, Autoplay, EffectFade]}
                navigation={{
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                }}
                pagination={{
                    el: '.swiper-pagination',
                    clickable: true,
                    dynamicBullets: true,
                }}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                effect="fade"
                fadeEffect={{
                    crossFade: true,
                }}
                speed={1000}
                loop={true}
                className="h-full w-full"
            >
                {slides.map((slide) => (
                    <SwiperSlide key={slide.id} className="h-full">
                        <div className="relative h-full w-full overflow-hidden">
                            {/* Background Image */}
                            <img
                                src={slide.image}
                                alt={slide.title}
                                className="w-full h-full object-cover"
                            />

                            {/* Overlay Gradient */}
                            <div className={`absolute inset-0 ${slide.overlay}`}></div>

                            {/* Content */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4 md:px-8">
                                <motion.div 
                                    className="text-center max-w-2xl"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8 }}
                                >
                                    {/* Title */}
                                    <motion.h1 
                                        className="text-4xl md:text-6xl font-bold mb-4 leading-tight drop-shadow-lg"
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: 0.2 }}
                                    >
                                        {slide.title}
                                    </motion.h1>

                                    {/* Subtitle */}
                                    <motion.p 
                                        className="text-lg md:text-2xl text-gray-200 mb-8 drop-shadow-md"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.6, delay: 0.4 }}
                                    >
                                        {slide.subtitle}
                                    </motion.p>

                                    {/* CTA Button */}
                                    <motion.button
                                        onClick={handleCTA}
                                        className="inline-flex items-center gap-2 bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl group"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.6, delay: 0.6 }}
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        {slide.cta}
                                        <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                                    </motion.button>
                                </motion.div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}

                {/* Navigation Buttons */}
                <div className="swiper-button-prev absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer group"></div>
                <div className="swiper-button-next absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer group"></div>

                {/* Pagination Dots */}
                <div className="swiper-pagination absolute bottom-8 left-1/2 -translate-x-1/2 z-10"></div>
            </Swiper>

            <style jsx>{`
                :global(.swiper-button-prev::after),
                :global(.swiper-button-next::after) {
                    color: white;
                    font-size: 20px;
                }

                :global(.swiper-button-prev:hover::after),
                :global(.swiper-button-next:hover::after) {
                    color: white;
                }

                :global(.swiper-pagination-bullet) {
                    background: rgba(255, 255, 255, 0.5);
                    width: 12px;
                    height: 12px;
                }

                :global(.swiper-pagination-bullet-active) {
                    background: white;
                    width: 32px;
                    border-radius: 6px;
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes fadeInDelay {
                    0% {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    50% {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                :global(.animate-fade-in) {
                    animation: fadeIn 0.8s ease-out;
                }

                :global(.animate-fade-in-delay) {
                    animation: fadeInDelay 1.2s ease-out;
                }
            `}</style>
        </div>
    );
};

export default Banner;

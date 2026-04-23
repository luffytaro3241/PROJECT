import React, { useRef, useEffect, useState } from 'react';

const ParallaxLayer = ({ children, speed = 0.5, className = '' }) => {
    const layerRef = useRef(null);
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            if (!layerRef.current) return;
            const scrollY = window.scrollY;
            const top = layerRef.current.offsetTop;
            const height = layerRef.current.offsetHeight;
            const viewportHeight = window.innerHeight;
            
            // Calculate relative progress of the element in the viewport
            const start = top - viewportHeight;
            const end = top + height;
            
            if (scrollY >= start && scrollY <= end) {
                const progress = (scrollY - start) / (end - start);
                setOffset((progress - 0.5) * speed * 200);
            }
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    window.addEventListener('scroll', handleScroll);
                } else {
                    window.removeEventListener('scroll', handleScroll);
                }
            });
        }, { threshold: 0 });

        if (layerRef.current) {
            observer.observe(layerRef.current);
        }

        return () => {
            observer.disconnect();
            window.removeEventListener('scroll', handleScroll);
        };
    }, [speed]);

    return (
        <div 
            ref={layerRef} 
            className={`parallax-layer ${className}`}
            style={{ 
                transform: `translate3d(0, ${offset}px, 0)`,
                transition: 'transform 0.1s linear'
            }}
        >
            {children}
        </div>
    );
};

export default ParallaxLayer;

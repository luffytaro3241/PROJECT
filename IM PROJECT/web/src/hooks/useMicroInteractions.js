import { useState, useCallback, useEffect, useRef } from 'react';

/**
 * Hook for creating a magnetic cursor effect on elements
 */
export const useMagnetic = (intensity = 0.5) => {
    const ref = useRef(null);
    const [transform, setTransform] = useState({ x: 0, y: 0 });

    const onMouseMove = useCallback((e) => {
        const { clientX, clientY } = e;
        const { left, top, width, height } = ref.current.getBoundingClientRect();
        
        const centerX = left + width / 2;
        const centerY = top + height / 2;
        
        const deltaX = (clientX - centerX) * intensity;
        const deltaY = (clientY - centerY) * intensity;
        
        setTransform({ x: deltaX, y: deltaY });
    }, [intensity]);

    const onMouseLeave = useCallback(() => {
        setTransform({ x: 0, y: 0 });
    }, []);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;
        
        element.addEventListener('mousemove', onMouseMove);
        element.addEventListener('mouseleave', onMouseLeave);
        
        return () => {
            element.removeEventListener('mousemove', onMouseMove);
            element.removeEventListener('mouseleave', onMouseLeave);
        };
    }, [onMouseMove, onMouseLeave]);

    return { ref, style: { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } };
};

/**
 * Hook for creating a ripple feedback system on click
 */
export const useRipple = () => {
    const [ripples, setRipples] = useState([]);

    const createRipple = useCallback((e) => {
        const { clientX, clientY, currentTarget } = e;
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        
        const x = clientX - left;
        const y = clientY - top;
        const size = Math.max(width, height);
        
        const newRipple = {
            id: Date.now(),
            x,
            y,
            size
        };
        
        setRipples(prev => [...prev, newRipple]);
        
        // Remove ripple after animation finishes
        setTimeout(() => {
            setRipples(prev => prev.filter(r => r.id !== newRipple.id));
        }, 600);
    }, []);

    return { ripples, createRipple };
};

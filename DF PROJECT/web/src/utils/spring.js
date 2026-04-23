/**
 * Spring physics-based animation utility
 * Configurable tension (150-250) and friction (15-25)
 */
export class Spring {
    constructor(tension = 170, friction = 20) {
        this.tension = tension;
        this.friction = friction;
        this.currentValue = 0;
        this.targetValue = 0;
        this.velocity = 0;
        this.onUpdate = null;
        this.isAnimating = false;
    }

    setTarget(value) {
        this.targetValue = value;
        if (!this.isAnimating) {
            this.isAnimating = true;
            this.animate();
        }
    }

    animate() {
        if (!this.isAnimating) return;

        const force = this.tension * (this.targetValue - this.currentValue);
        const damping = this.friction * this.velocity;
        const acceleration = force - damping;

        this.velocity += acceleration / 60; // Assuming 60fps
        this.currentValue += this.velocity / 60;

        if (this.onUpdate) {
            this.onUpdate(this.currentValue);
        }

        // Stop if close enough and velocity is low
        if (Math.abs(this.targetValue - this.currentValue) < 0.001 && Math.abs(this.velocity) < 0.001) {
            this.currentValue = this.targetValue;
            this.velocity = 0;
            this.isAnimating = false;
            if (this.onUpdate) this.onUpdate(this.currentValue);
            return;
        }

        requestAnimationFrame(() => this.animate());
    }
}

/**
 * Hook for using spring physics in React components
 */
import { useState, useCallback, useRef } from 'react';

export const useSpring = (initialValue = 0, tension = 170, friction = 20) => {
    const [value, setValue] = useState(initialValue);
    const springRef = useRef(null);

    if (!springRef.current) {
        springRef.current = new Spring(tension, friction);
        springRef.current.currentValue = initialValue;
        springRef.current.targetValue = initialValue;
        springRef.current.onUpdate = setValue;
    }

    const setTarget = useCallback((target) => {
        springRef.current.setTarget(target);
    }, []);

    return [value, setTarget];
};

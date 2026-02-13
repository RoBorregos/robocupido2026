"use client";

import { useEffect, useState, useCallback, useMemo, useId, useRef } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim"; 
import { loadHeartShape } from "@tsparticles/shape-heart";
import type { Container } from "@tsparticles/engine";

// Track if the engine has been initialized globally
let engineInitialized = false;
let engineInitializing = false;
const initPromise: { current: Promise<void> | null } = { current: null };

const HeartParticles = () => {
    const [init, setInit] = useState(engineInitialized);
    const uniqueId = useId();
    const containerRef = useRef<Container | null>(null);
    
    useEffect(() => {
        let isMounted = true;
        
        const initEngine = async () => {
            // If already initialized, just set init to true
            if (engineInitialized) {
                if (isMounted) setInit(true);
                return;
            }
            
            // If currently initializing, wait for it
            if (engineInitializing && initPromise.current) {
                await initPromise.current;
                if (isMounted) setInit(true);
                return;
            }
            
            // Start initialization
            engineInitializing = true;
            initPromise.current = initParticlesEngine(async (engine) => {
                await loadSlim(engine);
                await loadHeartShape(engine); 
            });
            
            try {
                await initPromise.current;
                engineInitialized = true;
                if (isMounted) setInit(true);
            } catch (error) {
                console.error("Error initializing particles:", error);
                engineInitializing = false;
            }
        };
        
        void initEngine();
        
        // Cleanup: destroy the container when component unmounts
        return () => {
            isMounted = false;
            if (containerRef.current) {
                containerRef.current.destroy();
                containerRef.current = null;
            }
        };
    }, []);
    
    // Callback to handle particle container for cleanup
    const particlesLoaded = useCallback(async (container?: Container) => {
        containerRef.current = container ?? null;
    }, []);
    
    // Memoize particle options to prevent unnecessary re-renders
    const particleOptions = useMemo(() => ({
        fpsLimit: 30, // Reduced from 60 for better performance
        interactivity: {
            events: {
                onClick: { enable: false, mode: "push" as const }, // Disabled to prevent infinite particle growth
                onHover: { enable: false, mode: "repulse" as const }, // Disabled for better performance on mobile
            },
            modes: {
                push: { quantity: 2 },
                repulse: { distance: 100, duration: 0.4 },
            },
        },
        particles: {
            color: { value: "#ff4d6d" }, 
            move: {
                enable: true,
                speed: 1,
                direction: "none" as const,
                outModes: { default: "out" as const }, // Changed from "bounce" to "out" - particles exit and are recycled
            },
            number: {
                density: { enable: true, width: 1920, height: 1080 },
                value: 20, // Reduced from 50 for better performance
                limit: { value: 30 }, // Hard limit on max particles
            },
            opacity: { value: 0.6 },
            shape: {
                type: "heart", 
            },
            size: { value: { min: 8, max: 16 } },
            reduceDuplicates: true, // Helps reduce memory usage
        },
        detectRetina: false, // Disabled for better performance on high-DPI screens
        pauseOnOutsideViewport: true, // Pause when not visible
        pauseOnBlur: true, // Pause when window loses focus
    }), []);
    
    if (!init) return null;
    
    return (
        <div className="m-0">
            <Particles
                id={`tsparticles-${uniqueId}`}
                particlesLoaded={particlesLoaded}
                options={particleOptions}
            />
        </div>
    );
};

export default HeartParticles;
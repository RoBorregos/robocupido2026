"use client";

import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim"; 
import { loadHeartShape } from "@tsparticles/shape-heart";

const HeartParticles = () => {
    const [init, setInit] = useState(false);
    
    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
            await loadHeartShape(engine); 
        }).then(() => {
            setInit(true);
        }).catch((error) => {
            console.error("Error initializing particles:", error);
        });
    }, []);
    
    return (
        init && (
            <div className="m-0">
                <Particles
                    id="tsparticles"
                    options={{
                        fpsLimit: 60,
                        interactivity: {
                            events: {
                                onClick: { enable: true, mode: "push" },
                                onHover: { enable: true, mode: "repulse" },
                            },
                            modes: {
                                push: { quantity: 4 },
                                repulse: { distance: 200, duration: 0.4 },
                            },
                        },
                        particles: {
                            color: { value: "#ff4d6d" }, 
                            move: {
                                enable: true,
                                speed: 1.5,
                                direction: "none",
                                outModes: { default: "bounce" },
                            },
                            number: {
                                density: { enable: true },
                                value: 50, 
                            },
                            opacity: { value: 0.8 },
                            shape: {
                                type: "heart", 
                            },
                            size: { value: { min: 10, max: 20 } },
                        },
                        detectRetina: true,
                    }}
                />
            </div>
        )
    );
};

export default HeartParticles;
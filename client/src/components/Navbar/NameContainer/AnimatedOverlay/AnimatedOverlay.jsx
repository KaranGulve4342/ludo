import React, { useMemo } from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';

const AnimatedOverlay = ({ time }) => {
    const animationDelay = useMemo(() => {
        const delay = 15 - Math.ceil((time - Date.now()) / 1000);
        return Math.max(0, delay);
    }, [time]);

    // Calculate animation progress (0 to 1)
    const progress = (15 - animationDelay) / 15;
    
    // Determine color based on time remaining
    const getBackgroundColor = () => {
        if (animationDelay <= 3) return '#ff4444'; // Red for urgency
        if (animationDelay <= 5) return '#ff8800'; // Orange for warning
        return '#4caf50'; // Green for normal
    };

    return (
        <Box
            sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: 'inherit',
                overflow: 'hidden',
                pointerEvents: 'none',
            }}
        >
            <motion.div
                initial={{ scale: 0, opacity: 0.7 }}
                animate={{ 
                    scale: 1,
                    opacity: [0.7, 0.9, 0.7],
                }}
                transition={{
                    duration: 1,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                }}
                style={{
                    width: '100%',
                    height: '100%',
                    background: `conic-gradient(
                        from 0deg,
                        ${getBackgroundColor()}40 ${progress * 360}deg,
                        transparent ${progress * 360}deg
                    )`,
                    borderRadius: 'inherit',
                }}
            />
            
            {/* Pulse effect for urgency */}
            {animationDelay <= 5 && (
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: getBackgroundColor(),
                        borderRadius: 'inherit',
                        mixBlendMode: 'multiply',
                    }}
                />
            )}
        </Box>
    );
};

export default AnimatedOverlay;

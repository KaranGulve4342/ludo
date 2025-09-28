import React from 'react';
import { Box, Backdrop, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import useKeyPress from '../../hooks/useKeyPress';

const Overlay = ({ children, handleOverlayClose }) => {
    useKeyPress('Escape', handleOverlayClose);

    return (
        <AnimatePresence>
            <Backdrop
                open={true}
                onClick={handleOverlayClose}
                sx={{
                    zIndex: 1300,
                    background: 'rgba(0, 0, 0, 0.8)',
                    backdropFilter: 'blur(8px)',
                }}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 50 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <Box position="relative">
                        <IconButton
                            onClick={handleOverlayClose}
                            sx={{
                                position: 'absolute',
                                top: -16,
                                right: -16,
                                background: 'rgba(255, 255, 255, 0.9)',
                                color: 'text.primary',
                                zIndex: 1,
                                '&:hover': {
                                    background: 'rgba(255, 255, 255, 1)',
                                    transform: 'scale(1.1)',
                                },
                                transition: 'all 0.2s ease-in-out',
                                boxShadow: 2,
                            }}
                        >
                            <Close />
                        </IconButton>
                        {children}
                    </Box>
                </motion.div>
            </Backdrop>
        </AnimatePresence>
    );
};

export default Overlay;

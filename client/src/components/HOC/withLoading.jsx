import React from 'react';
import { Box, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';

const withLoading = Component => {
    return function WithLoading({ isLoading, ...props }) {
        if (!isLoading) {
            return <Component {...props} />;
        }
        
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: 200,
                    p: 3,
                }}
            >
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                >
                    <CircularProgress 
                        size={40} 
                        thickness={4}
                        sx={{
                            color: '#667eea',
                            '& .MuiCircularProgress-circle': {
                                strokeLinecap: 'round',
                            },
                        }}
                    />
                </motion.div>
            </Box>
        );
    };
};

export default withLoading;

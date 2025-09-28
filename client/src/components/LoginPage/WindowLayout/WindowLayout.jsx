import React from 'react';
import { Card, CardHeader, CardContent, Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';

const WindowLayout = ({ title, titleComponent, content }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card 
                elevation={3}
                sx={{
                    minWidth: 450,
                    maxWidth: 600,
                    margin: 2,
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                }}
            >
                <CardHeader
                    title={
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                            <Typography 
                                variant="h5" 
                                component="h1"
                                sx={{ 
                                    fontWeight: 600,
                                    background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                {title}
                            </Typography>
                            {titleComponent}
                        </Box>
                    }
                    sx={{
                        pb: 1,
                        '& .MuiCardHeader-content': {
                            overflow: 'visible'
                        }
                    }}
                />
                <CardContent sx={{ pt: 0 }}>
                    {content}
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default WindowLayout;

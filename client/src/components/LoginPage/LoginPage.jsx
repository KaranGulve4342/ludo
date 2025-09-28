import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import AddServer from './AddServer/AddServer';
import JoinServer from './JoinServer/JoinServer';

const LoginPage = () => {
    return (
        <Container maxWidth="xl" sx={{ height: '100vh', display: 'flex', flexDirection: 'column', py: 3 }}>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <Typography
                    variant="h3"
                    component="h1"
                    align="center"
                    sx={{
                        mb: 4,
                        fontWeight: 700,
                        background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    }}
                >
                    🎲 Ludo Game
                </Typography>
            </motion.div>
            
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    justifyContent: 'center',
                    alignItems: { xs: 'center', md: 'flex-start' },
                    gap: 4,
                    flex: 1,
                    maxWidth: '1200px',
                    mx: 'auto',
                    width: '100%',
                }}
            >
                <JoinServer />
                <AddServer />
            </Box>
        </Container>
    );
};

export default LoginPage;

import React, { useEffect, useState, createContext } from 'react';
import { io } from 'socket.io-client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { motion } from 'framer-motion';
import Gameboard from './components/Gameboard/Gameboard';
import LoginPage from './components/LoginPage/LoginPage';
import theme from './theme/theme';

export const PlayerDataContext = createContext();
export const SocketContext = createContext();

function App() {
    const [playerData, setPlayerData] = useState();
    const [playerSocket, setPlayerSocket] = useState();
    const [redirect, setRedirect] = useState();
    useEffect(() => {
        const socket = io(`http://${window.location.hostname}:8080`, { withCredentials: true });
        socket.on('player:data', data => {
            data = JSON.parse(data);
            setPlayerData(data);
            if (data.roomId != null) {
                setRedirect(true);
            }
        });
        setPlayerSocket(socket);
    }, []);

    const LoadingScreen = () => (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                gap: 3,
            }}
        >
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
                <CircularProgress 
                    size={60} 
                    thickness={4}
                    sx={{
                        color: '#fff',
                        '& .MuiCircularProgress-circle': {
                            strokeLinecap: 'round',
                        },
                    }}
                />
            </motion.div>
            <Typography 
                variant="h6" 
                sx={{ 
                    color: '#fff', 
                    textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                    fontWeight: 500,
                }}
            >
                Connecting to game server...
            </Typography>
        </Box>
    );

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <SocketContext.Provider value={playerSocket}>
                <Router>
                    <Routes>
                        <Route
                            exact
                            path='/'
                            Component={() => {
                                if (redirect) {
                                    return <Navigate to='/game' />;
                                } else if (playerSocket) {
                                    return <LoginPage />;
                                } else {
                                    return <LoadingScreen />;
                                }
                            }}
                        ></Route>
                        <Route
                            path='/login'
                            Component={() => {
                                if (redirect) {
                                    return <Navigate to='/game' />;
                                } else if (playerSocket) {
                                    return <LoginPage />;
                                } else {
                                    return <LoadingScreen />;
                                }
                            }}
                        ></Route>
                        <Route
                            path='/game'
                            Component={() => {
                                if (playerData) {
                                    return (
                                        <PlayerDataContext.Provider value={playerData}>
                                            <Gameboard />
                                        </PlayerDataContext.Provider>
                                    );
                                } else {
                                    return <Navigate to='/login' />;
                                }
                            }}
                        ></Route>
                    </Routes>
                </Router>
            </SocketContext.Provider>
        </ThemeProvider>
    );
}

export default App;

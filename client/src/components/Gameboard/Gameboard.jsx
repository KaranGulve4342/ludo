import React, { useState, useEffect, useContext } from 'react';
import { Container, Box, Paper, Typography, Dialog, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { PlayerDataContext, SocketContext } from '../../App';
import useSocketData from '../../hooks/useSocketData';
import Map from './Map/Map';
import Navbar from '../Navbar/Navbar';
import trophyImage from '../../images/trophy.webp';

const Gameboard = () => {
    const socket = useContext(SocketContext);
    const context = useContext(PlayerDataContext);
    const [pawns, setPawns] = useState([]);
    const [players, setPlayers] = useState([]);

    const [rolledNumber, setRolledNumber] = useSocketData('game:roll');
    const [time, setTime] = useState();
    const [isReady, setIsReady] = useState();
    const [nowMoving, setNowMoving] = useState(false);
    const [started, setStarted] = useState(false);

    const [movingPlayer, setMovingPlayer] = useState('red');

    const [winner, setWinner] = useState(null);

    useEffect(() => {
        socket.emit('room:data', context.roomId);
        socket.on('room:data', data => {
            data = JSON.parse(data);
            if (data.players == null) return;
            // Filling navbar with empty player nick container
            while (data.players.length !== 4) {
                data.players.push({ name: '...' });
            }
            // Checks if client is currently moving player by session ID
            const nowMovingPlayer = data.players.find(player => player.nowMoving === true);
            if (nowMovingPlayer) {
                if (nowMovingPlayer._id === context.playerId) {
                    setNowMoving(true);
                } else {
                    setNowMoving(false);
                }
                setMovingPlayer(nowMovingPlayer.color);
            }
            const currentPlayer = data.players.find(player => player._id === context.playerId);
            setIsReady(currentPlayer.ready);
            setRolledNumber(data.rolledNumber);
            setPlayers(data.players);
            setPawns(data.pawns);
            setTime(data.nextMoveTime);
            setStarted(data.started);
        });

        socket.on('game:winner', winner => {
            setWinner(winner);
        });
        socket.on('redirect', () => {
            window.location.reload();
        });

    }, [socket, context.playerId, context.roomId, setRolledNumber]);

    const WinnerDialog = () => (
        <Dialog 
            open={winner !== null} 
            maxWidth="sm" 
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#fff',
                    textAlign: 'center',
                    p: 2,
                },
            }}
        >
            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: "backOut" }}
                style={{ padding: '2rem' }}
            >
                <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
                    <motion.img
                        src={trophyImage}
                        alt='winner'
                        style={{ width: 120, height: 120 }}
                        animate={{ rotate: [0, -10, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                    <Typography variant="h3" sx={{ fontWeight: 700, textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
                        🎉 Winner! 🎉
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        1st Place: <span style={{ 
                            color: '#fff', 
                            textShadow: `2px 2px 4px ${winner}`,
                            fontWeight: 700 
                        }}>
                            {winner}
                        </span>
                    </Typography>
                    <motion.button
                        onClick={() => socket.emit('player:exit')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                            background: '#fff',
                            color: '#667eea',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '12px 24px',
                            fontSize: '1rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            marginTop: '1rem',
                        }}
                    >
                        Play Again
                    </motion.button>
                </Box>
            </motion.div>
        </Dialog>
    );

    return (
        <Container maxWidth="xl" sx={{ height: '100vh', py: 2 }}>
            {pawns.length === 16 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%',
                            gap: 2,
                        }}
                    >
                        <Navbar
                            players={players}
                            started={started}
                            time={time}
                            isReady={isReady}
                            movingPlayer={movingPlayer}
                            rolledNumber={rolledNumber}
                            nowMoving={nowMoving}
                            ended={winner !== null}
                        />
                        
                        <Box
                            sx={{
                                flex: 1,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Paper
                                elevation={4}
                                sx={{
                                    p: 2,
                                    borderRadius: 3,
                                    background: 'rgba(255, 255, 255, 0.95)',
                                    backdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(255, 255, 255, 0.3)',
                                }}
                            >
                                <Map pawns={pawns} nowMoving={nowMoving} rolledNumber={rolledNumber} />
                            </Paper>
                        </Box>
                    </Box>
                </motion.div>
            ) : (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100vh',
                        flexDirection: 'column',
                        gap: 3,
                    }}
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                        <CircularProgress 
                            size={80} 
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
                        Loading game board...
                    </Typography>
                </Box>
            )}
            
            <WinnerDialog />
        </Container>
    );
};

export default Gameboard;

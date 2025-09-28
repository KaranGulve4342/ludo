import React, { useContext } from 'react';
import { Box, IconButton, Chip } from '@mui/material';
import { CasinoOutlined } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { SocketContext } from '../../../App';
import images from '../../../constants/diceImages';

const Dice = ({ rolledNumber, nowMoving, playerColor, movingPlayer }) => {
    const socket = useContext(SocketContext);

    const handleClick = () => {
        socket.emit('game:roll');
    };

    const isCurrentPlayer = movingPlayer === playerColor;
    const hasRolledNumber = rolledNumber !== null && rolledNumber !== undefined;

    if (!isCurrentPlayer) {
        return null;
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1,
                mt: 1,
            }}
        >
            <AnimatePresence mode="wait">
                {hasRolledNumber ? (
                    <motion.div
                        key="dice-result"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        transition={{ duration: 0.5, ease: "backOut" }}
                    >
                        <Box
                            sx={{
                                width: 60,
                                height: 60,
                                borderRadius: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: 'linear-gradient(135deg, #fff 0%, #f5f5f5 100%)',
                                border: '2px solid #e0e0e0',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            }}
                        >
                            <img 
                                src={images[rolledNumber - 1]} 
                                alt={`dice-${rolledNumber}`}
                                style={{ width: '40px', height: '40px' }}
                            />
                        </Box>
                    </motion.div>
                ) : nowMoving ? (
                    <motion.div
                        key="dice-button"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                    >
                        <IconButton
                            onClick={handleClick}
                            sx={{
                                width: 60,
                                height: 60,
                                background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                                color: '#fff',
                                border: '3px solid rgba(255, 255, 255, 0.3)',
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)',
                                    transform: 'rotate(10deg)',
                                },
                                transition: 'all 0.3s ease-in-out',
                                boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
                            }}
                        >
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                                <CasinoOutlined sx={{ fontSize: 28 }} />
                            </motion.div>
                        </IconButton>
                    </motion.div>
                ) : null}
            </AnimatePresence>

            {isCurrentPlayer && (
                <Chip
                    label={hasRolledNumber ? `Rolled ${rolledNumber}` : "Click to Roll"}
                    size="small"
                    color={hasRolledNumber ? "success" : "primary"}
                    variant={hasRolledNumber ? "filled" : "outlined"}
                    sx={{
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        animation: nowMoving && !hasRolledNumber ? 'pulse 1.5s infinite' : 'none',
                        '@keyframes pulse': {
                            '0%': { opacity: 1 },
                            '50%': { opacity: 0.7 },
                            '100%': { opacity: 1 },
                        },
                    }}
                />
            )}
        </Box>
    );
};

export default Dice;

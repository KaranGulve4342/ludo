import React, { useState, useContext, useEffect } from 'react';
import {
    Box,
    TextField,
    Button,
    Alert,
    Typography,
    InputAdornment,
    Paper
} from '@mui/material';
import { Person, Lock, Login } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { SocketContext } from '../../../App';
import useInput from '../../../hooks/useInput';
import useKeyPress from '../../../hooks/useKeyPress';

const NameInput = ({ isRoomPrivate, roomId }) => {
    const socket = useContext(SocketContext);
    const nickname = useInput('');
    const password = useInput('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleButtonClick = () => {
        if (!nickname.value.trim()) {
            setError('Please enter a nickname');
            return;
        }
        
        if (isRoomPrivate && !password.value.trim()) {
            setError('Password is required for private rooms');
            return;
        }
        
        setError('');
        setIsLoading(true);
        socket.emit('player:login', { 
            name: nickname.value.trim(), 
            password: password.value.trim(), 
            roomId: roomId 
        });
    };

    useKeyPress('Enter', handleButtonClick);

    useEffect(() => {
        socket.on('error:wrongPassword', () => {
            setError('Incorrect password. Please try again.');
            setIsLoading(false);
        });
        
        socket.on('error:roomFull', () => {
            setError('Room is full. Please try another room.');
            setIsLoading(false);
        });
        
        socket.on('error:nicknameInUse', () => {
            setError('Nickname already in use. Please choose another.');
            setIsLoading(false);
        });

        return () => {
            socket.off('error:wrongPassword');
            socket.off('error:roomFull');
            socket.off('error:nicknameInUse');
        };
    }, [socket]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
        >
            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    minWidth: 350,
                    maxWidth: 400,
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: 3,
                }}
            >
                <Typography 
                    variant="h6" 
                    align="center" 
                    gutterBottom
                    sx={{
                        background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontWeight: 600,
                        mb: 3,
                    }}
                >
                    Join Game Room
                </Typography>

                <Box 
                    component="form" 
                    onSubmit={(e) => { e.preventDefault(); handleButtonClick(); }}
                    sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: 2.5
                    }}
                >
                    {error && (
                        <Alert severity="error" sx={{ borderRadius: 2 }}>
                            {error}
                        </Alert>
                    )}
                    
                    <TextField
                        label="Nickname"
                        variant="outlined"
                        fullWidth
                        required
                        placeholder="Enter your game nickname"
                        {...nickname}
                        disabled={isLoading}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Person color="primary" />
                                </InputAdornment>
                            ),
                        }}
                    />

                    {isRoomPrivate && (
                        <TextField
                            label="Room Password"
                            type="password"
                            variant="outlined"
                            fullWidth
                            required
                            placeholder="Enter room password"
                            {...password}
                            disabled={isLoading}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock color="primary" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    )}

                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        fullWidth
                        disabled={isLoading}
                        startIcon={<Login />}
                        sx={{
                            py: 1.5,
                            fontSize: '1rem',
                            fontWeight: 600,
                            mt: 1,
                        }}
                    >
                        {isLoading ? 'Joining...' : 'Join Game'}
                    </Button>
                </Box>
            </Paper>
        </motion.div>
    );
};

export default NameInput;

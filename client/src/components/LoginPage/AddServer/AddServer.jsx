import React, { useState, useContext } from 'react';
import {
    TextField,
    Switch,
    FormControlLabel,
    Button,
    Box,
    Alert,
    Typography,
    InputAdornment
} from '@mui/material';
import { Lock, LockOpen, Add } from '@mui/icons-material';
import { SocketContext } from '../../../App';
import WindowLayout from '../WindowLayout/WindowLayout';
import useInput from '../../../hooks/useInput';

const AddServer = () => {
    const socket = useContext(SocketContext);
    const [isPrivate, setIsPrivate] = useState(false);
    const [error, setError] = useState('');
    const serverName = useInput('');
    const password = useInput('');

    const handleButtonClick = e => {
        e.preventDefault();
        
        if (!serverName.value.trim()) {
            setError('Server name is required');
            return;
        }
        
        if (isPrivate && !password.value.trim()) {
            setError('Password is required for private servers');
            return;
        }
        
        setError('');
        socket.emit('room:create', {
            name: serverName.value.trim(),
            password: password.value.trim(),
            private: isPrivate,
        });
    };

    return (
        <WindowLayout
            title='Host A Server'
            content={
                <Box 
                    component="form" 
                    onSubmit={handleButtonClick}
                    sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: 3,
                        minWidth: 300
                    }}
                >
                    {error && (
                        <Alert severity="error" sx={{ borderRadius: 2 }}>
                            {error}
                        </Alert>
                    )}
                    
                    <TextField
                        label="Server Name"
                        variant="outlined"
                        fullWidth
                        required
                        placeholder="Enter a unique server name"
                        {...serverName}
                        error={error.includes('Server name')}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Add color="primary" />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <FormControlLabel
                        control={
                            <Switch
                                checked={isPrivate}
                                onChange={(e) => setIsPrivate(e.target.checked)}
                                color="primary"
                            />
                        }
                        label={
                            <Box display="flex" alignItems="center" gap={1}>
                                {isPrivate ? <Lock fontSize="small" /> : <LockOpen fontSize="small" />}
                                <Typography variant="body2">
                                    {isPrivate ? 'Private Server' : 'Public Server'}
                                </Typography>
                            </Box>
                        }
                    />

                    <TextField
                        label="Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        disabled={!isPrivate}
                        placeholder={isPrivate ? "Enter server password" : "Set server to private first"}
                        {...password}
                        error={error.includes('Password')}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Lock color={isPrivate ? "primary" : "disabled"} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                opacity: isPrivate ? 1 : 0.6,
                            }
                        }}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        fullWidth
                        sx={{
                            py: 1.5,
                            fontSize: '1rem',
                            fontWeight: 600,
                            mt: 1,
                        }}
                    >
                        Host Server
                    </Button>
                </Box>
            }
        />
    );
};

export default AddServer;

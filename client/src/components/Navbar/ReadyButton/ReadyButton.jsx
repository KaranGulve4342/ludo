import React, { useState, useContext } from 'react';
import { Box, FormControlLabel, Switch, Typography } from '@mui/material';
import { PlayArrow, Schedule } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { SocketContext } from '../../../App';

const ReadyButton = ({ isReady }) => {
    const socket = useContext(SocketContext);
    const [checked, setChecked] = useState(isReady);

    const handleCheckboxChange = () => {
        socket.emit('player:ready');
        setChecked(!checked);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 1,
                    mt: 1,
                }}
            >
                <FormControlLabel
                    control={
                        <Switch
                            checked={checked || false}
                            onChange={handleCheckboxChange}
                            color="primary"
                            size="small"
                        />
                    }
                    label={
                        <Box display="flex" alignItems="center" gap={0.5}>
                            {checked ? (
                                <PlayArrow sx={{ fontSize: 16, color: 'success.main' }} />
                            ) : (
                                <Schedule sx={{ fontSize: 16, color: 'text.secondary' }} />
                            )}
                            <Typography
                                variant="caption"
                                sx={{
                                    fontSize: '0.75rem',
                                    fontWeight: 500,
                                    color: checked ? 'success.main' : 'text.secondary',
                                }}
                            >
                                {checked ? "Ready to Play" : "Not Ready"}
                            </Typography>
                        </Box>
                    }
                    labelPlacement="bottom"
                    sx={{
                        margin: 0,
                        '& .MuiFormControlLabel-label': {
                            mt: 0.5,
                        },
                    }}
                />
            </Box>
        </motion.div>
    );
};

export default ReadyButton;

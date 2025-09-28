import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Chip, Avatar } from '@mui/material';
import { Person, Timer } from '@mui/icons-material';
import { motion } from 'framer-motion';
import AnimatedOverlay from './AnimatedOverlay/AnimatedOverlay';

const NameContainer = ({ player, time }) => {
    const getPlayerColor = (color) => {
        const colorMap = {
            red: '#ef5350',
            blue: '#42a5f5',
            green: '#66bb6a',
            yellow: '#ffca28',
        };
        return colorMap[color] || '#718096';
    };

    const playerColor = getPlayerColor(player.color);

    return (
        <Box position="relative" width="100%">
            <motion.div
                animate={player.nowMoving ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 1, repeat: player.nowMoving ? Infinity : 0 }}
            >
                <Box
                    sx={{
                        p: 1.5,
                        borderRadius: 2,
                        background: player.ready 
                            ? `linear-gradient(135deg, ${playerColor}90 0%, ${playerColor}70 100%)`
                            : 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
                        border: `2px solid ${player.ready ? playerColor : '#bdbdbd'}`,
                        position: 'relative',
                        overflow: 'hidden',
                        transition: 'all 0.3s ease-in-out',
                    }}
                >
                    <Box display="flex" alignItems="center" gap={1} justifyContent="center">
                        <Avatar 
                            sx={{ 
                                width: 24, 
                                height: 24, 
                                bgcolor: player.ready ? playerColor : '#9e9e9e',
                                fontSize: '0.75rem'
                            }}
                        >
                            {player.name ? player.name.charAt(0).toUpperCase() : <Person />}
                        </Avatar>
                        
                        <Typography
                            variant="body2"
                            sx={{
                                fontWeight: 600,
                                color: player.ready ? '#fff' : '#666',
                                textShadow: player.ready ? '0 1px 2px rgba(0,0,0,0.3)' : 'none',
                                fontSize: '0.85rem',
                            }}
                        >
                            {player.name || 'Waiting...'}
                        </Typography>
                    </Box>

                    {player.ready && (
                        <Chip
                            label="Ready"
                            size="small"
                            sx={{
                                position: 'absolute',
                                top: -8,
                                right: -8,
                                background: '#4caf50',
                                color: '#fff',
                                fontSize: '0.6rem',
                                height: 16,
                                '& .MuiChip-label': {
                                    px: 0.5,
                                },
                            }}
                        />
                    )}

                    {player.nowMoving && (
                        <>
                            <AnimatedOverlay time={time} />
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 4,
                                    left: 4,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                    background: 'rgba(0,0,0,0.6)',
                                    color: '#fff',
                                    borderRadius: 1,
                                    px: 0.5,
                                    py: 0.25,
                                }}
                            >
                                <Timer sx={{ fontSize: 12 }} />
                                <Typography variant="caption" sx={{ fontSize: '0.65rem', fontWeight: 600 }}>
                                    {time}s
                                </Typography>
                            </Box>
                        </>
                    )}
                </Box>
            </motion.div>
        </Box>
    );
};

NameContainer.propTypes = {
    player: PropTypes.object,
    time: PropTypes.number,
    testId: PropTypes.string,
};

export default NameContainer;

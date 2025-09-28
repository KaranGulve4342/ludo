import React, { useContext } from 'react';
import { Box, Paper, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import Dice from './Dice/Dice';
import NameContainer from './NameContainer/NameContainer';
import ReadyButton from './ReadyButton/ReadyButton';
import { PLAYER_COLORS } from '../../constants/colors';
import { PlayerDataContext } from '../../App';

const Navbar = ({ players, started, time, isReady, rolledNumber, nowMoving, movingPlayer, ended }) => {
    const context = useContext(PlayerDataContext);

    const diceProps = {
        rolledNumber,
        nowMoving,
        movingPlayer,
    };

    const getPlayerContainerColor = (colorName) => {
        const colorMap = {
            red: '#ef5350',
            blue: '#42a5f5',
            green: '#66bb6a',
            yellow: '#ffca28',
        };
        return colorMap[colorName] || '#718096';
    };

    return (
        <Paper
            elevation={2}
            sx={{
                p: 2,
                m: 1,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: 3,
            }}
        >
            <Grid container spacing={2} justifyContent="center">
                {players.map((player, index) => {
                    const colorName = PLAYER_COLORS[index];
                    const playerColor = getPlayerContainerColor(colorName);
                    
                    return (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                                <Paper
                                    elevation={1}
                                    sx={{
                                        p: 2,
                                        textAlign: 'center',
                                        background: `linear-gradient(135deg, ${playerColor}20 0%, ${playerColor}10 100%)`,
                                        border: `2px solid ${playerColor}40`,
                                        borderRadius: 2,
                                        transition: 'all 0.3s ease-in-out',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: `0 8px 25px ${playerColor}30`,
                                        },
                                    }}
                                >
                                    <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                                        <NameContainer player={player} time={time} />
                                        
                                        {started && !ended && (
                                            <Dice playerColor={colorName} {...diceProps} />
                                        )}
                                        
                                        {context.color === player.color && !started && (
                                            <ReadyButton isReady={isReady} />
                                        )}
                                    </Box>
                                </Paper>
                            </motion.div>
                        </Grid>
                    );
                })}
            </Grid>
        </Paper>
    );
};

export default Navbar;

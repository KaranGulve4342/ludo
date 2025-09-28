import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Chip,
    Typography,
    Box,
} from '@mui/material';
import { Lock, People, Schedule, PlayArrow } from '@mui/icons-material';
import { motion } from 'framer-motion';

const ServerListTable = ({ rooms, handleJoinClick }) => {
    const getStatusChip = (room) => {
        if (room.isStarted) {
            return (
                <Chip 
                    label="In Progress" 
                    color="warning" 
                    size="small" 
                    icon={<PlayArrow />}
                />
            );
        }
        return (
            <Chip 
                label="Waiting" 
                color="success" 
                size="small" 
                icon={<Schedule />}
            />
        );
    };

    if (!rooms || rooms.length === 0) {
        return (
            <Box 
                display="flex" 
                justifyContent="center" 
                alignItems="center" 
                minHeight={200}
                flexDirection="column"
                gap={2}
            >
                <People sx={{ fontSize: 48, color: 'text.secondary' }} />
                <Typography variant="h6" color="text.secondary">
                    No servers available
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Create a new server or refresh to check again
                </Typography>
            </Box>
        );
    }

    const availableRooms = rooms.filter(room => !room.started);

    return (
        <TableContainer component={Paper} elevation={0} sx={{ maxHeight: 400 }}>
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell width={50}></TableCell>
                        <TableCell>
                            <Typography variant="subtitle2" fontWeight={600}>
                                Server Name
                            </Typography>
                        </TableCell>
                        <TableCell align="center">
                            <Typography variant="subtitle2" fontWeight={600}>
                                Players
                            </Typography>
                        </TableCell>
                        <TableCell align="center">
                            <Typography variant="subtitle2" fontWeight={600}>
                                Status
                            </Typography>
                        </TableCell>
                        <TableCell align="right" width={100}></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {availableRooms.map((room, index) => (
                        <motion.tr
                            key={room._id || index}
                            component={TableRow}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            sx={{
                                '&:hover': {
                                    backgroundColor: 'rgba(102, 126, 234, 0.04)',
                                },
                                cursor: 'pointer'
                            }}
                        >
                            <TableCell>
                                {room.private && (
                                    <Lock 
                                        sx={{ 
                                            fontSize: 18, 
                                            color: 'warning.main',
                                        }} 
                                    />
                                )}
                            </TableCell>
                            <TableCell>
                                <Typography variant="body2" fontWeight={500}>
                                    {room.name}
                                </Typography>
                            </TableCell>
                            <TableCell align="center">
                                <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
                                    <People sx={{ fontSize: 16, color: 'text.secondary' }} />
                                    <Typography variant="body2">
                                        {room.players.length}/4
                                    </Typography>
                                </Box>
                            </TableCell>
                            <TableCell align="center">
                                {getStatusChip(room)}
                            </TableCell>
                            <TableCell align="right">
                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={() => handleJoinClick(room)}
                                    disabled={room.players.length >= 4 || room.isStarted}
                                    sx={{
                                        minWidth: 70,
                                        fontSize: '0.75rem',
                                    }}
                                >
                                    Join
                                </Button>
                            </TableCell>
                        </motion.tr>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ServerListTable;

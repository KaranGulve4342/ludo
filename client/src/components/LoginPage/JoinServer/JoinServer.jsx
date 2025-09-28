import React, { useContext, useEffect, useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { SocketContext } from '../../../App';
import NameInput from '../NameInput/NameInput';
import Overlay from '../../Overlay/Overlay';
import WindowLayout from '../WindowLayout/WindowLayout';
import ServersTable from './ServersTable/ServersTable';
import withLoading from '../../HOC/withLoading';
import useSocketData from '../../../hooks/useSocketData';

const JoinServer = () => {
    const socket = useContext(SocketContext);
    const [rooms, setRooms] = useSocketData('room:rooms');

    const [joining, setJoining] = useState(false);
    const [clickedRoom, setClickedRoom] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        socket.emit('room:rooms');
        socket.on('room:rooms', () => {
            setIsLoading(false);
        });
    }, [socket]);

    const getRooms = () => {
        setRooms([]);
        setIsLoading(true);
        socket.emit('room:rooms');
    };

    const handleJoinClick = room => {
        setClickedRoom(room);
        setJoining(true);
    };

    const ServersTableWithLoading = withLoading(ServersTable);

    return (
        <>
            <WindowLayout
                title='Join A Server'
                titleComponent={
                    <Tooltip title="Refresh servers" arrow>
                        <IconButton 
                            onClick={getRooms} 
                            color="primary"
                            size="small"
                            sx={{
                                background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                                color: '#fff',
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)',
                                    transform: 'rotate(180deg)',
                                },
                                transition: 'all 0.3s ease-in-out',
                            }}
                        >
                            <Refresh />
                        </IconButton>
                    </Tooltip>
                }
                content={
                    <ServersTableWithLoading
                        isLoading={isLoading}
                        rooms={rooms}
                        handleJoinClick={handleJoinClick}
                    />
                }
            />
            {joining && (
                <Overlay handleOverlayClose={() => setJoining(false)}>
                    <NameInput roomId={clickedRoom._id} isRoomPrivate={clickedRoom.private} />
                </Overlay>
            )}
        </>
    );
};

export default JoinServer;

import { useRef, useEffect } from 'react';
import { io } from 'socket.io-client';

const ENDPOINT = 'http://localhost:5000';

const useSocket = (events) => {
    const socket = useRef(null);

    useEffect(() => {
        // Only establish connection once on mount
        if (!socket.current) {
            socket.current = io(ENDPOINT, {
                transports: ['websocket'], // Forces WebSocket transport to avoid fallback
            });

            for (const [event, handler] of Object.entries(events)) {
                socket.current.on(event, handler);
            }
        }

        return () => {
            if (socket.current) {
                for (const event of Object.keys(events)) {
                    socket.current.off(event);
                }
                socket.current.disconnect();
            }
        };
    }, [events]);

    return socket;
};

export default useSocket;

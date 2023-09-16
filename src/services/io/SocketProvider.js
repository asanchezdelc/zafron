import React, { createContext, useContext, useEffect, useReducer } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();
const CHANNEL = 'device-data';
const URL = process.env.REACT_APP_API_URL || 'ws://localhost:3000';

const socketReducer = (state, action) => {
    switch (action.type) {
        case CHANNEL:
            // Process and return the new state
            return { ...state, eventData: action.payload };
        // Add more cases for other actions as needed
        default:
            return state;
    }
};

const SocketProvider = ({ children }) => {
    const [state, dispatch] = useReducer(socketReducer, { eventData: null });
    const socket = io(`${URL}?token=${localStorage.getItem('jwt')}`, { /* your options here */ });

    useEffect(() => {
        socket.on(CHANNEL, (data) => {
            console.log(data);
            dispatch({ type: CHANNEL, payload: data });
        });

        return () => {
            socket.off(CHANNEL);
            socket.disconnect();
        };
    }, [socket]);

    const sendEvent = (eventName, data) => {
        socket.emit(eventName, data);
    };

    return (
        <SocketContext.Provider value={{ socketData: state.eventData, sendEvent }}>
            {children}
        </SocketContext.Provider>
    );
};

// Custom hook to use the socket context
const useSocket = () => {
    const context = useContext(SocketContext);
    if (context === undefined) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};

export { SocketProvider, useSocket };

import io from 'socket.io-client';

let socket = null;

export const initializeSocket = () => {
        socket = io(import.meta.env.VITE_SOCKETURL, {
            // auth: {
            //     token: token,
            //     state: params,
            // },
            secure: true,
            rejectUnauthorized: false, 
        });
};

export const getSocket = () => {
    return socket;
};

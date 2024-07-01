// types.d.ts
import { Socket as DefaultSocket } from 'socket.io';

declare module 'socket.io' {
    interface Socket extends DefaultSocket {
        user_id: string; // Replace 'any' with your user type if you have one
    }
}
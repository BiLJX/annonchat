import { createContext, useContext, useEffect, useState } from "react";
import { Peer } from "peerjs"
import { useSocket } from "./socket.context";
import { CallMatchEvents, SocketCallEvents } from "@shared/sockets/socketEvents.type";
import { Socket } from "socket.io-client";


let temp: any = null;
export const PeerContext = createContext<Peer|null|undefined>(temp);

export default function PeerContextProvider({ children }: { children: React.ReactNode }) {
    const [peer, setPeer] = useState<Peer>();
    const socket = useSocket() as Socket<CallMatchEvents.TServerToClients, CallMatchEvents.TClientToServer>;
    useEffect(() => {
        if(!socket) return;
        const _peer = new Peer();
        _peer.on("open", id => {
            setPeer(_peer);
            socket.emit(SocketCallEvents.PEER_ID, id);
        })
        return (() => {
            peer?.destroy();
            peer?.disconnect();
        })
    }, [socket])
    // if (!peer) {
    //     console.log("Hey");
    //     return;
    // };
    return (
        <PeerContext.Provider value={peer} >
            {children}
        </PeerContext.Provider>
    )
}

export const usePeer = () => useContext(PeerContext);
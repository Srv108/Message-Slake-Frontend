import { createContext, useEffect, useRef, useState } from 'react';

import { peerConnectionConfig } from '@/api/webrtc/peerConnectionConfig';
import { useGetUserMedia } from '@/hooks/context/useGetUserMedia';
import { useSocket } from '@/hooks/context/useSocket';

const WebRtcContext = createContext();

export const WebRtcProvider = ({ children }) => {

    const peerConnectionRef = useRef(new RTCPeerConnection(peerConnectionConfig));
    const { socket } = useSocket();
    const { stream , remoteVideoRef } = useGetUserMedia();
    const [ isCallActive, setIsCallActive ] = useState(false);


    useEffect(() => {
        const peerConnection = peerConnectionRef.current;
        if (stream) {
            stream.getTracks().forEach((track) => {
                if (!peerConnection.getSenders().some(sender => sender.track === track)) {
                    peerConnection.addTrack(track, stream);
                }
            });
        }
    },[stream]);


    const peerConnection = peerConnectionRef.current;

    /* event listners for ice candidates */
    peerConnection.onicecandidate = (event) => {
        if(event.candidate){
            socket.emit('ice-candidate',event.candidate);
        }
    };
    
    peerConnection.ontrack = (event) => {
        if(remoteVideoRef.current){
            remoteVideoRef.current.srcObject = event.streams[0];
            setIsCallActive(true); 
        }
    };

    /* listen for webrtc offers */

    socket.on('offer', async(offer) => {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        socket.emit('answer',answer);
        setIsCallActive(true); 
    });

    /* listen for webrtc answer */
    socket.on('answer', async(answer) => {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
        setIsCallActive(true); 
    });

    /* listen for ice-candidate for connection estabilishment */
    socket.on('ice-candidate', async(candidate) => {
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    });

    
    const createOffer = async() => {
        const peerConnection = peerConnectionRef.current;
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        socket.emit('offer', offer);
    };
    
    const endCall = () => {
        const peerConnection = peerConnectionRef.current;
        peerConnection.close();
        peerConnectionRef.current = new RTCPeerConnection(peerConnectionConfig); // Reset connection
        setIsCallActive(false);
        socket.emit('call-ended'); // Notify the other peer (optional)
    };

    

    return (
        <WebRtcContext.Provider value={{ 
            peerConnection: peerConnectionRef.current,
            createOffer,
            endCall,
            isCallActive,
            setIsCallActive
        }} >
            { children }
        </WebRtcContext.Provider>
    );
};

export default WebRtcContext;
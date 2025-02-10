import { createContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useSocket } from '@/hooks/context/useSocket';


const UserMediaContext = createContext();

export const UserMediaProvider = ({ children }) => {

    const navigate = useNavigate();
    const { socket } = useSocket();

    const [ stream, setStream ] = useState(null);
    const [ isCameraOn, setIsCameraOn ] = useState(true);
    const [ isMuted, setIsMuted ] = useState(false);


    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

    const toggleMute = () => {
        if(stream){
            stream.getAudioTracks().forEach(track => {
                track.enabled = !isMuted;
            });
            setIsMuted(!isMuted);
            socket.emit('toggle-mic',{ muted: !isMuted});
        }
    };

    const toggleCamera = () => {
        if(stream){
            stream.getVideoTracks().forEach(track => {
                track.enabled = !isCameraOn;
            });
            setIsCameraOn(!isCameraOn);
            socket.emit('toggle-camera',{ muted: !isCameraOn});
        }
    };

    const openMediaDevices = async () => {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
            video: true, 
            audio: true 
        });
        setStream(mediaStream);
        if (localVideoRef.current) {
            localVideoRef.current.srcObject = mediaStream;
        }

    };

    const stopMediaDevices = () => {
        if(stream){
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        navigate(-1);
    };

    useEffect(() => {
        openMediaDevices();

        return () => stream?.getTracks().forEach(track => track.stop());
    },[]);

    return (
        <UserMediaContext.Provider value={{
            localVideoRef,
            remoteVideoRef,
            stream,
            setStream,
            isCameraOn,
            setIsCameraOn,
            isMuted,
            setIsMuted,
            toggleCamera,
            toggleMute,
            stopMediaDevices,
            openMediaDevices,
        }} >
            { children }
        </UserMediaContext.Provider>
    );
};
export default UserMediaContext;
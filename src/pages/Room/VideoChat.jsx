import { CameraIcon, CameraOffIcon, Volume2Icon, VolumeOffIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export const VideoChat = () => {

    const remoteVideoRef = useRef(null);
    const localVideoRef = useRef(null);

    const [isMuted, setIsMuted] = useState(false);
    const [isCameraOn, setIsCameraOn] = useState(true);
    const [ stream, setStream ] = useState(null);
    
    const toggleMute = () => {
        if(stream){
            stream.getAudioTracks().forEach(track => {
                track.enabled = !isMuted;
            });
            setIsMuted(!isMuted);
        }
    };

    const toggleCamera = () => {
        if(stream){
            stream.getVideoTracks().forEach(track => {
                track.enabled = !isCameraOn;
            });
            setIsCameraOn(!isCameraOn);
        }
    };

    const openMediaDevices = async () => {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
            video: true, 
            audio: true 
        });
        console.log('mediaStream',mediaStream);
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
    };

    useEffect(() => {
        openMediaDevices();

        return () => stopMediaDevices();
    },[]);


    return (
        <div className="flex flex-col h-screen bg-gray-900 text-white">
            
            <div className="flex-1 flex items-center justify-center p-4">
                <div className="relative w-full max-w-6xl aspect-video bg-black rounded-lg overflow-hidden">

                    <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full" />

                    <div className="absolute bottom-4 right-4 w-64 h-48 bg-gray-800 rounded-md overflow-hidden">
                        <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full" />
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-center space-x-4 p-4 bg-gray-800">
                <button 
                    onClick={toggleMute} 
                    className="p-3 rounded-full bg-gray-700 hover:bg-red-500 transition-all"
                >
                    {isMuted ? <Volume2Icon className='size-6' /> : <VolumeOffIcon className='size-6' />}
                </button>
                <button 
                    onClick={toggleCamera} 
                    className="p-3 rounded-full bg-gray-700 hover:bg-blue-500 transition-all"
                >
                    {isCameraOn ?  <CameraOffIcon className='size-6' /> : <CameraIcon className='size-6' />}
                </button>
                <button 
                    onClick={stopMediaDevices}
                    className="p-3 rounded-full bg-red-600 hover:bg-red-700 transition-all"
                >
                    ❌ End Call
                </button>
            </div>
    </div>
    );
};
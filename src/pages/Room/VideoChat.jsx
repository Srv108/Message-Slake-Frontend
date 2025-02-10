import { CameraIcon, CameraOffIcon, PhoneOffIcon, ShareIcon, Volume2Icon, VolumeOffIcon } from 'lucide-react';

import { useGetUserMedia } from '@/hooks/context/useGetUserMedia';

export const VideoChat = () => {

    const {
        remoteVideoRef,
        localVideoRef,
        toggleCamera,
        toggleMute,
        isMuted,
        isCameraOn,
        stopMediaDevices
    } = useGetUserMedia();

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
                    className="p-3 rounded-full bg-gray-700 text-teal-600 hover:text-teal-300 transition-all"
                >
                    <ShareIcon className='size-6 ' />
                </button>
                <button 
                    onClick={toggleMute} 
                    className="p-3 rounded-full bg-gray-700 text-teal-600 hover:text-teal-300 transition-all"
                >
                    {isMuted ? <Volume2Icon className='size-6 ' /> : <VolumeOffIcon className='size-6' />}
                </button>
                <button 
                    onClick={toggleCamera} 
                    className="p-3 rounded-full bg-gray-700 text-teal-600 hover:text-teal-300 transition-all"
                >
                    {isCameraOn ?  <CameraOffIcon className='size-6' /> : <CameraIcon className='size-6' />}
                </button>
                <button 
                    onClick={stopMediaDevices}
                    className="p-3 rounded-full bg-red-600 hover:text-red-700 transition-all"
                >
                    <PhoneOffIcon className='size-6' />
                </button>
            </div>
        </div>
    );
};
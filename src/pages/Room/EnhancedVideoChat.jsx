import { AnimatePresence,motion } from 'framer-motion';
import { 
  CameraIcon, 
  CameraOffIcon, 
  CopyIcon,
  Maximize2,
  Minimize2,
  PhoneOffIcon, 
  ScreenShare, 
  Share2, 
  User,
  Volume2, 
  VolumeX,
  X
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useGetUserMedia } from '@/hooks/context/useGetUserMedia';

export const EnhancedVideoChat = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [callTime, setCallTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeout = useRef(null);
  const videoContainerRef = useRef(null);
  
  const {
    remoteVideoRef,
    localVideoRef,
    toggleCamera,
    toggleMute,
    isMuted,
    isCameraOn,
    stopMediaDevices,
    remoteUser,
    stream, // Local stream object
    remoteStream // Remote stream object
  } = useGetUserMedia();

  // --- Utility Functions (Unchanged) ---
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoContainerRef.current?.requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(console.error);
    } else {
      document.exitFullscreen()
        .then(() => setIsFullscreen(false));
    }
  };

  const copyRoomLink = () => {
    const url = `${window.location.origin}/directMessages/chat/${roomId}/video/call`;
    navigator.clipboard.writeText(url);
    console.log('Call link copied to clipboard');
  };

  const endCall = () => {
    stopMediaDevices();
    navigate(-1);
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
    controlsTimeout.current = setTimeout(() => setShowControls(false), 3000);
  };
  // --- End Utility Functions ---

  // Effects
  useEffect(() => {
    // Start call timer
    const timer = setInterval(() => {
      setCallTime(prev => prev + 1);
    }, 1000);

    // Set up mouse movement listener
    window.addEventListener('mousemove', handleMouseMove);
    
    // Cleanup
    return () => {
      clearInterval(timer);
      window.removeEventListener('mousemove', handleMouseMove);
      if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
    };
  }, []);

  // NEW EFFECT: Confirm Stream Attachment to UI
  useEffect(() => {
    if (localVideoRef.current && stream) {
      console.log('🎥 UI Check: Local stream attached successfully.');
      // Optional: Check if the stream object reference matches the srcObject (for rigorous debugging)
      // if (localVideoRef.current.srcObject !== stream) { console.warn('Local Ref mismatch!'); }
    }
    
    if (remoteVideoRef.current && remoteStream) {
      console.log('🖥️ UI Check: Remote stream attached successfully.');
      // Optional: Check if the stream object reference matches the srcObject
      // if (remoteVideoRef.current.srcObject !== remoteStream) { console.warn('Remote Ref mismatch!'); }
    }
  }, [stream, remoteStream]);


  return (
    <div 
      className="relative flex flex-col h-screen bg-gray-900 text-white overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Header (Unchanged) */}
      <AnimatePresence>
        {showControls && (
          <motion.header 
            className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-4 z-10"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between max-w-7xl mx-auto">
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => navigate(-1)}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-sm font-medium">
                    {remoteUser?.username || 'Call in progress'}
                  </span>
                  <span className="text-xs text-gray-300">
                    {formatTime(callTime)}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={copyRoomLink}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                  title="Copy call link"
                >
                  <Share2 className="h-5 w-5" />
                </button>
                <button 
                  onClick={toggleFullscreen}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                  title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                >
                  {isFullscreen ? (
                    <Minimize2 className="h-5 w-5" />
                  ) : (
                    <Maximize2 className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </motion.header>
        )}
      </AnimatePresence>
      
      {/* -------------------- Main Video Area (Visuals Unchanged) -------------------- */}
      <div className="flex-1 flex items-center justify-center p-2 sm:p-4 relative">
        <div 
          ref={videoContainerRef}
          className={`relative w-full max-w-7xl ${isFullscreen ? 'h-full' : 'aspect-video'} bg-black rounded-lg overflow-hidden transition-all duration-300`}
        >
          
          {/* Remote Video - Primary View */}
          <video 
            ref={remoteVideoRef} 
            autoPlay 
            playsInline 
            className={`w-full h-full object-cover ${!remoteStream ? 'hidden' : 'scale-x-[-1]'}`} 
          />
          
          {/* Remote User Info/Placeholder */}
          {(!remoteStream || remoteStream.getVideoTracks().length === 0 || remoteStream.getVideoTracks()[0].enabled === false) && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center mb-3">
                  <User className="h-12 w-12 text-gray-400" />
                </div>
                <p className="text-xl font-medium">{remoteUser?.username || 'User'}</p>
                <p className="text-sm text-gray-400">
                    {remoteStream ? 'Camera is off' : 'Connecting...'}
                </p>
              </div>
            </div>
          )}

          {/* Local Video - Picture-in-Picture */}
          <motion.div 
            className={`absolute right-4 bottom-4 w-32 h-24 sm:w-48 sm:h-36 bg-gray-900 rounded-lg overflow-hidden shadow-xl border-2 border-gray-700 transition-all duration-300 ${
              !isCameraOn ? 'opacity-70' : ''
            }`}
            whileHover={{ scale: 1.05 }}
          >
            <video 
              ref={localVideoRef} 
              autoPlay 
              playsInline 
              muted 
              className="w-full h-full object-cover scale-x-[-1]" 
            />
            {/* Local Camera Off Indicator */}
            {!isCameraOn && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <CameraOffIcon className="h-6 w-6 text-white/70" />
              </div>
            )}
          </motion.div>
        </div>
      </div>
      {/* -------------------- End Main Video Area -------------------- */}

      {/* Controls (Unchanged) */}
      <AnimatePresence>
        {showControls && (
          <motion.footer 
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 z-10"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center justify-center space-x-2 sm:space-x-4">
                <button 
                  onClick={toggleMute}
                  className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? (
                    <VolumeX className="h-6 w-6" />
                  ) : (
                    <Volume2 className="h-6 w-6" />
                  )}
                </button>

                <button 
                  onClick={toggleCamera}
                  className={`p-3 rounded-full ${
                    isCameraOn 
                      ? 'bg-white/10 hover:bg-white/20' 
                      : 'bg-red-500/90 hover:bg-red-500'
                  } text-white transition-all`}
                  title={isCameraOn ? 'Turn off camera' : 'Turn on camera'}
                >
                  {isCameraOn ? (
                    <CameraIcon className="h-6 w-6" />
                  ) : (
                    <CameraOffIcon className="h-6 w-6" />
                  )}
                </button>

                <button 
                  onClick={copyRoomLink}
                  className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
                  title="Share call link"
                >
                  <Share2 className="h-6 w-6" />
                </button>

                <button 
                  className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
                  title="Share screen"
                >
                  <ScreenShare className="h-6 w-6" />
                </button>

                <button 
                  onClick={endCall}
                  className="p-3 rounded-full bg-red-600 hover:bg-red-700 text-white transition-all"
                  title="End call"
                >
                  <PhoneOffIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
          </motion.footer>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedVideoChat;

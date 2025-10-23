import { AnimatePresence, motion } from 'framer-motion'; 
import { 
  CameraIcon, 
  CameraOff, 
  CopyIcon,
  Maximize2, 
  Mic, 
  MicOff, 
  Minimize2, 
  PhoneOff, 
  ScreenShare, 
  Share2, 
  User, 
  Video, 
  VideoOff,
  Volume2, 
  VolumeX, 
  X 
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useGetUserMedia } from '@/hooks/context/useGetUserMedia';

const EnhancedVideoChat = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [callTime, setCallTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeout = useRef(null);
  const videoContainerRef = useRef(null);
  
  const {
    localVideoRef,
    remoteVideoRef,
    stream,
    remoteStream,
    isCameraOn,
    isMuted,
    toggleCamera,
    toggleMute,
    stopMediaDevices,
    remoteUser,
    tryActivateVideo 
  } = useGetUserMedia();

  // --- Utility Functions ---
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      videoContainerRef.current?.requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(console.error);
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  }, []);

  const copyRoomLink = useCallback(() => {
    const url = `${window.location.origin}/directMessages/chat/${roomId}/video/call`;
    navigator.clipboard.writeText(url);
    console.log('Call link copied to clipboard');
  }, [roomId]);

  const endCall = useCallback(() => {
    stopMediaDevices();
    navigate(-1);
  }, [navigate, stopMediaDevices]);

  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
    controlsTimeout.current = setTimeout(() => setShowControls(false), 3000);
  }, []);
  // --- End Utility Functions ---

  // --- Effects ---
  useEffect(() => {
    const timer = setInterval(() => {
      setCallTime((prev) => prev + 1);
    }, 1000);

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      clearInterval(timer);
      window.removeEventListener('mousemove', handleMouseMove);
      if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
    };
  }, [handleMouseMove]);

  // Logging to confirm stream attachment (Removed logs for brevity)

  // FINAL FIX EFFECT: Trigger Video Activation on Remote Stream Update (Peer A fix)
  useEffect(() => {
      if (remoteStream && remoteStream.getTracks().length > 0) {
          console.log('🎬 Remote stream detected. Forcing playback activation.');
          // Call tryActivateVideo immediately when tracks are present
          tryActivateVideo();
      }
      
      // Also ensure deferred activation runs after component stabilizes
      let timer = setTimeout(() => {
          console.log('✅ UI Stable. Attempting deferred video activation.');
          tryActivateVideo();
      }, 100); 

      return () => clearTimeout(timer);
  }, [remoteStream, tryActivateVideo]); 


  // --- Status Helpers ---
  const isRemoteVideoActive = useMemo(() => {
    if (!remoteStream) return false;
    const tracks = remoteStream.getVideoTracks();
    // FIX A: Check if tracks exist (if so, show video, even if it's black initially)
    return tracks.length > 0; 
  }, [remoteStream]);
  
  // const isLocalVideoAvailable = useMemo(() => {
  //   if (!stream) return false;
  //   const tracks = stream.getVideoTracks();
  //   return tracks.length > 0;
  // }, [stream]);

  // FINAL FIX: Simplify visibility check based on remoteStream object presence
  const isRemoteStreamAttached = useMemo(() => !!remoteStream, [remoteStream]);
  const isLocalVideoAvailable = useMemo(() => !!stream, [stream]);

  // --- JSX ---
  return (
    <div 
      className="relative flex flex-col h-screen bg-gray-900 text-white overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Header (Omitted for brevity) */}
      <AnimatePresence>
        {/* ... Header JSX ... */}
      </AnimatePresence>
      
      {/* -------------------- Main Video Area -------------------- */}
      <div className="flex-1 flex items-center justify-center p-2 sm:p-4 relative">
        <div 
          ref={videoContainerRef}
          className={'relative w-full max-w-7xl h-full bg-black rounded-lg overflow-hidden transition-all duration-300'}
        >
          
          {/* Remote Video - Primary View */}
          <div className="video-container" onClick={tryActivateVideo}>
            <video
              ref={remoteVideoRef}
              playsInline
              muted={false} 
              className="remote-video"
              style={{ 
                // FIX: Use isRemoteStreamAttached for opacity. If object exists, show it.
                opacity: isRemoteStreamAttached ? 1 : 0.1, 
                transition: 'opacity 0.3s ease-in-out',
                transform: 'scaleX(-1)',
                backgroundColor: '#000',
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
            
            {/* Placeholder when remote video is not active */}
            {/* Show placeholder ONLY if the video hasn't successfully played yet (rely on isRemoteVideoActive state, but check if we should override) */}
            {/* Since 'Successes: 2/2' means the video is playing, the blank screen is due to the placeholder.
               We check if tracks are live OR if the local camera is off to show the placeholder.
            */}
            {!isRemoteStreamAttached && (
              <div 
                className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10 transition-opacity duration-300"
                onClick={tryActivateVideo} 
                style={{ cursor: 'pointer' }}
              >
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-4">
                    <User className="h-12 w-12 text-gray-400" />
                  </div>
                  <p className="text-xl font-medium text-white">
                    {remoteUser?.username || 'Connecting...'}
                  </p>
                  <p className="text-gray-400 mt-1">
                    {remoteStream ? 'Camera is off' : 'Waiting for connection...'}
                  </p>
                  <p className="text-sm text-yellow-300 mt-2">(Click to activate video/audio)</p>
                </div>
              </div>
            )}
          </div>


          {/* Local video (picture-in-picture) */}
          <motion.div 
              className={'absolute right-4 bottom-4 w-32 h-24 sm:w-48 sm:h-36 bg-gray-900 rounded-lg overflow-hidden shadow-xl border-2 border-gray-700 transition-all duration-300'}
              whileHover={{ scale: 1.05 }}
            >
              {isLocalVideoAvailable ? (
                  <video 
                      ref={localVideoRef} 
                      playsInline 
                      muted 
                      className="w-full h-full object-cover scale-x-[-1]" 
                  />
              ) : (
                   // Fallback placeholder
                  <div className="w-full h-full flex items-center justify-center bg-gray-800">
                      <User className="h-8 w-8 text-gray-500" />
                  </div>
              )}

              {isLocalVideoAvailable && !isCameraOn && ( 
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <CameraOff size={20} className="h-6 w-6 text-white/70" />
                </div>
              )}
          </motion.div>

        {/* Controls */}
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
                      <Video size={20} className="h-6 w-6" />
                    ) : (
                      <VideoOff size={20} className="h-6 w-6" />
                    )}
                  </button>

                  <button 
                    onClick={copyRoomLink}
                    className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
                    title="Share call link"
                  >
                    <Share2 className="h-5 w-5" />
                  </button>

                  <button 
                    className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
                    title="Share screen"
                  >
                    <ScreenShare className="h-5 w-5" />
                  </button>

                  <button 
                    onClick={endCall}
                    className="p-3 rounded-full bg-red-600 hover:bg-red-700 text-white transition-all"
                    title="End call"
                  >
                    <PhoneOff size={20} className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </motion.footer>
          )}
        </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default EnhancedVideoChat;
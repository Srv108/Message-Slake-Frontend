import { AnimatePresence, motion } from 'framer-motion';
import {
  Maximize2,
  Minimize2,
  PhoneOff,
  Share2,
  Video,
  VideoOff,
  Volume2,
  VolumeX,
  X,
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
  const [isRemoteVideoLoading, setIsRemoteVideoLoading] = useState(true);

  const controlsTimeout = useRef(null);
  const videoContainerRef = useRef(null);

  const {
    stream,
    remoteStream,
    remoteTracks,
    localVideoRef,
    remoteVideoRef,
    isCameraOn,
    isMuted,
    toggleCamera,
    toggleMute,
    stopMediaDevices,
    remoteUser,
  } = useGetUserMedia();

  // --- Utility ---
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  // --- Fullscreen toggle ---
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      videoContainerRef.current?.requestFullscreen().then(() => {
        setIsFullscreen(true);
      });
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  }, []);

  // --- Copy Room Link ---
  const copyRoomLink = useCallback(() => {
    const url = `${window.location.origin}/directMessages/chat/${roomId}/video/call`;
    navigator.clipboard.writeText(url);
    console.log('✅ Call link copied:', url);
  }, [roomId]);

  // --- End Call ---
  const endCall = useCallback(() => {
    stopMediaDevices();
    navigate(-1);
  }, [navigate, stopMediaDevices]);

  // --- Auto-hide controls ---
  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
    controlsTimeout.current = setTimeout(() => setShowControls(false), 3000);
  }, []);

  // --- Attach local stream ---
  useEffect(() => {
    const v = localVideoRef.current;
    if (!stream || !v) return;
    if (v.srcObject !== stream) v.srcObject = stream;
    v.muted = true;
    v
      .play()
      .then(() => console.log('🎥 Local stream playing'))
      .catch((e) =>
        console.warn('⚠️ Local autoplay blocked (muted ok):', e.message)
      );
  }, [stream, localVideoRef]);

  // --- Attach and handle remote stream ---
  
  useEffect(() => {
    const videoElement = remoteVideoRef.current;
    if (!videoElement) return;

    console.log('🔄 Remote stream updated:', {
      id: remoteStream?.id,
      active: remoteStream?.active,
      videoTracks: remoteStream?.getVideoTracks().map(t => ({
        id: t.id,
        readyState: t.readyState,
        enabled: t.enabled
      })) || []
    });

    const handleTrackAdded = () => {
      console.log('🎥 Track added to remote stream');
      if (videoElement.srcObject !== remoteStream) {
        console.log('🔄 Updating video srcObject with new stream');
        videoElement.srcObject = remoteStream;
      }
      attemptPlay();
    };

    const attemptPlay = async () => {
      if (!videoElement || !remoteStream?.getVideoTracks().length) return;
      
      try {
        console.log('▶️ Attempting to play remote video');
        videoElement.muted = true; // Start muted to allow autoplay
        await videoElement.play();
        console.log('✅ Remote video playback started');
        setIsRemoteVideoLoading(false);
        
        // Try to unmute after a short delay
        setTimeout(() => {
          if (videoElement) {
            videoElement.muted = false;
            console.log('🔊 Unmuted remote video');
          }
        }, 1000);
      } catch (err) {
        console.warn('❌ Autoplay failed, will require user interaction:', err);
        setIsRemoteVideoLoading(true);
      }
    };

    // Set up event listeners
    if (remoteStream) {
      remoteStream.onaddtrack = handleTrackAdded;
      
      // If tracks already exist when this effect runs
      if (remoteStream.getVideoTracks().length > 0) {
        if (videoElement.srcObject !== remoteStream) {
          videoElement.srcObject = remoteStream;
        }
        attemptPlay();
      }
    }

    return () => {
      if (remoteStream) {
        remoteStream.onaddtrack = null;
      }
    };
  }, [remoteStream]);

// Add this new effect to handle track changes
  useEffect(() => {re
    const videoElement = remoteVideoRef.current;
    if (!videoElement || !remoteStream) return;

    const tracks = remoteStream.getVideoTracks();
    console.log('🎬 Current remote video tracks:', tracks.map(t => ({
      id: t.id,
      readyState: t.readyState,
      enabled: t.enabled
    })));

    if (tracks.length > 0) {
      const track = tracks[0];
      const onTrackEnded = () => {
        console.log('❌ Remote video track ended');
        setIsRemoteVideoLoading(true);
      };

      track.addEventListener('ended', onTrackEnded);
      
      // Force update the srcObject to ensure the track is attached
      if (videoElement.srcObject !== remoteStream) {
        videoElement.srcObject = remoteStream;
      }

      return () => {
        track.removeEventListener('ended', onTrackEnded);
      };
    }
  }, [remoteStream, remoteStream?.getVideoTracks().length]);

  // --- Safety watcher: hide loader when track live ---
  useEffect(() => {
    const iv = setInterval(() => {
      const vid = remoteVideoRef.current;
      if (!vid || !isRemoteVideoLoading) return;
      const tracks = vid.srcObject?.getVideoTracks?.() || [];
      const hasLive = tracks.some(
        (t) => t.readyState === 'live' && t.enabled !== false
      );
      if (hasLive && vid.readyState >= 2) {
        console.log('🟢 Video ready, hiding loader');
        setIsRemoteVideoLoading(false);
      }
    }, 1000);
    return () => clearInterval(iv);
  }, [isRemoteVideoLoading, remoteVideoRef]);

  // --- Call timer ---
  useEffect(() => {
    const timer = setInterval(() => setCallTime((t) => t + 1), 1000);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      clearInterval(timer);
      window.removeEventListener('mousemove', handleMouseMove);
      if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
    };
  }, [handleMouseMove]);

  // --- Manual click fallback ---
  const handleVideoClick = useCallback(() => {
    const v = remoteVideoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play()
        .then(() => {
          v.muted = false;
          setIsRemoteVideoLoading(false);
        })
        .catch((e) => console.warn('❌ Click-to-play failed:', e.message));
    } else {
      v.muted = !v.muted;
      console.log(`🎧 Remote video ${v.muted ? 'muted' : 'unmuted'}`);
    }
  }, [remoteVideoRef]);

  const handleVideoError = useCallback((e) => {
    console.error('Video error:', e);
    setIsRemoteVideoLoading(false);
  }, []);

  const isRemoteVideoActive = useMemo(() => {
    if (!remoteTracks?.length) return false;
    return remoteTracks.some(
      (t) => t.kind === 'video' && t.readyState === 'live'
    );
  }, [remoteTracks]);

  // --- UI ---
  return (
    <div
      ref={videoContainerRef}
      onMouseMove={handleMouseMove}
      className="relative flex flex-col h-screen bg-gray-900 text-white overflow-hidden"
    >
      {/* Remote Video */}
      <div className="relative flex-1 bg-black">
        {isRemoteVideoLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
            <div className="animate-pulse text-white">
              Connecting to video...
            </div>
          </div>
        )}
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          muted
          onClick={handleVideoClick}
          onError={(e) => {
            console.error('Video error:', e);
            setIsRemoteVideoLoading(false);
          }}
          onCanPlay={() => {
            console.log('✅ Video can play');
            setIsRemoteVideoLoading(false);
          }}
          onPlaying={() => {
            console.log('▶️ Video is playing');
            setIsRemoteVideoLoading(false);
          }}
          // onLoadedData={() => setIsRemoteVideoLoading(false)}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Local Video */}
      <div className="absolute bottom-4 right-4 w-1/4 h-1/3 bg-gray-800 rounded-lg overflow-hidden shadow-xl z-20">
        <video
          ref={localVideoRef}
          muted
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
        {!isCameraOn && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <VideoOff className="h-8 w-8 text-white" />
          </div>
        )}
      </div>

      {/* Controls */}
      <AnimatePresence>
        {showControls && (
          <motion.footer
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 z-30"
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex justify-center space-x-6">
              <button
                onClick={toggleMute}
                className={`p-3 rounded-full ${
                  isMuted
                    ? 'bg-red-500'
                    : 'bg-white/10 hover:bg-white/20 transition-colors'
                }`}
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
                  !isCameraOn
                    ? 'bg-red-500'
                    : 'bg-white/10 hover:bg-white/20 transition-colors'
                }`}
              >
                {isCameraOn ? (
                  <Video className="h-6 w-6" />
                ) : (
                  <VideoOff className="h-6 w-6" />
                )}
              </button>

              <button
                onClick={toggleFullscreen}
                className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                {isFullscreen ? (
                  <Minimize2 className="h-6 w-6" />
                ) : (
                  <Maximize2 className="h-6 w-6" />
                )}
              </button>

              <button
                onClick={copyRoomLink}
                className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <Share2 className="h-6 w-6" />
              </button>

              <button
                onClick={endCall}
                className="p-3 rounded-full bg-red-600 hover:bg-red-700 transition-colors"
              >
                <PhoneOff className="h-6 w-6" />
              </button>
            </div>
          </motion.footer>
        )}
      </AnimatePresence>

      {/* Header */}
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
            </div>
          </motion.header>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedVideoChat;

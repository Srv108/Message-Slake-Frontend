import {
    createContext,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { useNavigate } from 'react-router-dom';

// Assuming these paths are correct in your project structure
import { peerConnectionConfig } from '@/api/webrtc/peerConnectionConfig';
import { useAuth } from '@/hooks/context/useAuth';
import { useRoomDetails } from '@/hooks/context/useRoomDetails';
import { useSocket } from '@/hooks/context/useSocket';

/* ============================
    Enhanced Constants / Utilities (UNCHANGED)
============================ */

export const WebRTCError = {
    MEDIA_ACCESS: 'MEDIA_ACCESS',
    PEER_CONNECTION: 'PEER_CONNECTION',
    SIGNALING: 'SIGNALING',
    NETWORK: 'NETWORK',
    PERMISSION: 'PERMISSION',
};

export const ConnectionState = {
    DISCONNECTED: 'disconnected',
    CONNECTING: 'connecting',
    CONNECTED: 'connected',
    RECONNECTING: 'reconnecting',
    FAILED: 'failed',
};

// Merge additional STUN servers + advanced flags
const enhancedPeerConfig = {
    ...peerConnectionConfig,
    iceServers: [
        ...(peerConnectionConfig?.iceServers || []),
        {
            urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
        },
    ],
    iceCandidatePoolSize: 10,
    bundlePolicy: 'max-bundle',
    rtcpMuxPolicy: 'require',
    iceTransportPolicy: 'all',
};

/* ----------------
    Connection quality monitor (UNCHANGED)
---------------- */
const monitorConnectionQuality = (pc, onQualityChange) => {
    if (!pc) return () => {};

    const statsInterval = setInterval(async () => {
        if (pc.iceConnectionState === 'closed') {
            clearInterval(statsInterval);
            return;
        }
        try {
            const stats = await pc.getStats();
            let totalBytesSent = 0;
            let totalBytesReceived = 0;
            let packetsLost = 0;
            let totalPackets = 0;

            stats.forEach((report) => {
                if (report.type === 'outbound-rtp' || report.type === 'inbound-rtp') {
                    if (report.bytesSent) totalBytesSent += report.bytesSent;
                    if (report.bytesReceived) totalBytesReceived += report.bytesReceived;
                    if (report.packetsLost !== undefined) packetsLost += report.packetsLost;
                    if (report.packetsSent) totalPackets += report.packetsSent;
                    if (report.packetsReceived) totalPackets += report.packetsReceived;
                }
            });

            const packetLossRate = totalPackets > 0 ? (packetsLost / totalPackets) * 100 : 0;
            
            const quality =
                packetLossRate < 2 ? 'excellent' : packetLossRate < 5 ? 'good' : packetLossRate < 10 ? 'poor' : 'bad';

            onQualityChange?.({
                quality,
                packetLossRate: parseFloat(packetLossRate.toFixed(2)),
                totalBytesSent,
                totalBytesReceived,
                timestamp: Date.now(),
            });
        } catch (error) {
            console.error('Error monitoring connection quality:', error);
        }
    }, 5000);

    return () => clearInterval(statsInterval);
};

/* ----------------
    Enhanced createPeerConnection factory (FIXED pc.ontrack)
---------------- */
const createEnhancedPeerConnection = (
    config = {},
    remoteVideoRef,
    setRemoteStream,
    onIceCandidate,
    onConnectionStateChange,
    onTrackReceived
) => {
    // Initial empty stream is created and provided via state/ref
    const remoteStream = new MediaStream();
    setRemoteStream(remoteStream);

    const pc = new RTCPeerConnection({ ...enhancedPeerConfig, ...config });
    const dataChannels = new Map();

    const setupDataChannel = (channel) => {
        channel.binaryType = 'arraybuffer';
        dataChannels.set(channel.label, channel);
        channel.onopen = () => { console.log(`📡 Data channel '${channel.label}' opened`); };
        channel.onclose = () => { console.log(`📡 Data channel '${channel.label}' closed`); dataChannels.delete(channel.label); };
        channel.onerror = (err) => { console.error(`📡 Data channel '${channel.label}' error:`, err); };
        channel.onmessage = (ev) => { console.debug(`Data channel '${channel.label}' message received`); };
    };

    /* --- PC Event Handlers --- */
    pc.onicecandidate = (event) => {
        if (event.candidate) {
            console.log('🧊 Local ICE Candidate gathered:', event.candidate.type);
            onIceCandidate(event.candidate).catch(err => console.error('Failed to handle outgoing candidate:', err));
        } else {
            console.log('✅ All ICE candidates have been gathered');
        }
    };

    // FIX: Simplified pc.ontrack handler to directly manage the remoteStream instance
    pc.ontrack = (event) => {
        console.log(`🎥 Remote track received: ${event.track.kind}`, event.streams);

        const streamToUpdate = remoteStream; 
        const existingTracks = streamToUpdate.getTracks().filter(t => t.id === event.track.id);
        
        if (existingTracks.length === 0) {
            streamToUpdate.addTrack(event.track);
            console.log(`✅ Added ${event.track.kind} track to remote stream`);
        } else {
            console.log(`⚠️ ${event.track.kind} track already exists - skipping add.`);
        }

        // CRITICAL FIX: Update React state, but DO NOT call .play() here.
        setRemoteStream(streamToUpdate); 

        // Set video element properties via ref immediately for faster processing
        if (remoteVideoRef?.current) {
            // Re-link srcObject (this triggers browser processing)
            remoteVideoRef.current.srcObject = streamToUpdate;
            remoteVideoRef.current.muted = false; // Remote audio must be unmuted
            remoteVideoRef.current.playsInline = true;
            // IMPORTANT: Removed ALL aggressive .play() calls here.
        }

        if (typeof onTrackReceived === 'function') {
            onTrackReceived(event.track.kind);
        }
    };


    // DEBUG HANDLER: Log ICE connection status
    pc.oniceconnectionstatechange = () => {
        const iceState = pc.iceConnectionState;
        console.log('🧊 ICE Connection State:', iceState);
    };

    pc.onconnectionstatechange = () => {
        const state = pc.connectionState;
        console.log('🔌 Connection State:', state);
        onConnectionStateChange(state);
    };

    pc.ondatachannel = (event) => {
        setupDataChannel(event.channel);
    };

    /* --- PCHelper Return Object --- */
    return {
        pc,
        createDataChannel: (label, options) => {
            const channel = pc.createDataChannel(label, options);
            setupDataChannel(channel);
            return channel;
        },
        getDataChannel: (label) => dataChannels.get(label),
        close: () => {
            dataChannels.forEach((ch) => ch.close());
            try {
                remoteStream.getTracks().forEach(t => t.stop());
                pc.close();
            } catch (e) {
                console.warn('Error closing RTCPeerConnection:', e);
            }
        },
    };
};

/* ----------------
    withRetry utility (UNCHANGED)
---------------- */
const withRetry = async (operation, options = {}) => {
    const { maxRetries = 3, initialDelay = 1000, onRetry = () => {}, shouldRetry = () => true } = options;
    let lastError;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await operation(attempt);
        } catch (error) {
            lastError = error;
            if (attempt === maxRetries || !shouldRetry(error)) {
                break;
            }
            const delay = initialDelay * Math.pow(2, attempt - 1);
            console.warn(`Attempt ${attempt} failed, retrying in ${delay}ms...`, error.message);
            await new Promise((r) => setTimeout(r, delay));
            try {
                onRetry(attempt, error);
            } catch (e) {
                /* ignore onRetry errors */
            }
        }
    }
    throw lastError;
};

/* ----------------
    Network monitoring (UNCHANGED)
---------------- */
const setupNetworkMonitoring = (onNetworkChange) => {
    if (!navigator.connection) {
        console.warn('Network Information API not supported');
        return () => {};
    }

    const handleNetworkChange = () => {
        const { effectiveType, downlink, rtt, saveData } = navigator.connection;
        onNetworkChange?.({ type: effectiveType, downlink, rtt, saveData, timestamp: Date.now() });
    };

    navigator.connection.addEventListener('change', handleNetworkChange);
    handleNetworkChange(); // initial call

    return () => {
        navigator.connection.removeEventListener('change', handleNetworkChange);
    };
};

/* ----------------
    Media access wrapper (UNCHANGED)
---------------- */
const getMediaStream = async (constraints) => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        
        return {
            stream,
            stop: () => {
                stream.getTracks().forEach((t) => t.stop());
            },
        };
    } catch (error) {
        console.error('Error accessing media devices:', error);
        const code = error.name === 'NotAllowedError' ? WebRTCError.PERMISSION : WebRTCError.MEDIA_ACCESS;
        const e = new Error('Failed to access media devices');
        e.code = code;
        e.cause = error;
        throw e;
    }
};

/* ============================
    Main Provider Logic
============================ */
const UserMediaContext = createContext();

export const UserMediaProvider = ({ children }) => {
    const navigate = useNavigate();
    const { auth } = useAuth();
    const {
        socket,
        acceptCall,
        offerRecieved,
        answerRecieved,
        setCallAccepted,
        setOfferRecieved,
        setAnswerRecieved,
        candidateRecieved,
        setCandidateRecieved,
    } = useSocket();
    const { currentRoom } = useRoomDetails();

    /* --- State Management --- */
    const [remoteUser, setRemoteUser] = useState(null);
    const [streamWrapper, setStreamWrapper] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [isCameraOn, setIsCameraOn] = useState(true);
    const [isMuted, setIsMuted] = useState(false);
    const [callDialed, setCallDialed] = useState(false);
    
    // STATE: To stabilize receiver processing after navigation
    const [pendingOfferData, setPendingOfferData] = useState(null); 
    
    // Connection and Error State
    const [connectionState, setConnectionState] = useState(ConnectionState.DISCONNECTED);
    const [connectionQuality, setConnectionQuality] = useState(null);
    const [error, setError] = useState(null);
    const [errorCode, setErrorCode] = useState(null);

    /* --- Refs for mutable/non-rerendering data --- */
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const pcWrapperRef = useRef(null);
    const pendingRemoteCandidatesRef = useRef([]);
    const sentCandidatesRef = useRef(new Set());
    const isInitiatorRef = useRef(false);

    // Reconnection Refs
    const reconAttemptRef = useRef(0);
    const reconTimerRef = useRef(null);
    const maxReconnectAttempts = 5;
    const baseReconnectDelayMs = 1000;

    // Monitor Stop Refs
    const qualityMonitorStopRef = useRef(null);
    const networkMonitorStopRef = useRef(null);

    /* ----------------
        Utility Callbacks
    ----------------*/

    const changeConnectionState = useCallback((newState) => {
        setConnectionState((prev) => {
            if (prev !== newState) {
                console.log('🔗 Connection state change:', prev, '->', newState);
                if (newState === ConnectionState.CONNECTED) {
                    reconAttemptRef.current = 0;
                    if (reconTimerRef.current) {
                        clearTimeout(reconTimerRef.current);
                        reconTimerRef.current = null;
                    }
                }
                return newState;
            }
            return prev;
        });
    }, []);

    const emitWithRetry = useCallback(
        (eventName, payload, opts = {}) =>
            withRetry(
                async () =>
                    new Promise((resolve, reject) => {
                        try {
                            if (socket?.connected !== true) {
                                reject(new Error('Socket not connected'));
                                return;
                            }
                            socket.emit(eventName, payload, (ack) => {
                                if (ack && ack.success) resolve(ack);
                                else reject(new Error(`Signaling ACK failed: ${ack?.error || 'Unknown error'}`));
                            });
                        } catch (err) {
                            reject(err);
                        }
                    }),
                {
                    maxRetries: opts.maxRetries ?? 3,
                    initialDelay: opts.baseDelay ?? 500,
                    onRetry: (attempt, err) => {
                        console.warn(`emitWithRetry retry #${attempt} for ${eventName}`, err.message);
                    },
                    shouldRetry: (err) => true,
                }
            ),
        [socket]
    );

    const handleOutgoingCandidate = useCallback(
        async (candidate) => {
            try {
                const candidateString = JSON.stringify(candidate);
                if (sentCandidatesRef.current.has(candidateString)) return;
                sentCandidatesRef.current.add(candidateString);

                await emitWithRetry(
                    'ice-candidate',
                    {
                        from: { username: auth?.user?.username, id: auth?.user?.id, email: auth?.user?.email },
                        to: { user: remoteUser, room: currentRoom },
                        candidate,
                    },
                    { maxRetries: 2, baseDelay: 300 }
                );
            } catch (err) {
                console.warn('Failed to emit ICE candidate (emitWithRetry):', err.message);
            }
        },
        [emitWithRetry, auth, remoteUser, currentRoom]
    );

    /* ----------------
        Core Connection/Reconnection Logic
    ----------------*/

    // Forward declaration to break dependency cycle
    let createOffer;
    let attemptReconnection;

    const createPeerConnection = useCallback(async (isReconnection = false) => {
        console.log('🔄 Creating new Peer Connection (Reconnection:', isReconnection, ')');
    
        if (pcWrapperRef.current) {
            console.log('Closing existing peer connection before creating new one');
            try { pcWrapperRef.current.close(); } catch (e) { console.warn('Error closing existing PC:', e); }
            pcWrapperRef.current = null;
        }

        if (qualityMonitorStopRef.current) {
            qualityMonitorStopRef.current();
            qualityMonitorStopRef.current = null;
        }

        changeConnectionState(ConnectionState.CONNECTING);

        const wrapper = createEnhancedPeerConnection(
            {},
            remoteVideoRef,
            setRemoteStream,
            handleOutgoingCandidate,
            // onConnectionStateChange handler
            (pcState) => {
                if (pcState === 'connected') {
                    changeConnectionState(ConnectionState.CONNECTED);
                } else if (['failed', 'disconnected'].includes(pcState)) {
                    // Use a short delay before attempting reconnection to let the state stabilize
                    setTimeout(() => {
                        // Use the stable ref for attemptReconnection
                        if (pcWrapperRef.current?.pc.connectionState !== 'connected') {
                            attemptReconnectionRef.current(pcState); 
                        }
                    }, 500);
                } else if (pcState === 'closed') {
                    changeConnectionState(ConnectionState.DISCONNECTED);
                }
            },
            () => { /* onTrackReceived */ }
        );

        pcWrapperRef.current = wrapper;

        const stream = streamWrapper?.stream;
        if (stream) {
            // FIX: Only add tracks that haven't been added yet (check senders)
            const currentSenders = wrapper.pc.getSenders();
            stream.getTracks().forEach((track) => {
                const senderExists = currentSenders.some(sender => sender.track === track);
                
                if (!senderExists) {
                    try {
                        wrapper.pc.addTrack(track, stream);
                        console.log(`➕ Added local ${track.kind} track`);
                        track.enabled = true; // Ensure track is enabled right after being added
                    } catch (err) {
                        console.warn(`addTrack failed for ${track.kind}:`, err);
                    }
                } else {
                    console.log(`Track ${track.kind} already added, skipping addTrack.`);
                }
            });
        }

        qualityMonitorStopRef.current = monitorConnectionQuality(wrapper.pc, setConnectionQuality);

        // Flush candidates
        const pc = wrapper.pc;
        const flushPendingCandidates = async () => {
            const timeout = Date.now() + 5000;
            while (Date.now() < timeout && (!pc.remoteDescription || !pc.remoteDescription.type)) {
                await new Promise(r => setTimeout(r, 100));
            }
            if (pc.remoteDescription?.type) {
                console.log(`🧽 Flushing ${pendingRemoteCandidatesRef.current.length} queued remote candidates...`);
                while (pendingRemoteCandidatesRef.current.length > 0) {
                    const c = pendingRemoteCandidatesRef.current.shift();
                    try { await pc.addIceCandidate(new RTCIceCandidate(c)); } catch (err) { console.warn('Failed to add flushed candidate:', err); }
                }
            }
        };
        setTimeout(flushPendingCandidates, 500);

        return wrapper;
    }, [streamWrapper, remoteVideoRef, setRemoteStream, handleOutgoingCandidate, changeConnectionState]);


    attemptReconnection = useCallback(
        (reason = 'unknown') => {
            if ([ConnectionState.RECONNECTING, ConnectionState.FAILED, ConnectionState.DISCONNECTED].includes(connectionState)) {
                console.log(`Skipping reconnection attempt (current state: ${connectionState})`);
                return;
            }

            if (reconAttemptRef.current >= maxReconnectAttempts) {
                const e = new Error(`Max reconnection attempts reached (reason: ${reason})`);
                e.code = WebRTCError.NETWORK;
                setError(e);
                setErrorCode(e.code);
                changeConnectionState(ConnectionState.FAILED);
                return;
            }

            reconAttemptRef.current += 1;
            const attempt = reconAttemptRef.current;
            const delay = Math.min(baseReconnectDelayMs * Math.pow(2, attempt - 1), 30000);

            if (reconTimerRef.current) { clearTimeout(reconTimerRef.current); }
            changeConnectionState(ConnectionState.RECONNECTING);

            reconTimerRef.current = setTimeout(async () => {
                if (connectionState === ConnectionState.CONNECTED) return;
                console.log(`⏳ Attempting reconnection #${attempt} (reason: ${reason})`);
                
                try {
                    await createPeerConnection(true);
                    const pc = pcWrapperRef.current.pc;

                    // 1. ICE Restart
                    pc.restartIce();
                    console.log('Initiated ICE Restart.');

                    // 2. Offer or Request Offer
                    if (isInitiatorRef.current) {
                        console.log('Creating new offer for reconnection...');
                        await createOffer();
                    } else {
                        // Non-initiators request a new offer/re-negotiation from the initiator
                        console.log('Non-initiator requesting re-offer...');
                        await emitWithRetry(
                            'renegotiation-needed',
                            {
                                from: { username: auth?.user?.username, id: auth?.user?.id, email: auth?.user?.email },
                                to: { user: remoteUser, room: currentRoom },
                            },
                            { maxRetries: 2, baseDelay: 500 }
                        );
                    }
                } catch (err) {
                    console.error('Reconnection attempt failed:', err);
                    attemptReconnectionRef.current('reconnect-failed');
                }
            }, delay);
        },
        [changeConnectionState, createPeerConnection, connectionState, createOffer, emitWithRetry, auth, remoteUser, currentRoom] 
    );
    
    const attemptReconnectionRef = useRef(attemptReconnection);
    useEffect(() => {
        attemptReconnectionRef.current = attemptReconnection;
    }, [attemptReconnection]);


    /* ----------------
        SDP Handlers
    ----------------*/

    createOffer = useCallback(async () => {
        try {
            changeConnectionState(ConnectionState.CONNECTING);
            if (!pcWrapperRef.current) await createPeerConnection();
            const pc = pcWrapperRef.current.pc;
            
            // Check signaling state to avoid creating offer while one is pending
            if (pc.signalingState !== 'stable' && pc.signalingState !== 'have-local-offer') {
                console.warn(`Skipping offer creation: Signaling state is ${pc.signalingState}`);
                return;
            }

            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);

            await emitWithRetry(
                'offer',
                {
                    from: { username: auth?.user?.username, id: auth?.user?.id, email: auth?.user?.email },
                    to: { user: remoteUser, room: currentRoom },
                    offer,
                },
                { maxRetries: 3, baseDelay: 500 }
            );
            console.log('✅ Offer sent successfully');
        } catch (err) {
            console.error('createOffer error', err);
            const e = new Error('Peer connection (offer) failed');
            e.code = WebRTCError.PEER_CONNECTION;
            e.cause = err;
            setError(e);
            setErrorCode(e.code);
            attemptReconnectionRef.current('offer-failed'); // Use the stable ref
        }
    }, [remoteUser, currentRoom, auth, emitWithRetry, createPeerConnection, changeConnectionState]);

    const handleOffer = useCallback(
        async ({ offer, from, to }) => {
            console.log('📞 Handling incoming offer from:', from?.username || 'unknown');
            
            // Prevent handling multiple offers if a PC already exists
            if (pcWrapperRef.current) {
                console.warn('Skipping offer handling: PeerConnection already initialized for this call.');
                return;
            }

            try {
                // 1. Initialize media if not already done
                let w = streamWrapper;
                if (!w) {
                    // Media acquisition for receiver happens here if streamWrapper is null
                    w = await getMediaStream({ video: true, audio: true });
                    setStreamWrapper(w);
                    if (localVideoRef.current) {
                        localVideoRef.current.srcObject = w.stream;
                        localVideoRef.current.muted = true;
                        await localVideoRef.current.play().catch(console.error);
                    }
                }
                
                // FINAL CRITICAL FIX: Allow React to finish all synchronous renders/effects 
                // caused by stream acquisition BEFORE creating the PeerConnection.
                await new Promise(r => setTimeout(r, 0)); // Non-blocking microtask delay

                // 2. Create peer connection
                const wrapper = await createPeerConnection();
                const pc = wrapper.pc;

                // 3. Set remote description
                await pc.setRemoteDescription(new RTCSessionDescription(offer));

                // 4. Create and set local answer
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);

                // 5. Send answer
                await emitWithRetry('answer', { answer, from, to }, { maxRetries: 3, baseDelay: 400 });
                console.log('✅ Answer sent successfully');
            } catch (err) {
                console.error('handleOffer error', err);
                const e = new Error('Failed to handle incoming offer');
                e.code = WebRTCError.PEER_CONNECTION;
                e.cause = err;
                setError(e);
                setErrorCode(e.code);
            }
        },
        [streamWrapper, createPeerConnection, emitWithRetry, setStreamWrapper]
    );

    const handleAnswer = useCallback(
        async (answerObj) => {
            try {
                if (!answerObj || !pcWrapperRef.current) return;
                const pc = pcWrapperRef.current.pc;

                if (pc.remoteDescription && pc.remoteDescription.type === 'answer') {
                    console.warn('⚠️ Remote description already set to answer; skipping.');
                    return;
                }
                
                // If local description is set (meaning we sent an offer), accept the answer.
                if (pc.localDescription?.type === 'offer') {
                    await pc.setRemoteDescription(new RTCSessionDescription(answerObj));
                    console.log('✅ Set remote description from answer');
                } else {
                    console.warn('⚠️ Cannot set remote answer: Local offer not yet set or state invalid.');
                }
            } catch (err) {
                console.error('handleAnswer error', err);
                setError(new Error('Failed to set remote answer'));
                setErrorCode(WebRTCError.PEER_CONNECTION);
            }
        },
        []
    );

    const handleCandidate = useCallback(
        async (candidate) => {
            try {
                if (!candidate) return;

                const pc = pcWrapperRef.current?.pc;
                if (!pc) {
                    pendingRemoteCandidatesRef.current.push(candidate);
                    return;
                }

                if (pc.remoteDescription?.type) {
                    await pc.addIceCandidate(new RTCIceCandidate(candidate));
                    console.log('🧊 Added remote ICE candidate');
                } else {
                    pendingRemoteCandidatesRef.current.push(candidate);
                }
            } catch (err) {
                console.error('handleCandidate error', err);
            }
        },
        []
    );


    /* ----------------
        Public Media Controls
    ----------------*/

    const openMediaDevices = useCallback(async (shouldRenegotiate = true) => {
        try {
            // Check if stream already exists AND is active before acquiring a new one
            if (streamWrapper?.stream?.active) {
                console.log('Media stream already active, skipping re-acquisition.');
                return streamWrapper;
            }

            // Stop any existing tracks on the old stream if replacing
            if (streamWrapper?.stream) {
                streamWrapper.stream.getTracks().forEach(track => track.stop());
            }

            const w = await getMediaStream({ video: true, audio: true });
            setStreamWrapper(w);
            
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = w.stream;
                localVideoRef.current.muted = true;
                await localVideoRef.current.play().catch(console.error);
            }
            setIsCameraOn(true);
            setIsMuted(false);

            // Handle track replacement/adding if PC is active
            if (pcWrapperRef.current) {
                const pc = pcWrapperRef.current.pc;
                const senders = pc.getSenders();
                
                // Replace or add tracks
                for (const track of w.stream.getTracks()) {
                    const sender = senders.find(s => s.track?.kind === track.kind);
                    if (sender) {
                        await sender.replaceTrack(track);
                        console.log(`✅ Replaced ${track.kind} track successfully`);
                    } else {
                        pc.addTrack(track, w.stream);
                        console.log(`➕ Added new ${track.kind} track post-stream replacement.`);
                    }
                }
                
                // Only trigger renegotiation if explicitly allowed (i.e., not the initial call)
                if (shouldRenegotiate) {
                    console.log('Triggering renegotiation after media replacement...');
                    if (isInitiatorRef.current) {
                        await createOffer(); 
                    } else {
                        await emitWithRetry(
                            'renegotiation-needed',
                            { 
                                from: { username: auth?.user?.username, id: auth?.user?.id, email: auth?.user?.email },
                                to: { user: remoteUser, room: currentRoom },
                            },
                            { maxRetries: 1 }
                        );
                    }
                } else {
                     console.log('Skipping renegotiation after initial media acquisition.');
                }
            }
            return w;
        } catch (err) {
            console.error('openMediaDevices failed:', err);
            setError(err);
            setErrorCode(err.code || WebRTCError.MEDIA_ACCESS);
            throw err;
        }
    }, [createOffer, emitWithRetry, auth?.user, remoteUser, currentRoom, streamWrapper]);

    const stopMediaDevices = useCallback(() => {

        if (!streamWrapper?.stream && !pcWrapperRef.current) {
            return;
        }
        
        console.log('🛑 Stopping media devices and cleaning up WebRTC...');
        
        if (streamWrapper?.stream) {
            streamWrapper.stream.getTracks().forEach(track => track.stop());
        }

        if (pcWrapperRef.current) { pcWrapperRef.current.close(); pcWrapperRef.current = null; }
        if (qualityMonitorStopRef.current) { qualityMonitorStopRef.current(); qualityMonitorStopRef.current = null; }
        if (reconTimerRef.current) { clearTimeout(reconTimerRef.current); reconTimerRef.current = null; }
        
        setStreamWrapper(null);

        reconAttemptRef.current = 0;
        isInitiatorRef.current = false;
        pendingRemoteCandidatesRef.current = [];
        sentCandidatesRef.current.clear();
        setRemoteStream(null);
        setConnectionQuality(null);
        setError(null);
        setErrorCode(null);
        
        changeConnectionState(ConnectionState.DISCONNECTED);

        console.log('🛑 Media devices and WebRTC connection stopped.');
    }, [streamWrapper, changeConnectionState]);

    const toggleMute = useCallback(() => {
        if (!streamWrapper?.stream) return;
        const newState = !isMuted;
        streamWrapper.stream.getAudioTracks().forEach((t) => (t.enabled = !newState));
        setIsMuted(newState);
        socket?.emit('toggle-mic', { muted: newState });
    }, [streamWrapper, socket, isMuted]);

    const toggleCamera = useCallback(async () => {
        if (!streamWrapper?.stream) {
            console.log('No active stream, initializing media...');
            await openMediaDevices(true); // Always renegotiate on toggle if PC exists
            return;
        }
        
        const newState = !isCameraOn;
        console.log(`🔄 Toggling camera to: ${newState ? 'ON' : 'OFF'}`);
        
        try {
            if (newState) {
                const videoTracks = streamWrapper.stream.getVideoTracks();
                if (videoTracks.length === 0 || !videoTracks[0].readyState === 'live') {
                    console.log('🔁 Reactivating camera stream...');
                    await openMediaDevices(true); 
                } else {
                    videoTracks.forEach(track => { track.enabled = true; });
                }
                setIsCameraOn(true);
            } else {
                streamWrapper.stream.getVideoTracks().forEach(track => {
                    track.enabled = false;
                });
                setIsCameraOn(false);
            }
            
            socket?.emit('toggle-camera', { enabled: newState });
        } catch (err) {
            console.error('Failed to toggle camera:', err);
            setError(err);
            setErrorCode(WebRTCError.MEDIA_ACCESS);
        }
    }, [streamWrapper, isCameraOn, socket, openMediaDevices]);

    const startCall = useCallback(
        (user) => {
            if (user) {
                isInitiatorRef.current = true;
                setRemoteUser(user);
                setCallDialed(true);
            }
        },
        [setRemoteUser, setCallDialed]
    );
    
    // We need a manual way to trigger playback outside of ontrack/openMediaDevices
    const tryActivateVideo = useCallback(() => {
        const localVideo = localVideoRef.current;
        const remoteVideo = remoteVideoRef.current;
        let successCount = 0;

        // Helper to log and play
        const activate = (video, type) => {
            if (video && video.srcObject && video.paused) {
                video.play().then(() => {
                    console.log(`✅ ${type} Video Playback Succeeded.`);
                    successCount++;
                }).catch(e => {
                    console.error(`❌ ${type} Video Playback FAILED:`, e.name, e.message);
                });
            }
        };

        // Local Video Activation (should always succeed if muted)
        activate(localVideo, 'Local');

        // Remote Video Activation (needs user gesture)
        activate(remoteVideo, 'Remote');
        
        console.log(`🎬 Finished activation routine. Successes: ${successCount}/2`);

    }, []);


    /* ----------------
        Socket/State Effects
    ----------------*/

    // 1. Incoming Candidate Effect (UNCHANGED)
    useEffect(() => {
        if (!candidateRecieved) return;
        handleCandidate(candidateRecieved.candidate);
        setCandidateRecieved(null);
    }, [candidateRecieved, handleCandidate, setCandidateRecieved]);

    // 2. Incoming Offer/Call Acceptance Effect (STABILIZED RECEIVER)
    useEffect(() => {
        if (!offerRecieved || !acceptCall) return;

        console.log('📞 Incoming call accepted. Preparing to handle offer...');
        
        const room = offerRecieved.to?.room;
        
        // Clear the received states immediately to stop re-runs
        const currentOffer = offerRecieved;
        setOfferRecieved(null);
        setCallAccepted(false);

        // Check if we are already processing this peer
        if (remoteUser?.id === currentOffer.from?.id && connectionState !== ConnectionState.DISCONNECTED) {
            console.warn('Skipping offer acceptance: Already processing this call.');
            return;
        }

        setRemoteUser(currentOffer.from);
        isInitiatorRef.current = false;
        
        // FIX A: Delay navigation slightly on the receiver side for component stabilization
        setTimeout(() => {
            try {
                navigate(`/directMessages/chat/${room}/video/call`);
            } catch (e) {
                console.warn('Receiver Navigation failed:', e);
            }
        }, 50);

        // FINAL FIX: Defer handling the offer to the new useEffect to run after navigation stabilization
        setPendingOfferData({ offer: currentOffer.offer, from: currentOffer.from, to: currentOffer.to });
        
    }, [acceptCall, offerRecieved, navigate, setOfferRecieved, setCallAccepted, remoteUser, connectionState]);

    // 2a. Process Pending Offer (Runs only after navigation/render is stable)
    useEffect(() => {
        if (pendingOfferData && pcWrapperRef.current === null) {
            console.log('✅ Processing deferred offer data...');
            // Run the core logic, which includes media acquisition and PC creation
            handleOffer(pendingOfferData);
            
            // Clear the state after processing
            setPendingOfferData(null);
        }
    }, [pendingOfferData, handleOffer]);


    // 3. Incoming Answer Effect (UNCHANGED)
    useEffect(() => {
        if (!answerRecieved) return;
        handleAnswer(answerRecieved.answer || answerRecieved);
        setAnswerRecieved(null);
    }, [answerRecieved, handleAnswer, setAnswerRecieved]);
    
    // 4a. Media Stream Acquisition (Decoupled Effect)
    useEffect(() => {
        if (!callDialed || !remoteUser || streamWrapper) return;

        let isActive = true;
        
        const getInitialMedia = async () => {
            try {
                console.log('🎬 Acquiring initial media devices...');
                // Pass false to prevent immediate renegotiation/track replacement logic
                await openMediaDevices(false); 
            } catch (err) {
                console.error('Initial media acquisition failed:', err);
                if (isActive) {
                    stopMediaDevices();
                    setCallDialed(false); 
                }
            }
        };

        getInitialMedia();

        return () => {
            isActive = false;
        };
    }, [callDialed, remoteUser, streamWrapper, openMediaDevices, stopMediaDevices]);

    // 4. Call Dialed Effect - Handles call initiation (FINAL DEBOUNCE FIX)
    useEffect(() => {
        // Now requires streamWrapper to be set by Effect 4a before proceeding
        if (!callDialed || !remoteUser || !isInitiatorRef.current || !streamWrapper) return; 
        
        // Check 1: If PC already exists, skip initiation.
        if (pcWrapperRef.current) {
            return;
        }

        let isActive = true;
        let initTimer;
        
        // FINAL FIX: Debounce the core logic to prevent the immediate AbortError loop.
        initTimer = setTimeout(() => {
            if (!isActive) return;

            // Initiator Navigation (MUST HAPPEN HERE)
            try {
                if (currentRoom) {
                    navigate(`/directMessages/chat/${currentRoom}/video/call`);
                }
            } catch (e) {
                console.warn('Initiator Navigation failed:', e);
            }

            const initiateCall = async () => {
                if (!isActive) return;
                try {
                    // openMediaDevices is handled by Effect 4a
                    
                    await createPeerConnection();
                    if (!isActive) return;
                    
                    await createOffer();
                    
                    console.log('Call initiation sequence completed');
                } catch (err) {
                    console.error('Dial flow error', err);
                    if (isActive) {
                        setError(err);
                        setErrorCode(err?.code || WebRTCError.PEER_CONNECTION);
                        attemptReconnectionRef.current('call-init-failed'); 
                    }
                }
            };
            
            initiateCall();
            
        }, 100); // 100ms delay to let synchronous effects and cleanup finish

        return () => {
            isActive = false;
            clearTimeout(initTimer);
        };
    }, [callDialed, remoteUser, streamWrapper, createPeerConnection, createOffer, currentRoom, navigate]);

    // 5. Network Monitoring Effect (UNCHANGED)
    useEffect(() => {
        if (networkMonitorStopRef.current) networkMonitorStopRef.current();

        let recoveryTimer = null;

        networkMonitorStopRef.current = setupNetworkMonitoring((info) => {
            clearTimeout(recoveryTimer);

            if (connectionState === ConnectionState.CONNECTED && 
                (info.effectiveType === '2g' || info.effectiveType === 'slow-2g')) {
                
                console.warn('Poor network detected, scheduling reconnection check...');
                
                recoveryTimer = setTimeout(() => {
                    if (connectionState === ConnectionState.CONNECTED && 
                        (navigator.connection.effectiveType === '2g' || 
                        navigator.connection.effectiveType === 'slow-2g')) {
                        console.warn('Poor network persists, triggering reconnection...');
                        attemptReconnectionRef.current('network-degraded');
                    }
                }, 5000);
            }
        });

        return () => {
            clearTimeout(recoveryTimer);
            if (networkMonitorStopRef.current) {
                networkMonitorStopRef.current();
                networkMonitorStopRef.current = null;
            }
        };
    }, [connectionState]);

    // 6. Final Cleanup on Unmount (UNCHANGED)
    useEffect(() => {
        return () => {
            stopMediaDevices();
            if (networkMonitorStopRef.current) { networkMonitorStopRef.current(); networkMonitorStopRef.current = null; }
        };
    }, [stopMediaDevices]);


    /* ----------------
        Exposed API
    ----------------*/
    const providerValue = useMemo(() => ({
        localVideoRef,
        remoteVideoRef,
        stream: streamWrapper?.stream || null,
        remoteStream,
        isCameraOn,
        isMuted,
        toggleCamera,
        toggleMute,
        startCall,
        callDialed,
        setCallDialed,
        setRemoteUser,
        stopMediaDevices,
        openMediaDevices,
        tryActivateVideo, // EXPOSED NEW FUNCTION
        error,
        errorCode,
        connectionState,
        connectionQuality,
        _internal: {
            pcWrapperRef,
            pendingRemoteCandidatesRef,
            sentCandidatesRef,
            reconAttemptRef,
            isInitiatorRef: isInitiatorRef.current,
        },
    }), [
        streamWrapper, remoteStream, isCameraOn, isMuted,
        toggleCamera, toggleMute, stopMediaDevices, openMediaDevices,
        tryActivateVideo, error, errorCode, connectionState, connectionQuality, callDialed, startCall,
    ]);

    return (
        <UserMediaContext.Provider value={providerValue}>
            {children}
        </UserMediaContext.Provider>
    );
};

export default UserMediaContext;
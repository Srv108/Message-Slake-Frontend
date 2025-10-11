import { createContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { peerConnectionConfig } from '@/api/webrtc/peerConnectionConfig';
import { useAuth } from '@/hooks/context/useAuth';
import { useRoomDetails } from '@/hooks/context/useRoomDetails';
import { useSocket } from '@/hooks/context/useSocket';


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
        setCandidateRecieved
    } = useSocket();

    const { currentRoom } = useRoomDetails();

    const [ callDialed , setCallDialed ] = useState(false);
    const [ remoteUser, setRemoteUser ] = useState({
        email: null,
        id: null
    });

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
        try {
            console.log(' Requesting media devices...');
            const mediaStream = await navigator.mediaDevices.getUserMedia({ 
                video: true, 
                audio: true 
            });
    
            console.log('✅ Media devices opened:', mediaStream);
    
            setStream(mediaStream);  // Updating state
    
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = mediaStream;
            }
    
        } catch (error) {
            console.error(' Error opening media devices:', error);
        }
    };

    const stopMediaDevices = () => {
        if(stream){
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        navigate(-1);
    };

    const peerConnection = (function () {
        let peerConnection = null;
    
        const createPeerConnection = async (stream, socket, remoteVideoRef) => {
            if(!peerConnection){
                peerConnection = new RTCPeerConnection(peerConnectionConfig);
        
                /*  Add local stream to the peer connection */
                if (stream) {
                    stream.getTracks().forEach(track => {
                        peerConnection.addTrack(track, stream);
                    });
                }
        
                /* Listen for remote tracks */
                peerConnection.ontrack = (event) => {
                    console.log('Remote track received:', event.streams[0]);

                    if (event.streams[0] && remoteVideoRef?.current) {
                        console.log('Setting remote stream to video element');
                        remoteVideoRef.current.srcObject = event.streams[0];
                    } else {
                        console.error('Remote video element not found or stream is empty');
                    }
                };
        
                /* Handle ICE candidates */
                let sentCandidates = new Set();

                peerConnection.onicecandidate = (event) => {
                    if (event.candidate) {
                        const candidateString = JSON.stringify(event.candidate);
                        
                        if (!sentCandidates.has(candidateString)) {  // Prevent duplicate candidates
                            sentCandidates.add(candidateString);
                            
                            socket.emit('ice-candidate', { 
                                from: {
                                    username: auth?.user?.username, 
                                    id: auth?.user?.id,
                                    email: auth?.user?.email
                                },
                                to: {user: remoteUser, room: currentRoom}, 
                                candidate: event.candidate 
                            }, (ack) => {
                                if (ack?.success) {
                                    console.log('ICE candidate successfully sent and acknowledged by server:', ack.message);
                                } else {
                                    console.error(' Server did not acknowledge the ICE candidate:', ack);
                                }
                            });
                        }
                    }
                };
            }
            return peerConnection;
        };
    
        return {
            getInstance: async (stream, socket, remoteVideoRef) => {
                if (!peerConnection) {
                    peerConnection = await createPeerConnection(stream, socket, remoteVideoRef);
                }
                return peerConnection;
            },
            close: () => {
                if (peerConnection) {
                    peerConnection.close();
                    peerConnection = null;
                }
            }
        };
    })();
    
    
    const createOffer = async(peerConnectionInstance) => {
        try {

            if(!peerConnectionInstance) return;

            console.log(`user who are initialing call and send offer to ${remoteUser.email} id ${remoteUser.id} `);

            /* create an offer to send to the remote peer */
            const offer = await peerConnectionInstance.createOffer();
            console.log('offer is created',offer);

            /* now set offer to the local description */
            await peerConnectionInstance.setLocalDescription(offer);

            console.log('current room is ',currentRoom);
            /* now emit message and send it to the server  */
            socket.emit('offer',
                {
                    from: {
                        username: auth?.user?.username, 
                        id: auth?.user?.id,
                        email: auth?.user?.email
                    },
                    to: {user: remoteUser, room: currentRoom}, 
                    offer 
                },(ack) => {
                    if (ack?.success) {
                        console.log('✅ Offer successfully sent and acknowledged by server:', ack.message);
                    } else {
                        console.error('Server did not acknowledge the offer:', ack);
                    }
                }
            );

        } catch (error) {
            console.log('error in creating peer connection',error);
        }
    };

    const handleOffer = async({ offer, from, to }) => {
        try {
            
            /* open the media devices if not opened */
            if(!stream){
                await openMediaDevices();
                console.log('stream set to the remote peer');
            }

            /* now create a peer connection instance */
            const peerConnectionInstance = await peerConnection.getInstance(stream,socket,remoteVideoRef);

            if(!peerConnectionInstance){
                console.log(' Failed to get PeerConnection instance');
                return;
            }

            /* now set the coming offer to the remote description */
            await peerConnectionInstance.setRemoteDescription(new RTCSessionDescription(offer));
            console.log('Remote description (Offer) set');

            /* now create an answer and respond to the offer */
            const answer = await peerConnectionInstance.createAnswer();
            await peerConnectionInstance.setLocalDescription(answer);
            console.log('Answer created and set');

            socket.emit('answer',{ 
                answer, 
                from: from, 
                to: to
            },(ack) => {
                if(ack?.success){
                    console.log('Answer successfully sent and acknowledged by server:', ack.message);
                }else{
                    console.error('Server did not acknowledge the answer:', ack);
                }
            });


        } catch (error) {
            console.log('error coming in recieving offer',error);
        }
    };

    const handleAnswer = async(answer) => {
        try {
            const peerConnectionInstance = await peerConnection.getInstance(stream, socket, remoteVideoRef);

            if (peerConnectionInstance) {
                console.log('🔄 Current signaling state:', peerConnectionInstance.signalingState);

                // Handle case where signaling state is already stable (likely because answer is already set)
                if (peerConnectionInstance.signalingState === 'stable') {
                    console.warn('⚠️ Remote description might already be set. Skipping setRemoteDescription().');
                } 
                // Ensure that we set remote description in proper states
                else if (peerConnectionInstance.signalingState === 'have-local-offer' || peerConnectionInstance.signalingState === 'have-remote-offer') {
                    await peerConnectionInstance.setRemoteDescription(new RTCSessionDescription(answer));
                    console.log(' Remote description (Answer) set successfully.');
                } 
                // Unexpected state, log for debugging
                else {
                    console.warn('Unexpected signaling state:', peerConnectionInstance.signalingState);
                }
            } else {
                console.error(' Peer connection instance is null.');
            }
        } catch (error) {
            console.error('Error setting remote peer description:', error);
        }

    };

    const handleCandidate = async (candidate) => {
        try {
            const peerConnectionInstance = await peerConnection.getInstance(stream, socket, remoteVideoRef);
    
            if (peerConnectionInstance) {
                if (peerConnectionInstance.remoteDescription) {
                    await peerConnectionInstance.addIceCandidate(new RTCIceCandidate(candidate));
                    console.log('ICE candidate successfully added:', candidate);
                } else {
                    console.warn(' Waiting for remote description before adding ICE candidate...');
                    const interval = setInterval(async () => {
                        if (peerConnectionInstance.remoteDescription) {
                            await peerConnectionInstance.addIceCandidate(new RTCIceCandidate(candidate));
                            console.log(' ICE candidate successfully added after waiting:', candidate);
                            clearInterval(interval);
                        }
                    }, 100); // Check every 100ms
                }
            } else {
                console.error('Failed to get PeerConnection instance while handling ICE candidate.');
            }
        } catch (error) {
            console.error('Failed to set ICE candidate to the peer connection instance:', error);
        }
    };
    
    useEffect(() => {

        if(candidateRecieved){
            const candidate = candidateRecieved?.candidate;
            handleCandidate(candidate);
        }

        return () => {
            setCandidateRecieved(null);
        };
    },[ candidateRecieved ]);

    useEffect(() => {
        if(!acceptCall) return;
        console.log('Setting up listener for offer-recieved...');
        
        const accepted = window.confirm('Accept the call...',offerRecieved?.from?.user?.username);
        if(!accepted) return;

        if(offerRecieved && acceptCall && accepted){

            /* first navigate to the video call page with the given room id */
            navigate(`/directMessages/chat/${offerRecieved?.to?.room}/video/call`);

            console.log('now remote peer connection is estabilsihing ....');
            handleOffer({
                offer: offerRecieved?.offer,
                from: offerRecieved?.from,
                to: offerRecieved?.to
            });
        }
    
        return () => {
            socket.off('offer-recieved');
            setCallAccepted(false);
            setOfferRecieved(null);
        };
    }, [ acceptCall, offerRecieved ]);
    

    /* now set answer to the remote session  */
    useEffect(() => {
        const setRemoteDesc = async() => {
            if(answerRecieved){
                const answer = answerRecieved?.answer;
                await handleAnswer(answer);
            }
        };

        setRemoteDesc();

        return () => {
            setAnswerRecieved(null);
        };
    },[ answerRecieved ]);

    useEffect(() => {
        if(!currentRoom) console.log('room not available');
        const handleCallDialed = async () => {
            if (callDialed) {
                try {
                    await openMediaDevices();
                    console.log(' Media devices should be opening now...');
    
                } catch (error) {
                    console.log(' Retry to open media device:', error);
                }
            }
        };
        handleCallDialed();
    
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    
    }, [callDialed]);
    

    useEffect(() => { 

        console.log('available stream .....',stream);
        
        const handleCreateOffer = async () => {
            if(callDialed && stream){
                try {
                    
                    /* Create peer connection (singleton pattern) */
                    const peerConnectionInstance = await peerConnection.getInstance(stream, socket, remoteVideoRef);

                    /* Create and send offer */
                    await createOffer(peerConnectionInstance);

                } catch (error) {
                    console.error('Error in handling call dialed:', error);
                }
            }
        };
    
        handleCreateOffer();
    
        return () => {
            
            peerConnection.close(); // Close peer connection
        };
    }, [ callDialed, stream ]);
    


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
            callDialed,
            setCallDialed,
            setRemoteUser,
            stopMediaDevices,
            openMediaDevices,
        }} >
            { children }
        </UserMediaContext.Provider>
    );
};
export default UserMediaContext;
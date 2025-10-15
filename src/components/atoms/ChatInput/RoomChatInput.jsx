import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import { getPresignedUrlRequest, uploadImageToAwsPresignedUrl } from '@/api/s3';
import { useAuth } from '@/hooks/context/useAuth';
import { useRoomMessage } from '@/hooks/context/useRoomMessage';
import { useSocket } from '@/hooks/context/useSocket';
import { useToast } from '@/hooks/use-toast';

import { Editor } from '../Editor/Editor';

export const RoomChatInput = () => {
    const queryClient = useQueryClient();
    const { auth } = useAuth();
    const { socket, isSocketReady, currentRoom, isOnline } = useSocket();
    const { roomId } = useParams();
    const { toast } = useToast();
    const { addMessageToCurrentRoom } = useRoomMessage();
    
    const handleSubmit = useCallback(async ({ body, image }) => {
        try {
            console.log('🔍 RoomChatInput Debug:');
            console.log('  - socket exists:', !!socket);
            console.log('  - socket.connected:', socket?.connected);
            console.log('  - isSocketReady:', isSocketReady);
            console.log('  - isOnline:', isOnline);
            console.log('  - currentRoom:', currentRoom);

            // Check network status first
            if (!isOnline) {
                console.error('❌ Network offline');
                toast({
                    variant: 'destructive',
                    title: 'Network Error',
                    description: 'You are offline. Please check your internet connection.',
                });
                return;
            }

            // Validate socket connection
            if (!socket) {
                console.error('❌ Socket object is null/undefined');
                toast({
                    variant: 'destructive',
                    title: 'Connection Error',
                    description: 'Socket not initialized. Reconnecting...',
                });
                return;
            }

            if (!socket.connected || !isSocketReady) {
                console.error('❌ Socket not ready');
                console.error('  - Socket connected:', socket.connected);
                console.error('  - Socket ready:', isSocketReady);
                toast({
                    variant: 'destructive',
                    title: 'Connection Error',
                    description: 'Connecting to chat server... Please try again in a moment.',
                });
                return;
            }

            if (!currentRoom) {
                console.error('❌ No room selected');
                console.error('  - currentRoom value:', currentRoom);
                toast({
                    variant: 'destructive',
                    title: 'No Room',
                    description: 'Please select a chat room first.',
                });
                return;
            }

            console.log('✅ All validations passed!');
            console.log('📤 Sending message to room:', currentRoom);

            let fileUrl = null;
            let timeStamp = null;

            if(image) {
                console.log('📎 Uploading image...');
                const { presignedUrl, time } = await queryClient.fetchQuery({
                    queryKey: ['getPresignedUrl', image.name],
                    queryFn: () => getPresignedUrlRequest({ 
                        token: auth?.token,
                        fileName: image.name,
                        contentType: image.type
                    })
                });

                await uploadImageToAwsPresignedUrl({ 
                    url: presignedUrl,
                    file: image 
                });
                
                console.log('✅ Image uploaded successfully');
                fileUrl = presignedUrl.split('?')[0];
                timeStamp = time;
            }

            // Create temp ID matching server format
            const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            
            // Create optimistic message to show immediately
            const optimisticMessage = {
                _id: tempId,
                body,
                image: fileUrl,
                senderId: {
                    _id: auth?.user?.id,
                    username: auth?.user?.username,
                    avatar: auth?.user?.avatar
                },
                roomId: currentRoom || roomId,
                createdAt: new Date().toISOString(),
                isOptimistic: true
            };

            // Add message to UI immediately (optimistic update)
            console.log('⚡ Adding optimistic room message to UI');
            console.log('  - Temp ID:', tempId);
            addMessageToCurrentRoom(optimisticMessage);
            
            // Prepare message data for server
            const messageData = {
                roomId: String(currentRoom),
                body,
                image: fileUrl,
                senderId: auth?.user?.id,
                filename: image?.name || '',
                timeStamp: timeStamp,
            };

            console.log('📡 Emitting roomMessage event to socket server');
            console.log('📡 Message data:', messageData);
            
            // Emit message - server will send separate events for confirmation
            socket.emit('roomMessage', messageData, (response) => {
                console.log('📬 Server response received:', response);

                /* TODO */
                /* we can implement here nexted message reply if any message failed to send  and create a new message or modify the send message with tab message failed to send....*/
                if (!response?.success) {
                    console.error('❌ Room message send failed:', response);
                    toast({
                        variant: 'destructive',
                        title: 'Failed to send message',
                        description: response?.message || 'Please try again.',
                    });
                }
            });
        } catch (error) {
            console.error('❌ Error sending room message:', error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to send message. Please try again.',
            });
        }
    }, [socket, isSocketReady, isOnline, currentRoom, roomId, auth, queryClient, toast, addMessageToCurrentRoom]);

    return (
        <div className="px-5 w-full bg-transparent">
            <Editor
                placeholder="Type a message..."
                onSubmit={handleSubmit}
                onCancel={() => {}}
                disabled={false}
                defaultValue=""
            />
        </div>
    );
};
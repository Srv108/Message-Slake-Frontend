import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import { getPresignedUrlRequest, uploadImageToAwsPresignedUrl } from '@/api/s3';
import { useAuth } from '@/hooks/context/useAuth';
import { useChannelMessage } from '@/hooks/context/useChannelMessage';
import { useSocket } from '@/hooks/context/useSocket';
import { useWorkspace } from '@/hooks/context/useWorkspace';
import { useToast } from '@/hooks/use-toast';

import { Editor } from '../Editor/Editor';

export const ChatInput = () => {

    const queryClient = useQueryClient();
    const { auth } = useAuth();
    const { socket, currentChannel, isSocketReady, isOnline } = useSocket();
    const { currentWorkspace } = useWorkspace();
    const { toast } = useToast();
    const { setMessageList } = useChannelMessage();
    const { workspaceId, channelId } = useParams();
    
    const handleSubmit = useCallback(async ({ body, image }) => {
        try {
            console.log('🔍 ChatInput Debug:');
            console.log('  - socket exists:', !!socket);
            console.log('  - socket.connected:', socket?.connected);
            console.log('  - isSocketReady:', isSocketReady);
            console.log('  - isOnline:', isOnline);
            console.log('  - currentChannel:', currentChannel);

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

            if (!currentChannel) {
                console.error('❌ No channel selected');
                toast({
                    variant: 'destructive',
                    title: 'No Channel',
                    description: 'Please select a channel first.',
                });
                return;
            }

            console.log('✅ All validations passed!');
            console.log('📤 Preparing to send message to channel:', currentChannel);
            console.log('📤 Message body:', body);
            console.log('📤 Has image:', !!image);
            console.log('🔌 Socket connected:', socket.connected);
            console.log('🔌 Socket ID:', socket.id);

            let fileUrl = null;

            if(image) {
                const presignedUrl = await queryClient.fetchQuery({
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
                channelId: currentChannel ?? channelId.toString(),
                workspaceId: currentWorkspace?._id || workspaceId.toString(),
                createdAt: new Date().toISOString(),
                isOptimistic: true // Server uses isOptimistic
            };

            // Add message to UI immediately (optimistic update)
            console.log('⚡ Adding optimistic channel message to UI');
            console.log('  - Temp ID:', tempId);
            setMessageList((prevList) => [...prevList, optimisticMessage]);

            // Prepare message data for server
            const messageData = {
                channelId: String(currentChannel) || channelId.toString(),
                body,
                image: fileUrl,
                senderId: auth?.user?.id,
                workspaceId: currentWorkspace?._id || workspaceId.toString()
            };

            console.log('📡 Emitting NewMessage event to socket server');
            console.log('📡 Message data:', messageData);
            console.log('📡 Socket object:', socket);

            // Emit message - server will send separate events for confirmation
            socket.emit('NewMessage', messageData, (response) => {
                console.log('📬 Server response received:', response);
                if (response?.success) {
                    console.log('✅ Channel message sent successfully');
                    console.log('  - Timing:', response.timing);
                    console.log('  - Delivery:', response.delivery);
                    // Server will emit channelMessageSent and channelMessageConfirmed events
                    // No need to update UI here - events will handle it
                } else {
                    console.error('❌ Channel message send failed:', response);
                    // Remove optimistic message on failure
                    setMessageList((prevList) => 
                        prevList.filter(msg => msg._id !== tempId)
                    );
                    toast({
                        variant: 'destructive',
                        title: 'Failed to send message',
                        description: response?.message || 'Please try again.',
                    });
                }
            });
        } catch (error) {
            console.error('❌ Error sending message:', error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to send message. Please try again.',
            });
        }
    }, [socket, isSocketReady, isOnline, currentChannel, auth?.token, auth?.user?.id, auth?.user?.username, auth?.user?.avatar, currentWorkspace?._id, queryClient, toast, setMessageList]);
    return (
        <div
            className="px-5 w-full"
        >
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
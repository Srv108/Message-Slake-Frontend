import { useQueryClient } from '@tanstack/react-query';

import { getPresignedUrlRequest, uploadImageToAwsPresignedUrl } from '@/api/s3';
import { useAuth } from '@/hooks/context/useAuth';
import { useRoomDetails } from '@/hooks/context/useRoomDetails';
import { useSocket } from '@/hooks/context/useSocket';

import { Editor } from '../Editor/Editor';

export const RoomChatInput = () => {

    const queryClient = useQueryClient();
    const { auth } = useAuth();
    const { socket } = useSocket();
    const { currentRoom } = useRoomDetails();
    
    async function handleSubmit({ body, image }){
        let fileUrl = null;
        let timeStamp = null;

        if(image) {
            const { presignedUrl, time } = await queryClient.fetchQuery({
                queryKey: ['getPresignedUrl'],
                queryFn: () => getPresignedUrlRequest({ 
                    token: auth?.token,
                    fileName: image.name,
                    contentType: image.type
                })
            });

            const responseAws = await uploadImageToAwsPresignedUrl({ 
                url: presignedUrl,
                file: image 
            });
            
            console.log('file upload success',responseAws);
            fileUrl = presignedUrl.split('?')[0];
            timeStamp = time;
            console.log(fileUrl);
        }
        
        socket.emit('roomMessage',{
            roomId: currentRoom,
            body,
            image: fileUrl,
            senderId: auth?.user?.id,
            filename: image?.name || '',
            timeStamp: timeStamp,
        },(data)=>{
            console.log('room id is',currentRoom);
            console.log('Message Sent',data);
        });
    }
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
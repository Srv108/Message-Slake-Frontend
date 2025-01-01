import { useAuth } from '@/hooks/context/useAuth';
import { useSocket } from '@/hooks/context/useSocket';
import { useWorkspace } from '@/hooks/context/useWorkspace';

import { Editor } from '../Editor/Editor';

export const ChatInput = () => {

    const { auth } = useAuth();
    const { socket, currentChannel } = useSocket();
    const { currentWorkspace } = useWorkspace();
    async function handleSubmit({ body }){
        console.log(body);
        socket.emit('NewMessage',{
            channelId: currentChannel,
            body,
            senderId: auth?.user?.id,
            workspaceId: currentWorkspace?._id
        },(data)=>{
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
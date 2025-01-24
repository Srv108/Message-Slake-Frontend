import { DefaultChatInput } from '@/components/atoms/ChatInput/DefaultChatInput';

export const Member = () => {

    return (
        <div className='flex flex-col h-full bg-slack-medium'>

            <div className='flex-1' /> 
            <DefaultChatInput />
        </div>
    );
};
import { Editor } from '../Editor/Editor';

export const ChatInput = () => {

    
    return (
        <div
            className="px-5 w-full"
        >
            <Editor
                placeholder="Type a message..."
                onSubmit={() => {}}
                onCancel={() => {}}
                disabled={false}
                defaultValue=""
            />
        </div>
    );
};
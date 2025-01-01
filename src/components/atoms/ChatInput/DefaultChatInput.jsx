import { DefaultEditor } from '../Editor/DefaultEditor';

export const DefaultChatInput = () => {

    return (
        <div
            className="px-5 w-full"
        >
            <DefaultEditor
                placeholder="Type a message..."
                onSubmit={() => {}}
                onCancel={() => {}}
                disabled={false}
                defaultValue=""
            />
        </div>
    );
};
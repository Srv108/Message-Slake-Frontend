import 'quill/dist/quill.snow.css'; // ES6

import { ImageIcon } from 'lucide-react';
import Quill from 'quill';
import { useEffect, useRef, useState } from 'react'; 
import { MdSend } from 'react-icons/md';
import { PiTextAa } from 'react-icons/pi';

import { Button } from '@/components/ui/button';



export const Editor = ({
    onSubmit
}) => {

    const containerRef = useRef(); // read to initialise the container
    const defaultValueRef = useRef();
    const quillRef = useRef();
    const [ isToolbarVisible,setIsToolbarVisible ] = useState(false);

    function toggleToolbar(){
        setIsToolbarVisible(!isToolbarVisible);
        const toolbar = containerRef.current.querySelector('.ql-toolbar');
        if(toolbar){
            toolbar.classList.toggle('hidden');
        }
    }

    useEffect(() => {
        if(!containerRef.current) return; // if container is not initialised then return 

        const container = containerRef.current;
        const editorContainer = container.appendChild(container.ownerDocument.createElement('div')); // create a new div element and append it to the  container

        const options = {
            theme: 'snow',
            modules: {
                toolbar: [
                    ['bold', 'italic', 'underline', 'strike'],
                    ['link'],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    ['image'],
                    ['clean']
                ],
                keyboard: {
                    bindings: {
                        enter: {
                            key: 'Enter',
                            handler: () => {
                                return;
                            }
                        },
                        shift_enter: {
                            key: 'Enter',
                            shiftKey: true,
                            handler: () => {
                                quill.insertText(quill.getSelection()?.index || 0, '\n'); // insert a new line
                            }
                        }
                    }
                }
            }
        };

        const quill = new Quill(editorContainer,options);
        quillRef.current = quill;
        quillRef.current.focus();

        quill.setContents(defaultValueRef.current);
        
    },[]);

    return (
        <div className="flex flex-col mb-5">
            <div 
                className="relative flex flex-row items-center border border-slate-300 rounded-md overflow-hidden focus-within:shadow-sm focus-within:border-slate-400 bg-white"
            >
                <div ref={containerRef} className="h-full ql-custom w-4/5" />
                
                <div className="absolute bottom-0 right-0 flex flex-row justify-center items-center space-x-2 p-1 bg-white">
                    <Button
                        size="iconSm"
                        variant="ghost"
                        disabled={false}
                        onClick={toggleToolbar}
                    >
                        <PiTextAa className="size-5" />
                    </Button>

                    <Button
                        size="iconSm"
                        variant="ghost"
                        disabled={false}
                        onClick={() => {}}
                    >
                        <ImageIcon className="size-5" />
                    </Button>

                    <Button
                        className="h-7 rounded-md  bg-[#007a6a] hover:bg-[#007a6a]/80 text-white"
                        onClick={() => {
                            const messageContent = JSON.stringify(quillRef.current?.getContents());
                            onSubmit({ body: messageContent });
                            quillRef.current?.setText('');
                        }}
                        disabled={false}
                    >
                        <MdSend className="size-5" />
                    </Button>
                </div>
            </div>
        </div>
    );
};
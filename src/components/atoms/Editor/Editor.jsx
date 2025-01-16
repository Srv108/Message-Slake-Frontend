import 'quill/dist/quill.snow.css'; // ES6

import { ImageIcon, XIcon } from 'lucide-react';
import Quill from 'quill';
import { useEffect, useRef, useState } from 'react'; 
import { MdSend } from 'react-icons/md';
import { PiTextAa } from 'react-icons/pi';

import { Button } from '@/components/ui/button';



export const Editor = ({
    onSubmit
}) => {

    const imageRef = useRef(null);  // read to file input
    const containerRef = useRef(); // read to initialise the container
    const defaultValueRef = useRef();
    const quillRef = useRef();
    // const [isEmpty, setIsEmpty] = useState(false);

    const [image, setImage] = useState(null);
    const [ isToolbarVisible,setIsToolbarVisible ] = useState(false);

    function toggleToolbar(){
        setIsToolbarVisible(prevState => !prevState);
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
                    ['clean']
                ],
                keyboard: {
                    bindings: {
                        enter: {
                            key: 'Enter',
                            handler: () => {
                                return handleSubmit();
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

    useEffect(() => {
        if (!containerRef.current) return;

        const toolbar = containerRef.current.querySelector('.ql-toolbar');
        if (toolbar) {
            if (isToolbarVisible) {
                toolbar.classList.remove('hidden');
            } else {
                toolbar.classList.add('hidden');
            }
        }
    }, [isToolbarVisible]);


    function handleSubmit(){
        const messageContent = JSON.stringify(quillRef.current?.getContents());
        const content = quillRef.current.getText().trim();
        if(!content && !image) return;
        onSubmit({ body: messageContent ,image: image});
        quillRef.current?.setText('');
        setImage(null);
        imageRef.current.value = '';
    }

    return (
        <div className="flex flex-col mb-5">
            <div 
                className="relative flex flex-row items-center border border-slate-300 rounded-md overflow-hidden focus-within:shadow-sm focus-within:border-slate-400 bg-white"
            >
                <div ref={containerRef} className="h-full ql-custom w-4/5" />
                {
                    image &&  (
                        <div className='p-2'>
                            <div
                                className='relative size-[50px] flex items-center justify-center group/image'
                            > 
                                <button
                                    className='hidden group-hover/image:flex rounded-full bg-black/70 hover:bg-black absolute -top-2.5 -right-2.5 text-white size-6 z-[5] border-2 border-white items-center justify-center'
                                    onClick={() => {
                                        setImage(null);
                                        imageRef.current.value = '';
                                    }}
                                >

                                    <XIcon className='size-3' />
                                </button>
                                <img
                                    src={URL.createObjectURL(image)}
                                    className='rounded-xl overflow-hidden border object-cover'
                                />
                            </div>
                        </div>
                    )
                }
                
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
                        onClick={() => {
                            imageRef.current.click();
                        }}
                    >
                        <ImageIcon className="size-5" />
                    </Button>

                    <input
                        type='file'
                        ref={imageRef}
                        onChange={(e) => setImage(e.target.files[0])}
                        className='hidden'
                    />

                    <Button
                        className="h-7 rounded-md  bg-[#007a6a] hover:bg-[#007a6a]/80 text-white"
                        onClick={handleSubmit}
                        disabled={false}
                    >
                        <MdSend className="size-5" />
                    </Button>
                </div>
            </div>
        </div>
    );
};
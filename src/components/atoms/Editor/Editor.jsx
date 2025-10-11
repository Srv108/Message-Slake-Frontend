import 'quill/dist/quill.snow.css'; // ES6

import { Camera, FileIcon, Paperclip, XIcon } from 'lucide-react';
import Quill from 'quill';
import { useEffect, useRef, useState } from 'react'; 
import { MdSend } from 'react-icons/md';
import { PiTextAa } from 'react-icons/pi';

import { Button } from '@/components/ui/button';



export const Editor = ({
    onSubmit
}) => {

    const imageRef = useRef(null);  // for image/camera input
    const fileRef = useRef(null);   // for general file attachments
    const containerRef = useRef(); // read to initialise the container
    const defaultValueRef = useRef();
    const quillRef = useRef();
    const submitRef = useRef(onSubmit); // Keep latest onSubmit reference
    const setImageRef = useRef(null); // Keep reference to setImage function

    const [image, setImage] = useState(null);
    const [isToolbarVisible, setIsToolbarVisible] = useState(false);
    const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);

    // Store setImage in ref so keyboard handler can access it
    useEffect(() => {
        setImageRef.current = setImage;
    }, []);

    // Update submit ref when onSubmit changes
    useEffect(() => {
        submitRef.current = onSubmit;
    }, [onSubmit]);

    // Helper function to check if file is an image
    const isImageFile = (file) => {
        if (!file) return false;
        return file.type.startsWith('image/');
    };

    // Helper function to get file extension
    const getFileExtension = (file) => {
        if (!file) return '';
        const name = file.name;
        return name.slice(name.lastIndexOf('.') + 1).toUpperCase();
    };

    // Helper function to format file size
    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    function toggleToolbar(){
        setIsToolbarVisible(prevState => !prevState);
    }

    // Handle file selection
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
        }
    };

    // Handle attachment menu item click
    const handleAttachmentType = (type) => {
        setShowAttachmentMenu(false);
        if (fileRef.current) {
            switch(type) {
                case 'image':
                    fileRef.current.accept = 'image/*';
                    break;
                case 'video':
                    fileRef.current.accept = 'video/*';
                    break;
                case 'audio':
                    fileRef.current.accept = 'audio/*';
                    break;
                case 'document':
                    fileRef.current.accept = '.pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx';
                    break;
                default:
                    fileRef.current.accept = '*';
            }
            fileRef.current.click();
        }
    };

    // Clear file
    const clearFile = () => {
        setImage(null);
        if (imageRef.current) {
            imageRef.current.value = '';
        }
    };

    useEffect(() => {
        if(!containerRef.current) return; // if container is not initialised then return 
        if(quillRef.current) return; // Prevent re-initialization

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
                                // Get current state via DOM
                                const messageContent = JSON.stringify(quillRef.current.getContents());
                                const content = quillRef.current.getText().trim();
                                
                                // Get current image from file input
                                const currentImage = imageRef.current?.files?.[0] || null;
                                
                                if(!content && !currentImage) return true; // Return true to allow default behavior if empty
                                
                                // Submit the message using latest ref
                                if(submitRef.current) {
                                    submitRef.current({ body: messageContent, image: currentImage });
                                }
                                
                                quillRef.current.setText('');
                                
                                // Clear file input and state
                                if(imageRef.current) {
                                    imageRef.current.value = '';
                                }
                                if(setImageRef.current) {
                                    setImageRef.current(null);
                                }
                                
                                return false; // Prevent default Enter behavior
                            }
                        },
                        shift_enter: {
                            key: 'Enter',
                            shiftKey: true,
                            handler: () => {
                                quillRef.current.insertText(quillRef.current.getSelection()?.index || 0, '\n'); // insert a new line
                                return false; // Prevent default behavior
                            }
                        }
                    }
                }
            }
        };

        const quill = new Quill(editorContainer, options);
        quillRef.current = quill;
        quillRef.current.focus();

        if(defaultValueRef.current) {
            quill.setContents(defaultValueRef.current);
        }

        // Cleanup function
        return () => {
            if(quillRef.current) {
                quillRef.current = null;
            }
            if(container) {
                container.innerHTML = ''; // Clear the container
            }
        };
    }, []);

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
        onSubmit({ body: messageContent, image: image});
        quillRef.current?.setText('');
        clearFile();
    }

    return (
        <div className="flex flex-col mb-3 gap-2">
            {/* File Preview Section - Compact version above input */}
            {image && (
                <div className="px-2 py-1.5 bg-blue-50 border border-blue-200 rounded-md file-preview-enter flex items-center gap-2">
                    {/* File Preview - Smaller */}
                    <div className="relative flex-shrink-0">
                        {isImageFile(image) ? (
                            <div className="relative w-10 h-10 rounded overflow-hidden border border-blue-300">
                                <img
                                    src={URL.createObjectURL(image)}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ) : (
                            <div className="w-10 h-10 rounded bg-blue-100 border border-blue-300 flex flex-col items-center justify-center">
                                <FileIcon className="w-4 h-4 text-blue-600" />
                                <span className="text-[8px] font-semibold text-blue-700">
                                    {getFileExtension(image)}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* File Info - Compact */}
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-900 truncate">
                            {image.name}
                        </p>
                        <p className="text-[10px] text-gray-500">
                            {formatFileSize(image.size)}
                        </p>
                    </div>

                    {/* Remove button - Smaller */}
                    <button
                        onClick={clearFile}
                        className="flex-shrink-0 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-all"
                        title="Remove file"
                    >
                        <XIcon className="w-3 h-3" />
                    </button>
                </div>
            )}

            {/* Editor Container - WhatsApp style */}
            <div className="relative flex items-end gap-2 bg-transparent">
                {/* Hidden file inputs */}
                <input
                    type="file"
                    ref={imageRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                />
                <input
                    type="file"
                    ref={fileRef}
                    onChange={handleFileChange}
                    className="hidden"
                />

                {/* Editor with icons inside */}
                <div className="flex-1 relative border border-gray-300/50 rounded-3xl focus-within:border-[#007a6a] transition-colors bg-white/80 backdrop-blur-md shadow-sm">
                    {/* Quill Editor */}
                    <div ref={containerRef} className="ql-custom-compact max-h-[120px]" />
                    
                    {/* Bottom right icons - Camera and Attachment */}
                    <div className="absolute bottom-2 right-2 flex items-center gap-1 z-10">
                        {/* Camera button */}
                        <button
                            onClick={() => imageRef.current?.click()}
                            title="Send image"
                            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <Camera className="w-5 h-5 text-gray-500 hover:text-[#007a6a]" />
                        </button>
                        
                        {/* Attachment button with menu */}
                        <div className="relative">
                            <button
                                onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
                                title="Attach file"
                                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <Paperclip className="w-5 h-5 text-gray-500 hover:text-[#007a6a]" />
                            </button>
                            
                            {/* Attachment menu */}
                            {showAttachmentMenu && (
                                <div className="absolute bottom-full right-0 mb-2 bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-[160px] z-50">
                                    <button
                                        onClick={() => handleAttachmentType('document')}
                                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-3 transition-colors"
                                    >
                                        <FileIcon className="w-4 h-4 text-blue-600" />
                                        <span className="text-gray-700">Document</span>
                                    </button>
                                    <button
                                        onClick={() => handleAttachmentType('image')}
                                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-3 transition-colors"
                                    >
                                        <Camera className="w-4 h-4 text-purple-600" />
                                        <span className="text-gray-700">Photos</span>
                                    </button>
                                    <button
                                        onClick={() => handleAttachmentType('video')}
                                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-3 transition-colors"
                                    >
                                        <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                        <span className="text-gray-700">Video</span>
                                    </button>
                                    <button
                                        onClick={() => handleAttachmentType('audio')}
                                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-3 transition-colors"
                                    >
                                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                        </svg>
                                        <span className="text-gray-700">Audio</span>
                                    </button>
                                </div>
                            )}
                        </div>
                        
                        {/* Format toggle button */}
                        <button
                            onClick={toggleToolbar}
                            title="Toggle formatting"
                            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <PiTextAa className="w-4 h-4 text-gray-500" />
                        </button>
                    </div>
                </div>

                {/* Right side - Send button */}
                <Button
                    className="h-11 w-11 flex-shrink-0 rounded-full bg-[#007a6a] hover:bg-[#007a6a]/90 text-white transition-all p-0 flex items-center justify-center shadow-md hover:shadow-lg"
                    onClick={handleSubmit}
                    disabled={false}
                >
                    <MdSend className="w-6 h-6" />
                </Button>
            </div>
            
            {/* Click outside to close attachment menu */}
            {showAttachmentMenu && (
                <div 
                    className="fixed inset-0 z-30" 
                    onClick={() => setShowAttachmentMenu(false)}
                />
            )}
        </div>
    );
};
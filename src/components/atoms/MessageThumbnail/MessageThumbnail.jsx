import { useState } from 'react';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

export const MessageThumbnail = ({ url }) => {

    const [open,setOpen] = useState(false);
    function handleClose(){
        setOpen(false);
    }
    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}
        >
            <DialogTrigger>
            <div className='relative overflow-hidden cursor-zoom-in border rounded-lg max-w-full max-h-[300px] mb-3'>
                <img 
                    src={url} 
                    className='rounded-md w-auto h-auto' 
                />
            </div>
            </DialogTrigger>
            <DialogContent
                className="[&>button]:hidden bg-transparent p-0 shadow-none flex justify-center items-center border-none"
            >   
                    <img 
                        src={url} 
                        className='rounded-md object-contain max-w-[100vw] max-h-[100vh]' 
                        onDoubleClick={handleClose}
                    />
                    
            </DialogContent>
        </Dialog>
    );
};

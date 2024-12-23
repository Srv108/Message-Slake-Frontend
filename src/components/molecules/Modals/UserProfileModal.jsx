
import { useQueryClient } from '@tanstack/react-query';
import {  PencilIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogTitle, } from '@/components/ui/dialog';
import { useUpdateProfilePic } from '@/hooks/api/user/useUpdateProfilePic';
import { useAcceptFile } from '@/hooks/context/useAcceptFile';
import { useAuth } from '@/hooks/context/useAuth';
import { useProfileModal } from '@/hooks/context/useProfileModal';

export const UserProfileModal = () => {

    const { auth } = useAuth();
    const queryClient = useQueryClient();

    const [deletePic, setDeletePic] = useState(false);
    const [openEditPic, setOpenEditPic] = useState(false);
    const [openProfilePic, setOpenProfilePic] = useState(false);

    const { openProfileModal, setOpenProfileModal } = useProfileModal();
    const { file, setFile, setPreview, setOpenAcceptFileModal } = useAcceptFile();

    const { updateProfilePicMutation } = useUpdateProfilePic();

    useEffect(() => {
        if(file) {
            handleUploadImage();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[file,deletePic,setDeletePic,openProfilePic]);

    async function handleUploadImage(){
        setOpenEditPic(false);
        try{
            const formData = new FormData();
            formData.append('avatar',file);

            await updateProfilePicMutation(formData);
            queryClient.invalidateQueries(`userDetails-${auth?.user?.id}`);
        }catch(error){
            console.log('failed to upload the image',error);
        } finally{
            setFile(null);
            setPreview(null);
            setDeletePic(false);
        }
    }

    function handleProfilePicture(){
        setOpenProfilePic(true);
    }
    return (
        <Dialog
            open={openProfileModal}
            onOpenChange={() => setOpenProfileModal(false)}
        >
            <DialogContent className='h-3/4 p-1'>
                <div className="h-full w-full bg-slack-medium border border-zinc-800 rounded-lg shadow-lg overflow-hidden">
                    <div className="p-6 text-center h-4/6 flex flex-col items-center justify-center space-y-6 bg-center bg-cover bg-no-repeat backdrop-blur-md bg-[url('https://gratisography.com/wp-content/uploads/2024/10/gratisography-cool-cat-800x525.jpg')] " >
                        <img src={(deletePic) ? '' : auth?.user?.avatar} className={`${deletePic ? 'border-0' : 'w-60 h-60 rounded-full object-cover border-2 border-slate-300 cursor-pointer'}  `} />
                        <div onClick={() => setOpenEditPic(true)} className='absolute right-2 bottom-2 cursor-pointer p-0.5 rounded-full border-2 bg-slack hover:bg-slack-dark'>
                            <PencilIcon className='size-5 text-white' />
                        </div>
                        <Dialog
                            open={openEditPic}
                            onOpenChange={() => setOpenEditPic(false)}
                        >
                            <DialogContent className="p-6 rounded-lg shadow-xl bg-slack-medium w-full max-w-sm mx-auto">
                                <div className="flex flex-col justify-center items-center space-y-4">
                                    <div className="flex flex-col space-y-2">
                                        <Dialog
                                            open={openProfilePic}
                                            onOpenChange={() => setOpenProfilePic(false)}
                                        >
                                            <Button 
                                                variant='outline'
                                                onClick={handleProfilePicture}
                                                className="text-blue-500 hover:text-blue-700 border-2 focus:outline-none text-center py-2 rounded-md transition duration-200 ease-in-out transform hover:scale-105"
                                            >
                                                See Profile Pic
                                            </Button>
                                            <DialogContent className='p-0' >
                                                <div>
                                                    <img src={(deletePic) ? '' : auth?.user?.avatar} className={`${deletePic ? 'border-0' : 'w-full h-full rounded-lg object-cover border-2 border-slate-300'}  `} />
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                        
                                        <Button 
                                            variant='outline'
                                            onClick={() => {
                                                setDeletePic(true);
                                                setOpenEditPic(false);
                                            }}
                                            className="text-red-500 hover:text-red-700 border-2 focus:outline-none text-center px-4 py-2 rounded-md transition duration-200 ease-in-out transform hover:scale-105">
                                            Remove Profile Pic
                                        </Button>
                                        
                                        <Button 
                                            variant='outline'
                                            onClick={() => setOpenAcceptFileModal(true)}
                                            className="text-green-500 hover:text-green-700 border-2 focus:outline-none text-center px-4 py-2 rounded-md transition duration-200 ease-in-out transform hover:scale-105">
                                            Upload New Profile Pic
                                        </Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>

                    </div>
                    <DialogTitle className="flex flex-col space-y-1">
                        <div className='flex flex-col items-center'>
                            <p className="flex font-serif text-lg text-white mt-5">
                                <span> {auth?.user?.username} </span>
                            </p>
                            <p className="flex items-center font-serif text-sm text-center text-white">
                                {auth?.user?.about || 'Jai Siya Ram ❤️'}
                            </p>
                        </div>
                    </DialogTitle>
                    <DialogClose className="absolute right-4 bottom-4 p-2 space-x-3">
                        <Button 
                            variant='outline'
                        >
                            Edit
                        </Button>
                        <Button 
                            variant='outline'
                        >
                            Close
                        </Button>
                    </DialogClose>

                </div>
            </DialogContent>
        </Dialog>
    );
};
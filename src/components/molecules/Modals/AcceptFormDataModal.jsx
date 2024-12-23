
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAcceptFile } from '@/hooks/context/useAcceptFile';

export const AcceptFormDataModal = () => {

    const { setFile, setPreview, openAcceptFileModal, setOpenAcceptFileModal} = useAcceptFile();

    function handleFileChange(e){

        e.preventDefault();
        const selectedFile = e.target.files[0];
        if (selectedFile){
            setFile(selectedFile);
            const fileUrl = URL.createObjectURL(selectedFile);
            setPreview(fileUrl);
        }
        setOpenAcceptFileModal(false);
    }

    return (
        <Dialog
            open={openAcceptFileModal}
            onOpenChange={() => setOpenAcceptFileModal(false)}
        >
            <DialogContent className='bg-slack'>
                <DialogHeader className='flex justify-center items-center' >
                    <DialogTitle className='flex'> <span className='font-serif text-xl text-white'> Drop your file </span>  </DialogTitle>
                </DialogHeader>
                <div className='flex flex-col items-center justify-center pt-5'>
                    <div className="group relative flex items-center justify-center w-1/2 h-32 bg-slate-600 hover:bg-slate-800 rounded-md border-2 transition-colors duration-300 ease-in-out">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            id="fileInput"
                            className="absolute inset-0 opacity-0 cursor-pointer z-10 pointer-events-auto"
                        />
                        
                        <label
                            htmlFor="fileInput"
                            className="text-white text-lg font-sans py-3 px-6 cursor-pointer"
                        >
                            Choose File
                        </label>
                    </div>
                </div>

            </DialogContent>
        </Dialog>
    );
};
import { ImageIcon } from 'lucide-react';
import { MdSend } from 'react-icons/md';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const DefaultEditor = () => {

    return (
        <div className="flex flex-col mb-5">
            <div 
                className="relative flex flex-row items-center w-full border border-slate-300 rounded-md overflow-hidden focus-within:shadow-sm focus-within:border-slate-400 bg-white"
            >
                <div className="flex-1">
                    <Input
                        className="w-full h-10 p-2 text-sm rounded-md focus:ring-2 focus:ring-blue-500"
                        placeholder="Type your message..." 
                    />
                </div>

                {/* Image Button */}
                <Button
                    size="iconSm"
                    variant="ghost"
                    className="p-2 ml-2 hover:bg-gray-200 rounded-full"
                    onClick={() => {}}
                >
                    <ImageIcon className="size-8" />
                </Button>

                {/* Send Button */}
                <Button
                    size="iconSm"
                    className="p-2 m-1 h-8 rounded-md bg-[#007a6a] hover:bg-[#007a6a]/80 text-white"
                    onClick={() => {}}
                    disabled={false}
                >
                    <MdSend className="size-5" />
                </Button>
            </div>
        </div>
    );
};
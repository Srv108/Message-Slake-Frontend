import Picker from '@emoji-mart/react';
import { Smile } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';


export const EmojiPicker = ({
    onSelect,
    'aria-label': ariaLabel = 'Select emoji',
    className = '',
    }) => {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    // Handle closing the Popover when an emoji is selected
    const handleEmojiSelect = (emoji) => {
        onSelect(emoji.native); // Pass the selected emoji to the parent component
        setIsPopoverOpen(false); // Close the Popover after selection
    };

    return (
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
            <Button
            className={`h-7 w-7 text-muted-foreground hover:bg-primary-hover/10 dark:hover:bg-primary-hover/20 focus-visible:ring-2 focus-visible:ring-offset-2 ${className}`}
            variant="ghost"
            size="icon"
            aria-label={ariaLabel}
            >
            <Smile className="h-4 w-4" />
            </Button>
        </PopoverTrigger>
        <PopoverContent
            align="start"
            className="p-0 w-[320px] shadow-md rounded-lg"
        >
            <Picker onEmojiSelect={handleEmojiSelect} />
        </PopoverContent>
        </Popover>
    );
};

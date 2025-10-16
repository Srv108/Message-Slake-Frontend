import { Search, UserPlus, X } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAddMemberContext } from '@/hooks/context/useAddMemberContext';

export const AddMemberWorkspaceModal = () => {
    const [username, setUsername] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const {
        openAddMemberModal,
        setOpenAddMemberModal,
        formSubmitHandler,
        isPending,
    } = useAddMemberContext();

    const allUsers = useMemo(
        () => [
        { id: 1, name: 'saurabh_k', fullName: 'Saurabh Kumar' },
        { id: 2, name: 'alice', fullName: 'Alice Johnson' },
        { id: 3, name: 'bob_smith', fullName: 'Bob Smith' },
        { id: 4, name: 'charlie_dev', fullName: 'Charlie Dev' },
        { id: 5, name: 'nina_01', fullName: 'Nina Patel' },
        { id: 6, name: 'rohit_777', fullName: 'Rohit Sharma' },
        { id: 7, name: 'lily_rose', fullName: 'Lily Rose' },
        { id: 8, name: 'mark_dev', fullName: 'Mark Watson' },
        { id: 9, name: 'anna_j', fullName: 'Anna James' },
        { id: 10, name: 'johnny_tech', fullName: 'Johnny Tech' },
        { id: 1, name: 'saurabh_k', fullName: 'Saurabh Kumar' },
        { id: 2, name: 'alice', fullName: 'Alice Johnson' },
        { id: 3, name: 'bob_smith', fullName: 'Bob Smith' },
        { id: 4, name: 'charlie_dev', fullName: 'Charlie Dev' },
        { id: 5, name: 'nina_01', fullName: 'Nina Patel' },
        { id: 6, name: 'rohit_777', fullName: 'Rohit Sharma' },
        { id: 7, name: 'lily_rose', fullName: 'Lily Rose' },
        { id: 8, name: 'mark_dev', fullName: 'Mark Watson' },
        { id: 9, name: 'anna_j', fullName: 'Anna James' },
        { id: 10, name: 'johnny_tech', fullName: 'Johnny Tech' },
        { id: 1, name: 'saurabh_k', fullName: 'Saurabh Kumar' },
        { id: 2, name: 'alice', fullName: 'Alice Johnson' },
        { id: 3, name: 'bob_smith', fullName: 'Bob Smith' },
        { id: 4, name: 'charlie_dev', fullName: 'Charlie Dev' },
        { id: 5, name: 'nina_01', fullName: 'Nina Patel' },
        { id: 6, name: 'rohit_777', fullName: 'Rohit Sharma' },
        { id: 7, name: 'lily_rose', fullName: 'Lily Rose' },
        { id: 8, name: 'mark_dev', fullName: 'Mark Watson' },
        { id: 9, name: 'anna_j', fullName: 'Anna James' },
        { id: 10, name: 'johnny_tech', fullName: 'Johnny Tech' },
        { id: 1, name: 'saurabh_k', fullName: 'Saurabh Kumar' },
        { id: 2, name: 'alice', fullName: 'Alice Johnson' },
        { id: 3, name: 'bob_smith', fullName: 'Bob Smith' },
        { id: 4, name: 'charlie_dev', fullName: 'Charlie Dev' },
        { id: 5, name: 'nina_01', fullName: 'Nina Patel' },
        { id: 6, name: 'rohit_777', fullName: 'Rohit Sharma' },
        { id: 7, name: 'lily_rose', fullName: 'Lily Rose' },
        { id: 8, name: 'mark_dev', fullName: 'Mark Watson' },
        { id: 9, name: 'anna_j', fullName: 'Anna James' },
        { id: 10, name: 'johnny_tech', fullName: 'Johnny Tech' },
        ],
        []
    );

    const filteredUsers = useMemo(() => {
        const trimmed = searchQuery.trim().toLowerCase();
        if (!trimmed) return [];
        return allUsers.filter(
        (user) =>
            user.name.toLowerCase().includes(trimmed) ||
            user.fullName.toLowerCase().includes(trimmed)
        );
    }, [searchQuery, allUsers]);

    async function handleFormSubmit(e) {
        e.preventDefault();
        if (!formSubmitHandler) {
            console.error('Form submit handler not available.');
            return;
        }
        try {
            await formSubmitHandler(username);
        } catch (error) {
            console.error('Error adding member:', error);
        } finally {
            setOpenAddMemberModal(false);
        }
    }

    return (
        <Drawer
        open={openAddMemberModal}
        onOpenChange={setOpenAddMemberModal}
        direction="left"
        >
        <DrawerContent className="h-full w-full max-w-md ml-0 flex flex-col">
            {/* Header */}
            <DrawerHeader className="text-left border-b p-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Add Member</h2>
                <button
                onClick={() => setOpenAddMemberModal(false)}
                className="p-1 rounded-full hover:bg-accent"
                >
                <X className="h-5 w-5" />
                </button>
            </div>
            <DrawerDescription className="mt-1">
                Add a new member to your workspace.
            </DrawerDescription>

            {/* 🔍 Search Bar */}
            <div className="relative mt-4">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                type="text"
                placeholder="Search members..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            </DrawerHeader>

            {/* Body */}
            <form
            onSubmit={handleFormSubmit}
            className="flex-1 flex flex-col justify-between overflow-hidden"
            >
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {searchQuery.trim() ? (
                // 🔍 Search Results (no footer buttons)
                filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                    <div
                        key={user.id}
                        className="flex items-center p-2 hover:bg-accent rounded-lg transition"
                    >
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center font-semibold mr-3">
                        {user.fullName[0]}
                        </div>
                        <div>
                        <p className="font-medium">{user.fullName}</p>
                        <p className="text-xs text-muted-foreground">
                            @{user.name}
                        </p>
                        </div>
                    </div>
                    ))
                ) : (
                    <p className="text-center text-muted-foreground text-sm py-6">
                    No users found
                    </p>
                )
                ) : (
                // 🧩 Default Add Member Section
                <div className="space-y-2">
                    <Label htmlFor="username">Add Member</Label>
                    <div className="relative">
                    <UserPlus className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter username"
                        required
                        autoFocus
                        className="pl-9"
                    />
                    </div>
                </div>
                )}
            </div>

            {/* Footer buttons only in default view */}
            {!searchQuery.trim() && (
                <div className="border-t p-4 flex justify-end space-x-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpenAddMemberModal(false)}
                    disabled={isPending}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={isPending || !username.trim()}
                    className="bg-emerald-600 hover:bg-emerald-700"
                >
                    {isPending ? 'Adding...' : 'Add Member'}
                </Button>
                </div>
            )}
            </form>
        </DrawerContent>
        </Drawer>
    );
};

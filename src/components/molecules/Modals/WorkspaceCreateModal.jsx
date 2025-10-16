import { useQueryClient } from '@tanstack/react-query';
import { Search, X } from 'lucide-react';
import { useEffect,useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCreateWorkspce } from '@/hooks/api/workspace/useCreateWorkspace';
import { useWorkspaceCreateModal } from '@/hooks/context/useWorkspaceCreateModal';

export const WorkspaceCreateModal = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [searchQuery, setSearchQuery] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [workspaceDetails, setWorkspaceDetails] = useState({
        name: '',
        description: '',
    });

    const { openWorkspaceCreateModal, setOpenWorkspaceCreateModal } =
        useWorkspaceCreateModal();
    const { isPending, createWorkspaceMutation } = useCreateWorkspce();

    // 🔹 Mock user data
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
        ],
        []
    );

    // 🔍 Handle live search
    useEffect(() => {
        const query = searchQuery.trim().toLowerCase();

        if (query === '') {
        // ✅ Reset when input is cleared
        setFilteredUsers([]);
        } else {
        const results = allUsers.filter(
            (user) =>
            user.name.toLowerCase().includes(query) ||
            user.fullName.toLowerCase().includes(query)
        );
        setFilteredUsers(results);
        }
    }, [searchQuery, allUsers]);

    // 🔹 Submit new workspace
    async function handleFormSubmit(e) {
        e.preventDefault();
        try {
        const response = await createWorkspaceMutation({
            name: workspaceDetails.name,
            description: workspaceDetails.description || '',
        });

        console.log('Created workspace:', response);
        navigate(`/workspace/${response?._id}`);
        queryClient.invalidateQueries('fetchworkspaces');
        } catch (error) {
        console.log('Error creating workspace:', error);
        } finally {
        setOpenWorkspaceCreateModal(false);
        }
    }

    return (
        <Drawer
        open={openWorkspaceCreateModal}
        onOpenChange={setOpenWorkspaceCreateModal}
        direction="left"
        >
        <DrawerContent className="h-full w-full max-w-md ml-0">
            <div className="h-full flex flex-col">
            <DrawerHeader className="text-left border-b p-4">
                <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Create Workspace</h2>
                <button
                    onClick={() => setOpenWorkspaceCreateModal(false)}
                    className="p-1 rounded-full hover:bg-accent"
                >
                    <X className="h-5 w-5" />
                </button>
                </div>
                <DrawerDescription className="mt-1">
                Create a new workspace to collaborate with your team.
                </DrawerDescription>

                {/* 🔍 Search Bar */}
                <div className="relative mt-4">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder="Search users..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                    <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setSearchQuery('')}
                    >
                    <X className="h-4 w-4" />
                    </button>
                )}
                </div>
            </DrawerHeader>

            {/* 🔹 Conditional Section */}
            <form
                onSubmit={handleFormSubmit}
                className="flex-1 flex flex-col p-4 overflow-y-auto"
            >
                {filteredUsers.length > 0 ? (
                // 🔍 Search Results
                <div className="p-2 h-full overflow-y-auto mt-2">
                    {filteredUsers.map((user) => (
                    <div
                        key={user.id}
                        className="flex items-center justify-between p-2 hover:bg-accent rounded-lg transition"
                    >
                        <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center font-semibold">
                            {user.fullName[0]}
                        </div>
                        <div>
                            <p className="font-medium">{user.fullName}</p>
                            <p className="text-xs text-muted-foreground">
                            @{user.name}
                            </p>
                        </div>
                        </div>
                        <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                            setWorkspaceDetails((prev) => ({
                            ...prev,
                            name: user.fullName,
                            }))
                        }
                        >
                        Select
                        </Button>
                    </div>
                    ))}
                </div>
                ) : (
                // 🧱 Default Create Workspace Form
                <div className="flex flex-col justify-between h-full">
                    <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="workspace-name">Workspace Name</Label>
                        <Input
                        id="workspace-name"
                        value={workspaceDetails.name}
                        onChange={(e) =>
                            setWorkspaceDetails((prev) => ({
                            ...prev,
                            name: e.target.value,
                            }))
                        }
                        placeholder="Enter workspace name"
                        required
                        autoFocus
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="workspace-description">
                        Description (Optional)
                        </Label>
                        <Textarea
                        id="workspace-description"
                        value={workspaceDetails.description}
                        onChange={(e) =>
                            setWorkspaceDetails((prev) => ({
                            ...prev,
                            description: e.target.value,
                            }))
                        }
                        placeholder="Enter a short description"
                        rows={3}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Add Members</Label>
                        <div className="border rounded-lg p-2 h-40 overflow-y-auto">
                        <p className="text-sm text-muted-foreground text-center py-4">
                            Search for members to add to your workspace
                        </p>
                        </div>
                    </div>
                    </div>

                    {/* ✅ Buttons only for create view */}
                    <div className="flex justify-end space-x-2 pt-4 border-t mt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setOpenWorkspaceCreateModal(false)}
                        disabled={isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={isPending || !workspaceDetails.name.trim()}
                        className="bg-emerald-600 hover:bg-emerald-700"
                    >
                        {isPending ? 'Creating...' : 'Create Workspace'}
                    </Button>
                    </div>
                </div>
                )}
            </form>
            </div>
        </DrawerContent>
        </Drawer>
    );
};

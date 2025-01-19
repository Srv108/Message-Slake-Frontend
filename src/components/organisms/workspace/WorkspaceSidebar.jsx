import { SideBar } from '../SideBar/SideBar';
import { WorkspaceSwitcher } from './WorkspaceSwitcher';

export const WorkspaceSidebar = () => {

    return (
        <SideBar
            WorkspaceSwitcher={WorkspaceSwitcher}
        />
    );
};
import { Route, Routes } from 'react-router-dom';

import { ProtectedRoutes } from './components/molecules/ProtectedRoutes/ProtectedRoutes';
import { ForgetAccountContainer } from './components/organisms/Auth/ForgetAccountContainer';
import { SigninContainer } from './components/organisms/Auth/SigninContainer';
import { SignupContainer } from './components/organisms/Auth/SignupContainer';
// import { NotFound } from './pages/alert/NoFound';
import { Auth } from './pages/Auth/Auth';
import { DirectMessageLayout } from './pages/DirectMessages/Layout';
import { Home } from './pages/Home/Home';
import { Landing } from './pages/Landing/Landing';
import { Member } from './pages/Member/Member';
import EnhancedVideoChat from './pages/Room/EnhancedVideoChat';
import { HomePage as RoomHomePage } from './pages/Room/HomePage';
import { Room } from './pages/Room/Room';
import { VideoChat } from './pages/Room/VideoChat';
// import { Room } from './pages/Room/Room';
import { Channel } from './pages/Workspace/Channel/Channel';
import { HomePage } from './pages/Workspace/HomePage';
import { JoinPage } from './pages/Workspace/JoinPage';
import { WorkspaceLayout } from './pages/Workspace/Layout';

export const AppRoutes = () => {
    return (
        <Routes>
            <Route path='/' element={<Landing />} />
            <Route path='/auth/signup' element={<Auth><SignupContainer/> </Auth>} />
            <Route path='/auth/signin' element={<Auth><SigninContainer/> </Auth>} />
            <Route path='/auth/logincredentials' element={<Auth><ForgetAccountContainer/> </Auth>} />
            <Route path='/workspace/:workspaceId' element={<ProtectedRoutes> <WorkspaceLayout> <HomePage /> </WorkspaceLayout></ProtectedRoutes>} />
            <Route path='/workspace/:workspaceId/channels/:channelId' element={<ProtectedRoutes> <WorkspaceLayout> <Channel /> </WorkspaceLayout></ProtectedRoutes>} />
            <Route path='/workspace/:workspaceId/members/:memberId' element={<ProtectedRoutes> <WorkspaceLayout> <Member /> </WorkspaceLayout></ProtectedRoutes>} />
            <Route path='/workspace/join/:workspaceId' element={<JoinPage />} />
            <Route path='/directMessages' element={<ProtectedRoutes> <DirectMessageLayout> <RoomHomePage /> </DirectMessageLayout> </ProtectedRoutes>} />
            <Route path='/directMessages/chat/:roomId' element={<ProtectedRoutes> <DirectMessageLayout> <Room />  </DirectMessageLayout> </ProtectedRoutes>} />
            <Route path='/directMessages/chat/:roomId/video/call' element={<ProtectedRoutes> <EnhancedVideoChat /> </ProtectedRoutes>} />

            <Route path='/home' element={<ProtectedRoutes> <Home/> </ProtectedRoutes> } />
            <Route path='/*' element={<Landing />} />
        </Routes>
    );
};
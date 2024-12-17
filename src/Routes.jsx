import { Route, Routes } from 'react-router-dom';

import { ProtectedRoutes } from './components/molecules/ProtectedRoutes/ProtectedRoutes';
import { ForgetAccountContainer } from './components/organisms/Auth/ForgetAccountContainer';
import { SigninContainer } from './components/organisms/Auth/SigninContainer';
import { SignupContainer } from './components/organisms/Auth/SignupContainer';
import { NotFound } from './pages/alert/NoFound';
import { Auth } from './pages/Auth/Auth';
import { Home } from './pages/Home/Home';

export const AppRoutes = () => {
    return (
        <Routes>
            <Route path='/auth/signup' element={<Auth><SignupContainer/> </Auth>} />
            <Route path='/auth/signin' element={<Auth><SigninContainer/> </Auth>} />
            <Route path='/auth/logincredentials' element={<Auth><ForgetAccountContainer/> </Auth>} />
            <Route path='/workspace/:id' element={<Home/> } />
            <Route path='/home' element={<ProtectedRoutes> <Home/> </ProtectedRoutes> } />
            <Route path='/*' element={<NotFound/>} />
        </Routes>
    );
};
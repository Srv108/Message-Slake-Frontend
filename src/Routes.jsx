import { Route, Routes } from 'react-router-dom';

import { ForgetAccountContainer } from './components/organisms/Auth/ForgetAccountContainer';
import { SigninContainer } from './components/organisms/Auth/SigninContainer';
import { SignupContainer } from './components/organisms/Auth/SignupContainer';
import { NotFound } from './pages/alert/NoFound';
import { Auth } from './pages/Auth/Auth';

export const AppRoutes = () => {
    return (
        <Routes>
            <Route path='/auth/signup' element={<Auth><SignupContainer/> </Auth>} />
            <Route path='/auth/signin' element={<Auth><SigninContainer/> </Auth>} />
            <Route path='/auth/logincredentials' element={<Auth><ForgetAccountContainer/> </Auth>} />
            <Route path='/home' element={<div> <h1> Home Page </h1> </div>} />
            <Route path='/*' element={<NotFound/>} />
        </Routes>
    );
};
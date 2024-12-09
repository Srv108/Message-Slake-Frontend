import './App.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Routes } from 'react-router-dom';

import { SigninCard } from './components/organisms/Auth/SigninCard';
import { SignupContainer } from './components/organisms/Auth/SignupContainer';
import { NotFound } from './pages/alert/NoFound';
import { Auth } from './pages/Auth/Auth';

function App() {
  const queryClient = new QueryClient();
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path='/auth/signup' element={<Auth><SignupContainer/> </Auth>} />
          <Route path='/auth/signin' element={<Auth><SigninCard/> </Auth>} />
          <Route path='/*' element={<NotFound/>} />
        </Routes>
      </QueryClientProvider>
    </>
  );
}

export default App;

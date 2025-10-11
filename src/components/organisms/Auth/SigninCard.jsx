import { ArrowLeft, LucideLoader2, MessageSquare, TriangleAlert } from 'lucide-react';
import { FaCheck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

export const SigninCard = ({
    isSuccess,
    error,
    isPending,
    validationError,
    signinForm,
    setSigninForm,
    onSigninFormSubmit
}) => {

    const navigate = useNavigate();
    
    return (
        <>
            <Card className='w-full h-full border border-gray-200 shadow-lg bg-white'>
                <CardHeader className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-black rounded-md flex items-center justify-center">
                                <MessageSquare className="w-6 h-6 text-white" strokeWidth={2.5} />
                            </div>
                            <span className="text-xl font-bold text-black tracking-tight">
                                MessageSlake
                            </span>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate('/')}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            Back
                        </Button>
                    </div>
                    <div>
                        <CardTitle className="text-3xl font-bold text-black">Welcome back</CardTitle>
                        <CardDescription className="text-base mt-2 text-gray-600">Sign in to continue to your workspace</CardDescription>
                    </div>
                    {validationError && (
                        <div className='bg-destructive/15 p-4 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6'>
                            <TriangleAlert className='size-5' />
                            {validationError.message}
                        </div>
                    )}

                    {error && (
                            <>
                                <div className='bg-destructive/15 p-4 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6'>
                                    <TriangleAlert className='size-5' />
                                    <p>{error.message}</p>

                                </div>
                                
                            </>
                    )}

                    {isSuccess && (
                            <div className='bg-primary/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-primary mb-5'>
                                <FaCheck className='size-5' />
                                <p>
                                    Successfully signed in. You will be redirected to the Home page in a few seconds.
                                    <LucideLoader2 className="animate-spin ml-2" />
                                </p>
                            </div>
                            
                    )}
                </CardHeader>

                <CardContent className="space-y-6">
                    <form className='space-y-5' onSubmit={onSigninFormSubmit}>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-black">Email</label>
                            <Input
                                type='email'
                                placeholder='Enter your email'
                                required
                                disabled={isPending}
                                value={signinForm.email}
                                onChange={(e) => setSigninForm({...signinForm,email: e.target.value})}
                                className="h-11 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black rounded-md transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-black">Password</label>
                            <Input
                                placeholder='Enter your password'
                                required
                                type='password'
                                disabled={isPending}
                                value={signinForm.password}
                                onChange = {(e) => setSigninForm({...signinForm,password: e.target.value})}
                                className="h-11 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black rounded-md transition-all"
                            />
                        </div>
                        <Button
                            disabled={isPending}
                            size='lg'
                            type='submit'
                            className='w-full h-11 bg-black hover:bg-gray-800 text-white font-medium rounded-md shadow-sm transition-all'
                        >
                            {isPending ? (
                                <>
                                    <LucideLoader2 className="animate-spin mr-2" />
                                    Signing in...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </Button>
                    </form>
                    
                    <div className="text-center">
                        <button
                            type="button"
                            className='text-sm text-gray-600 hover:text-black hover:underline font-medium transition-colors'
                            onClick={() => navigate('/auth/logincredentials')}
                        >
                            Forgot your password?
                        </button>
                    </div>

                    <Separator className="my-4"/>
                    
                    <div className="text-center">
                        <p className='text-sm text-gray-600'>
                            Don&apos;t have an account?{' '}
                            <button
                                type="button"
                                className='text-black hover:text-gray-700 font-semibold hover:underline transition-colors'
                                onClick={() => navigate('/auth/signup')}
                            >
                                Sign Up
                            </button>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </>
    );
};
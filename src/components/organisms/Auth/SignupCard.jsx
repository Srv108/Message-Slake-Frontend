import { ArrowLeft, LucideLoader2, MessageSquare, TriangleAlert } from 'lucide-react';
import { FaCheck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

export const SignupCard = ({
    error,
    isPending,
    isSuccess,
    signupForm,
    setSignupForm,
    validationError,
    onSignupFormSubmit,
}) => {

    const navigate = useNavigate();


    return (
        <>
            <Card className="w-full h-full border border-gray-200 dark:border-slate-700 shadow-lg bg-white dark:bg-slate-800 transition-colors">
                <CardHeader className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-black dark:bg-teal-600 rounded-md flex items-center justify-center">
                                <MessageSquare className="w-6 h-6 text-white" strokeWidth={2.5} />
                            </div>
                            <span className="text-xl font-bold text-black dark:text-white tracking-tight">
                                MessageSlake
                            </span>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate('/')}
                            className="text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200"
                        >
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            Back
                        </Button>
                    </div>
                    <div>
                        <CardTitle className="text-3xl font-bold text-black dark:text-white">Create an account</CardTitle>
                        <CardDescription className="text-base mt-2 text-gray-600 dark:text-slate-400">
                            Get started with MessageSlake today
                        </CardDescription>
                    </div>
                    
                    {validationError && (
                        <div className='bg-destructive/15 p-4 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6'>
                            <TriangleAlert className='size-5' />
                            {validationError.message}
                        </div>
                    )}

                    {
                        error && (
                            <>
                                <div className='bg-destructive/15 p-4 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6'>
                                    <TriangleAlert className='size-5' />
                                    <p>{error.message}</p>

                                </div>
                                
                            </>
                        )
                    }

                    {
                        isSuccess && (
                            <div className='bg-primary/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-primary mb-5'>
                                <FaCheck className='size-5' />
                                <p>
                                    Successfully signed up. You will be redirected to the login page in a few seconds.
                                    <LucideLoader2 className="animate-spin ml-2" />
                                </p>
                            </div>
                            
                        )
                    }
                </CardHeader>

                <CardContent className="space-y-6">
                    <form className='space-y-5' onSubmit={onSignupFormSubmit}>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-black dark:text-slate-200">Username</label>
                            <Input
                                placeholder='Choose a username'
                                required
                                type='text'
                                disabled={isPending}
                                value={signupForm.username}
                                onChange = {(e) => setSignupForm({...signupForm,username: e.target.value})}
                                className="h-11 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-400 focus:border-black dark:focus:border-teal-500 focus:ring-1 focus:ring-black dark:focus:ring-teal-500 rounded-md transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-black dark:text-slate-200">Email</label>
                            <Input
                                placeholder='Enter your email'
                                required
                                type='email'
                                disabled={isPending}
                                value={signupForm.email}
                                onChange = {(e) => setSignupForm({...signupForm,email: e.target.value})}
                                className="h-11 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-400 focus:border-black dark:focus:border-teal-500 focus:ring-1 focus:ring-black dark:focus:ring-teal-500 rounded-md transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-black dark:text-slate-200">Password</label>
                            <Input
                                placeholder='Create a password'
                                required
                                type='password'
                                disabled={isPending}
                                value={signupForm.password}
                                onChange = {(e) => setSignupForm({...signupForm,password: e.target.value})}
                                className="h-11 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-400 focus:border-black dark:focus:border-teal-500 focus:ring-1 focus:ring-black dark:focus:ring-teal-500 rounded-md transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-black dark:text-slate-200">Confirm Password</label>
                            <Input
                                placeholder='Confirm your password'
                                required
                                type='password'
                                disabled={isPending}
                                value={signupForm.confirmPassword}
                                onChange = {(e) => setSignupForm({...signupForm,confirmPassword: e.target.value})}
                                className="h-11 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-400 focus:border-black dark:focus:border-teal-500 focus:ring-1 focus:ring-black dark:focus:ring-teal-500 rounded-md transition-all"
                            />
                        </div>
                        <Button
                            disabled={isPending}
                            size='lg'
                            type='submit'
                            className='w-full h-11 bg-black dark:bg-teal-600 hover:bg-gray-800 dark:hover:bg-teal-700 text-white font-medium rounded-md shadow-sm transition-all'
                        >
                            {isPending ? (
                                <>
                                    <LucideLoader2 className="animate-spin mr-2" />
                                    Creating account...
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </Button>
                    </form>

                    <Separator className="my-4"/>
                    
                    <div className="text-center">
                        <p className='text-sm text-gray-600 dark:text-slate-400'>
                            Already have an account?{' '}
                            <button
                                type="button"
                                className='text-black dark:text-teal-400 hover:text-gray-700 dark:hover:text-teal-300 font-semibold hover:underline transition-colors'
                                onClick={() => navigate('/auth/signin')}
                            >
                                Sign In
                            </button>
                        </p>
                    </div>
                </CardContent>

            </Card>
        </>
    );
};
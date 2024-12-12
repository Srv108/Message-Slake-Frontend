import { TriangleAlert } from 'lucide-react';
import { LucideLoader2 } from 'lucide-react';
import { FaCheck } from 'react-icons/fa';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

export const ForgetAccountCard = ({
    error,
    otpForm,
    otpSubmit,
    isPending,
    isSuccess,
    setOtpForm,
    verifyForm,
    setVerifyForm,
    otpErrorState,
    validationError,
    otpSuccessState,
    onVerifyFormSubmit
}) => {

    

    return (
        <>
            <Card className='w-full h-full'>
                <CardHeader>
                    <CardTitle>Verify Your Account</CardTitle>
                    <CardDescription>confirm your username and email</CardDescription>
                    {validationError && (
                        <div className='bg-destructive/15 p-4 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6'>
                            <TriangleAlert className='size-5' />
                            {validationError.message}
                        </div>
                    )} 

                    {(error) && (
                        <div className='bg-destructive/15 p-4 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6'>
                            <TriangleAlert className='size-5' />
                            <p>{error.message}</p>
                        </div>
                    )}
                    {otpErrorState && (
                        <div className='bg-destructive/15 p-4 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6'>
                            <TriangleAlert className='size-5' />
                            <p>{otpErrorState.message}</p>
                        </div>
                    )}

                    {otpSuccessState && (
                            <div className='bg-primary/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-primary mb-5'>
                                <FaCheck className='size-5' />
                                <p>
                                    Otp Verified Successfully. You will be redirected to the reset password page in a few seconds.
                                    <LucideLoader2 className="animate-spin ml-2" />
                                </p>
                            </div>
                    )}
                </CardHeader>

                <CardContent>
                    <form className='space-y-3' onSubmit={onVerifyFormSubmit}>
                        <Input
                            placeholder='Username'
                            required
                            onChange = {(e) => setVerifyForm({...verifyForm,username: e.target.value})}
                            type='text'
                            disabled={isPending}
                        />
                        <Input
                            type='email'
                            placeholder='Email'
                            required
                            onChange={(e) => setVerifyForm({...verifyForm,email: e.target.value})}
                            disabled={isPending}
                        />
                        <Button
                            disabled={isPending || isSuccess}
                            size='lg'
                            type='submit'
                            className='w-full'
                        >
                            Sign In
                        </Button>

                    </form>

                    <Separator className="my-6" />

                    <form className='space-y-3' onSubmit={otpSubmit}>
                        {isSuccess && (
                            <>
                                <Input
                                    type='text'
                                    placeholder='Otp'
                                    required
                                    onChange={(e) => setOtpForm({...otpForm,otp: e.target.value})}
                                    disabled={false}
                                />

                                <Button
                                    variant={otpSuccessState ? 'success' : 'destructive'}
                                    disabled={false}
                                    size='lg'
                                    type='submit'
                                    className='w-full'
                                >
                                    Verify Otp
                                </Button>
                            </>
                        )}
                    </form>
                    
                </CardContent>
            </Card>
        </>
    );
};
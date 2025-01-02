import { AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export const NotFound = () => {
    const navigate = useNavigate();
    return(
        <>
            <div
                className="flex h-screen w-full flex-col items-center justify-center bg-slack"
            >
                <Card className="text-center shadow-lg max-w-lg">
                    <CardHeader>
                        <img 
                            className='rounded-lg shadow-lg' 
                            src='https://cdn.vectorstock.com/i/500p/69/13/404-page-glitch-effect-not-found-error-background-vector-42186913.avif'
                        />
                        <Alert variant='destructive' className='rounded-lg shadow-lg'>
                            <AlertCircle className="h-3 w-3" />
                            <AlertTitle className='font-serif'>Not Found</AlertTitle>
                            <AlertDescription className='text-xs font-serif'>
                                The Page You Are Looking. Not Found ! 
                            </AlertDescription>
                        </Alert>

                    </CardHeader>

                    <CardContent>
                        <Button
                            variant="outline"
                            onClick={(() => navigate('/auth/signin'))}
                            className="mt-4 font-serif"
                        >
                            Go to signin page
                        </Button>
                        <Button
                            variant="outline"
                            onClick={(() => navigate(-1))}
                            className="mt-4 font-serif"
                        >
                            Go Back
                        </Button>
                    </CardContent>
                </Card>
            </div>

        </>
    );
};
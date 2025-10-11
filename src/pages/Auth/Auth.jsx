
// eslint-disable-next-line react/prop-types
export const Auth = ({children}) => {
    // Layout for auth related pages
    return (
        <div 
        className="min-h-screen flex items-center justify-center bg-gray-50 p-4"
        >
            <div className="w-full max-w-md">
                {children}
            </div>

        </div>
    );
};
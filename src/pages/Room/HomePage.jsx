export const HomePage = () => {
    return (
        <div className="h-screen w-full bg-slack flex items-center justify-center">
            <div className="relative">
                <div className="absolute inset-0 w-32 h-32 bg-purple-400 blur-3xl opacity-30 rounded-full animate-pulse"></div>

                <div className="bg-purple-700 text-teal-300 text-xl font-serif font-bold px-10 py-6 rounded-full shadow-2xl border-2 border-purple-500 transition-all transform hover:scale-105 hover:shadow-purple-400/50 cursor-pointer animate-bounce">
                    ✨ Add a Member to Start a new Chat ✨
                </div>
            </div>
        </div>
    );
};

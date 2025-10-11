import { MessageCircle, Send, Sparkles, UserPlus, Zap } from 'lucide-react';

export const HomePage = () => {
    return (
        <div className="h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
            <div className="text-center max-w-2xl mx-auto">
                {/* Main Icon */}
                <div className="mb-8 relative">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-500/30 dark:shadow-purple-500/20">
                        <MessageCircle className="w-12 h-12 text-white" strokeWidth={2} />
                    </div>
                    <div className="absolute -top-2 -right-2">
                        <Sparkles className="w-8 h-8 text-purple-500 animate-pulse" />
                    </div>
                </div>

                {/* Main Heading */}
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
                    Your Messages Await
                </h1>
                
                {/* Subheading */}
                <p className="text-lg md:text-xl text-gray-600 dark:text-slate-400 mb-12 max-w-xl mx-auto">
                    Connect with your teammates through direct messages
                </p>

                {/* Feature Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700 hover:shadow-md transition-all">
                        <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4 mx-auto">
                            <UserPlus className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Add Members</h3>
                        <p className="text-sm text-gray-600 dark:text-slate-400">Start a conversation with anyone</p>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700 hover:shadow-md transition-all">
                        <div className="w-12 h-12 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center mb-4 mx-auto">
                            <Zap className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Instant Messaging</h3>
                        <p className="text-sm text-gray-600 dark:text-slate-400">Real-time communication</p>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700 hover:shadow-md transition-all">
                        <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4 mx-auto">
                            <Send className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Share Ideas</h3>
                        <p className="text-sm text-gray-600 dark:text-slate-400">Exchange messages & files</p>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg shadow-lg shadow-purple-500/30 dark:shadow-purple-500/20 hover:shadow-xl hover:scale-105 transition-all cursor-pointer">
                    <UserPlus className="w-5 h-5" />
                    <span className="font-semibold">Start a New Conversation</span>
                </div>

                {/* Additional Hint */}
                <p className="mt-6 text-sm text-gray-500 dark:text-slate-500">
                    Click the <span className="font-semibold text-purple-600 dark:text-purple-400">+</span> button above to add a member
                </p>
            </div>
        </div>
    );
};

import { ArrowRight, CheckCircle2, MessageSquare, Users, Video, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export const Landing = () => {
    const navigate = useNavigate();

    const features = [
        {
            icon: MessageSquare,
            title: 'Real-time Messaging',
            description: 'Instant messaging with your team members across channels and direct messages.',
            gradient: 'from-gray-900 to-gray-700'
        },
        {
            icon: Users,
            title: 'Team Collaboration',
            description: 'Create workspaces, channels, and organize your team communication efficiently.',
            gradient: 'from-gray-800 to-gray-600'
        },
        {
            icon: Video,
            title: 'Video Calls',
            description: 'High-quality video calls integrated seamlessly into your conversations.',
            gradient: 'from-gray-700 to-gray-500'
        },
        {
            icon: Zap,
            title: 'Lightning Fast',
            description: 'Built with modern technology for blazing fast performance and reliability.',
            gradient: 'from-gray-600 to-gray-400'
        }
    ];

    const benefits = [
        'Unlimited messages and file sharing',
        'Create unlimited workspaces',
        'Real-time notifications',
        'Secure and encrypted communication',
        'Cross-platform support',
        'Rich text formatting and emoji support'
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Navigation */}
            <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-3">
                            <div className="w-9 h-9 bg-black rounded-md flex items-center justify-center">
                                <MessageSquare className="w-5 h-5 text-white" strokeWidth={2.5} />
                            </div>
                            <span className="text-xl font-bold text-black tracking-tight">
                                MessageSlake
                            </span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Button
                                variant="ghost"
                                onClick={() => navigate('/auth/signin')}
                                className="hidden sm:inline-flex text-gray-600 hover:text-black hover:bg-gray-50"
                            >
                                Sign In
                            </Button>
                            <Button
                                onClick={() => navigate('/auth/signup')}
                                className="bg-black hover:bg-gray-800 text-white rounded-md"
                            >
                                Get Started
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-4xl mx-auto">
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-black mb-6 tracking-tight leading-tight">
                            Team Communication
                            <span className="block mt-2">Made Simple</span>
                        </h1>
                        <p className="mt-6 text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
                            Connect your team with powerful messaging, video calls, and collaboration tools. 
                            All in one beautiful, modern platform.
                        </p>
                        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Button
                                size="lg"
                                onClick={() => navigate('/auth/signup')}
                                className="bg-black hover:bg-gray-800 text-white text-base px-8 h-12 rounded-md shadow-sm hover:shadow-md transition-all"
                            >
                                Start Free Trial
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                onClick={() => navigate('/auth/signin')}
                                className="text-base px-8 h-12 rounded-md border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
                            >
                                Sign In
                            </Button>
                        </div>
                    </div>

                    {/* Hero Visual */}
                    <div className="mt-20 relative max-w-5xl mx-auto">
                        <div className="relative bg-gray-50 rounded-lg border border-gray-200 p-8 shadow-sm">
                            <div className="aspect-video bg-white rounded-md border border-gray-200 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="w-20 h-20 mx-auto mb-4 bg-black rounded-md flex items-center justify-center">
                                        <MessageSquare className="w-10 h-10 text-white" strokeWidth={2} />
                                    </div>
                                    <p className="text-gray-500 text-sm font-medium">Your workspace preview</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-black mb-4">
                            Everything you need to collaborate
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Powerful features designed to make team communication effortless and productive.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <Card 
                                key={index} 
                                className="border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 bg-white"
                            >
                                <CardContent className="pt-6">
                                    <div className="w-12 h-12 bg-black rounded-md flex items-center justify-center mb-4">
                                        <feature.icon className="w-6 h-6 text-white" strokeWidth={2} />
                                    </div>
                                    <h3 className="text-lg font-semibold text-black mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {feature.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-4xl font-bold text-black mb-6">
                                Why teams choose MessageSlake
                            </h2>
                            <p className="text-lg text-gray-600 mb-8">
                                Join thousands of teams already using MessageSlake to streamline their communication and boost productivity.
                            </p>
                            <div className="space-y-4">
                                {benefits.map((benefit, index) => (
                                    <div key={index} className="flex items-start space-x-3">
                                        <CheckCircle2 className="w-5 h-5 text-black flex-shrink-0 mt-0.5" strokeWidth={2} />
                                        <span className="text-gray-700">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative">
                            <Card className="border border-gray-200 shadow-sm bg-gray-50">
                                <CardContent className="p-8">
                                    <div className="space-y-4">
                                        <div className="bg-white rounded-md border border-gray-200 p-4">
                                            <div className="flex items-start space-x-3">
                                                <div className="w-10 h-10 bg-black rounded-full flex-shrink-0"></div>
                                                <div className="flex-1">
                                                    <div className="bg-gray-100 rounded-md p-3 text-sm text-gray-700">
                                                        Hey team! 👋
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-white rounded-md border border-gray-200 p-4">
                                            <div className="flex items-start space-x-3">
                                                <div className="w-10 h-10 bg-gray-800 rounded-full flex-shrink-0"></div>
                                                <div className="flex-1">
                                                    <div className="bg-gray-100 rounded-md p-3 text-sm text-gray-700">
                                                        Ready for the meeting?
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-white rounded-md border border-gray-200 p-4">
                                            <div className="flex items-start space-x-3">
                                                <div className="w-10 h-10 bg-gray-600 rounded-full flex-shrink-0"></div>
                                                <div className="flex-1">
                                                    <div className="bg-gray-100 rounded-md p-3 text-sm text-gray-700">
                                                        Let&apos;s do this! 🚀
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-black text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                        Ready to transform your team communication?
                    </h2>
                    <p className="text-lg text-gray-300 mb-10">
                        Join MessageSlake today and experience the future of team collaboration.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            size="lg"
                            onClick={() => navigate('/auth/signup')}
                            className="bg-white text-black hover:bg-gray-100 text-base px-8 h-12 rounded-md shadow-sm transition-all"
                        >
                            Get Started Free
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            onClick={() => navigate('/auth/signin')}
                            className="bg-transparent border-2 border-white text-white hover:bg-white/10 text-base px-8 h-12 rounded-md transition-all"
                        >
                            Sign In
                        </Button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-8 h-8 bg-black rounded-md flex items-center justify-center">
                                    <MessageSquare className="w-5 h-5 text-white" strokeWidth={2.5} />
                                </div>
                                <span className="text-lg font-bold text-black">MessageSlake</span>
                            </div>
                            <p className="text-gray-600 max-w-md text-sm">
                                Modern team communication platform designed for productivity and collaboration.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-black font-semibold mb-4 text-sm">Product</h3>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="text-gray-600 hover:text-black transition-colors">Features</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-black transition-colors">Pricing</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-black transition-colors">Security</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-black font-semibold mb-4 text-sm">Company</h3>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="text-gray-600 hover:text-black transition-colors">About</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-black transition-colors">Blog</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-black transition-colors">Contact</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-200 pt-8 text-center">
                        <p className="text-gray-500 text-sm">&copy; 2025 MessageSlake. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

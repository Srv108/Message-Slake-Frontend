import { ArrowRight, CheckCircle2, MessageSquare, Sparkles, Users, Video, Zap } from 'lucide-react';
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
        },
        {
            icon: Users,
            title: 'Team Collaboration',
            description: 'Create workspaces, channels, and organize your team communication efficiently.',
        },
        {
            icon: Video,
            title: 'Video Calls',
            description: 'High-quality video calls integrated seamlessly into your conversations.',
        },
        {
            icon: Zap,
            title: 'Lightning Fast',
            description: 'Built with modern technology for blazing fast performance and reliability.',
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

    const stats = [
        { value: '10K+', label: 'Active Users' },
        { value: '50K+', label: 'Messages Daily' },
        { value: '99.9%', label: 'Uptime' },
        { value: '24/7', label: 'Support' }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Navigation */}
            <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-3 group cursor-pointer">
                            <div className="w-9 h-9 bg-black rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
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
                                className="hidden sm:inline-flex text-gray-600 hover:text-black hover:bg-gray-50 font-medium"
                            >
                                Sign In
                            </Button>
                            <Button
                                onClick={() => navigate('/auth/signup')}
                                className="bg-black hover:bg-gray-800 text-white rounded-lg font-medium shadow-sm hover:shadow-md transition-all"
                            >
                                Get Started
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-20 left-10 w-72 h-72 bg-gray-100 rounded-full blur-3xl opacity-50 animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-gray-50 rounded-full blur-3xl opacity-50 animate-pulse delay-1000"></div>
                
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="inline-flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-full mb-8 animate-fade-in">
                            <Sparkles className="w-4 h-4 text-black" />
                            <span className="text-sm font-medium text-gray-700">Introducing MessageSlake 2.0</span>
                        </div>
                        
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-black mb-6 tracking-tight leading-tight animate-fade-in-up">
                            Where teams
                            <span className="block mt-2 relative inline-block">
                                <span className="relative z-10">connect & collaborate</span>
                                <span className="absolute bottom-2 left-0 w-full h-3 bg-gray-200 -rotate-1"></span>
                            </span>
                        </h1>
                        
                        <p className="mt-6 text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto animate-fade-in-up delay-200">
                            The modern workspace for fast-moving teams. Real-time messaging, video calls, 
                            and seamless collaboration—all in one beautiful platform.
                        </p>
                        
                        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up delay-300">
                            <Button
                                size="lg"
                                onClick={() => navigate('/auth/signup')}
                                className="bg-black hover:bg-gray-800 text-white text-base px-8 h-14 rounded-xl shadow-lg hover:shadow-xl transition-all group"
                            >
                                Start Free Trial
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                onClick={() => navigate('/auth/signin')}
                                className="text-base px-8 h-14 rounded-xl border-2 border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition-all"
                            >
                                Watch Demo
                            </Button>
                        </div>

                        {/* Stats */}
                        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 animate-fade-in-up delay-400">
                            {stats.map((stat, index) => (
                                <div key={index} className="text-center">
                                    <div className="text-3xl sm:text-4xl font-bold text-black mb-1">{stat.value}</div>
                                    <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Hero Visual */}
                    <div className="mt-20 relative max-w-6xl mx-auto animate-fade-in-up delay-500">
                        <div className="absolute -inset-4 bg-gradient-to-r from-gray-100 to-gray-50 rounded-3xl blur-2xl opacity-50"></div>
                        <div className="relative bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-gray-200 p-4 sm:p-8 shadow-2xl">
                            <div className="aspect-video bg-white rounded-xl border border-gray-200 flex items-center justify-center overflow-hidden relative">
                                {/* Mock chat interface */}
                                <div className="w-full h-full p-6 flex flex-col">
                                    <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-gray-100">
                                        <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                                            <MessageSquare className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-black">Team Workspace</div>
                                            <div className="text-xs text-gray-500">5 members online</div>
                                        </div>
                                    </div>
                                    <div className="space-y-4 flex-1">
                                        <div className="flex items-start space-x-3">
                                            <div className="w-8 h-8 bg-gray-900 rounded-full flex-shrink-0"></div>
                                            <div className="bg-gray-100 rounded-lg px-4 py-2 max-w-xs">
                                                <div className="text-xs font-semibold text-black mb-1">Sarah</div>
                                                <div className="text-sm text-gray-700">Hey team! Ready for the launch? 🚀</div>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <div className="w-8 h-8 bg-gray-700 rounded-full flex-shrink-0"></div>
                                            <div className="bg-gray-100 rounded-lg px-4 py-2 max-w-xs">
                                                <div className="text-xs font-semibold text-black mb-1">Mike</div>
                                                <div className="text-sm text-gray-700">Absolutely! Everything is set ✨</div>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-3 justify-end">
                                            <div className="bg-black rounded-lg px-4 py-2 max-w-xs">
                                                <div className="text-sm text-white">Let&apos;s do this! 💪</div>
                                            </div>
                                            <div className="w-8 h-8 bg-gray-500 rounded-full flex-shrink-0"></div>
                                        </div>
                                    </div>
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
                        <h2 className="text-4xl sm:text-5xl font-bold text-black mb-4">
                            Everything you need
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Powerful features designed to make team communication effortless and productive.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <Card 
                                key={index} 
                                className="border-2 border-gray-200 hover:border-black hover:shadow-xl transition-all duration-300 bg-white group cursor-pointer"
                            >
                                <CardContent className="pt-6">
                                    <div className="w-14 h-14 bg-black rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                        <feature.icon className="w-7 h-7 text-white" strokeWidth={2} />
                                    </div>
                                    <h3 className="text-xl font-bold text-black mb-2">
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
                            <h2 className="text-4xl sm:text-5xl font-bold text-black mb-6 leading-tight">
                                Why teams love MessageSlake
                            </h2>
                            <p className="text-lg text-gray-600 mb-8">
                                Join thousands of teams already using MessageSlake to streamline their communication and boost productivity.
                            </p>
                            <div className="space-y-4">
                                {benefits.map((benefit, index) => (
                                    <div key={index} className="flex items-start space-x-3 group">
                                        <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                                            <CheckCircle2 className="w-4 h-4 text-white" strokeWidth={3} />
                                        </div>
                                        <span className="text-gray-700 font-medium">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                            <Button
                                size="lg"
                                onClick={() => navigate('/auth/signup')}
                                className="mt-8 bg-black hover:bg-gray-800 text-white rounded-xl px-8 h-12"
                            >
                                Get Started Free
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </div>
                        
                        <div className="relative">
                            <div className="absolute -inset-4 bg-gray-100 rounded-3xl blur-2xl opacity-50"></div>
                            <Card className="relative border-2 border-gray-200 shadow-xl bg-white overflow-hidden">
                                <CardContent className="p-0">
                                    <div className="bg-gradient-to-br from-gray-900 to-gray-700 p-8 text-white">
                                        <div className="flex items-center space-x-3 mb-6">
                                            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                                                <MessageSquare className="w-6 h-6 text-black" strokeWidth={2.5} />
                                            </div>
                                            <div>
                                                <div className="font-bold text-lg">MessageSlake</div>
                                                <div className="text-sm text-gray-300">Team Chat</div>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                                                <div className="flex items-start space-x-3">
                                                    <div className="w-8 h-8 bg-white rounded-full flex-shrink-0"></div>
                                                    <div className="flex-1">
                                                        <div className="text-sm font-semibold mb-1">Alex Johnson</div>
                                                        <div className="text-sm text-gray-200">The new design looks amazing! 🎨</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                                                <div className="flex items-start space-x-3">
                                                    <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0"></div>
                                                    <div className="flex-1">
                                                        <div className="text-sm font-semibold mb-1">Emma Davis</div>
                                                        <div className="text-sm text-gray-200">Thanks! Ready to ship? 🚀</div>
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
            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-black text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black"></div>
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
                
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                        Ready to transform your team communication?
                    </h2>
                    <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto">
                        Join MessageSlake today and experience the future of team collaboration. No credit card required.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            size="lg"
                            onClick={() => navigate('/auth/signup')}
                            className="bg-white text-black hover:bg-gray-100 text-base px-8 h-14 rounded-xl shadow-lg hover:shadow-xl transition-all group font-semibold"
                        >
                            Get Started Free
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            onClick={() => navigate('/auth/signin')}
                            className="bg-transparent border-2 border-white text-white hover:bg-white/10 text-base px-8 h-14 rounded-xl transition-all"
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
                                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                                    <MessageSquare className="w-5 h-5 text-white" strokeWidth={2.5} />
                                </div>
                                <span className="text-lg font-bold text-black">MessageSlake</span>
                            </div>
                            <p className="text-gray-600 max-w-md text-sm leading-relaxed">
                                Modern team communication platform designed for productivity and collaboration. 
                                Built with love for teams worldwide.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-black font-semibold mb-4 text-sm">Product</h3>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="text-gray-600 hover:text-black transition-colors">Features</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-black transition-colors">Pricing</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-black transition-colors">Security</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-black transition-colors">Integrations</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-black font-semibold mb-4 text-sm">Company</h3>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="text-gray-600 hover:text-black transition-colors">About</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-black transition-colors">Blog</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-black transition-colors">Careers</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-black transition-colors">Contact</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-200 pt-8 flex flex-col sm:flex-row justify-between items-center">
                        <p className="text-gray-500 text-sm">&copy; 2025 MessageSlake. All rights reserved.</p>
                        <div className="flex space-x-6 mt-4 sm:mt-0">
                            <a href="#" className="text-gray-500 hover:text-black text-sm transition-colors">Privacy</a>
                            <a href="#" className="text-gray-500 hover:text-black text-sm transition-colors">Terms</a>
                            <a href="#" className="text-gray-500 hover:text-black text-sm transition-colors">Cookies</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

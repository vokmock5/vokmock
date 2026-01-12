import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Mic, Video, Brain } from 'lucide-react';
import vrInterview from "../assets/vrInterview.jpeg";

const LandingPage = () => {
  // Load Google Fonts
  useEffect(() => {
    const link1 = document.createElement('link');
    link1.href = 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap';
    link1.rel = 'stylesheet';
    document.head.appendChild(link1);

    const link2 = document.createElement('link');
    link2.href = 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap';
    link2.rel = 'stylesheet';
    document.head.appendChild(link2);

    return () => {
      document.head.removeChild(link1);
      document.head.removeChild(link2);
    };
  }, []);

  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/onboarding");
  };
const handleLogin = () => {
  navigate("/login");
};

const handleSignup = () => {
  navigate("/signup");
};

  // Animation for scroll
  const [scrollY, setScrollY] = React.useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden">
      {/* Top Navigation */}
<div className="absolute top-0 left-0 w-full z-20">
  <div className="container mx-auto px-6 lg:px-12 py-6 flex justify-between items-center">
    
    {/* Logo / Brand */}
    <h1
      className="text-xl font-bold text-slate-900"
      style={{ fontFamily: "Outfit, sans-serif" }}
    >
      VokMock
    </h1>

    {/* Auth Buttons */}
    <div className="flex items-center gap-4">
      <button
        onClick={handleLogin}
        className="px-6 py-2 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-100 transition-all"
        style={{ fontFamily: "Manrope, sans-serif" }}
      >
        Login
      </button>

      <button
        onClick={handleSignup}
        className="px-6 py-2 rounded-full bg-gradient-to-r from-pink-600 to-orange-500 text-white hover:from-pink-700 hover:to-orange-600 transition-all shadow-md"
        style={{ fontFamily: "Manrope, sans-serif" }}
      >
        Sign Up
      </button>
    </div>
  </div>
</div>

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center">
        {/* Background texture */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1620555791739-438a95e7ff65?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMHRlY2hub2xvZ3klMjBtZXNoJTIwbmV0d29yayUyMGJsdWV8ZW58MHx8fHwxNzY4MTM4Njc3fDA&ixlib=rb-4.1.0&q=85)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Typography & CTA */}
            <div 
              className="space-y-8 transition-all duration-700"
              style={{
                opacity: Math.max(0, 1 - scrollY / 400),
                transform: `translateX(${Math.min(0, -scrollY / 4)}px)`
              }}
            >
              <div className="space-y-4">
                <div className="inline-block">
                  <span className="px-4 py-2 bg-indigo-100 text-indigo-600 rounded-full text-sm font-medium tracking-tight">
                    🚀 Experience the Future
                  </span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900" style={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.02em' }}>
                  Master Your
                  <span className="block text-indigo-600">Interview Skills</span>
                  in Virtual Reality
                </h1>
                
                <p className="text-lg text-slate-600 max-w-xl" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  Step into an immersive VR interview room. Practice with AI-powered interviewers. Build confidence in a realistic, pressure-free environment.
                </p>
              </div>

              <button
                onClick={handleStart}
                className="bg-gradient-to-r from-pink-600 to-orange-500 hover:from-pink-700 hover:to-orange-600 text-white px-8 py-6 text-lg rounded-full shadow-2xl flex items-center gap-3 transition-all hover:scale-105 active:scale-95"
                style={{ fontFamily: 'Manrope, sans-serif' }}
              >
                Enter VR Interview
                <ArrowRight className="w-5 h-5" />
              </button>

              <div className="flex flex-wrap items-center gap-6 pt-4">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Video className="w-4 h-4 text-teal-500" />
                  <span>VR-Ready</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Mic className="w-4 h-4 text-teal-500" />
                  <span>Voice-Based</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Brain className="w-4 h-4 text-teal-500" />
                  <span>AI-Powered</span>
                </div>
              </div>
            </div>

            {/* Right: Preview Image */}
            <div 
              className="relative transition-all duration-700"
              style={{
                opacity: Math.max(0, 1 - scrollY / 400),
                transform: `translateX(${Math.min(0, scrollY / 4)}px) scale(${Math.max(0.9, 1 - scrollY / 2000)})`
              }}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={vrInterview}
                  alt="VR Interview Preview"
                  className="w-full h-auto object-cover"
                  style={{ aspectRatio: '4/3' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-600/30 to-transparent" />
              </div>
              
              {/* Floating accent */}
              <div 
                className="absolute -top-6 -right-6 w-24 h-24 bg-pink-500 rounded-full blur-3xl opacity-50"
                style={{
                  animation: 'float 3s ease-in-out infinite'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl lg:text-4xl font-bold" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Why Choose VR Interview?
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Experience realistic interview scenarios that prepare you for success
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Immersive Environment',
                description: 'Step into a professional office setting that feels real',
                emoji: '🕶️'
              },
              {
                title: 'AI-Driven Questions',
                description: 'Practice with adaptive questions based on your resume',
                emoji: '🧠'
              },
              {
                title: 'Voice Interaction',
                description: 'Answer questions naturally using your voice',
                emoji: '🎤'
              },
              {
                title: 'Resume-Aware',
                description: 'AI understands your background and asks relevant questions',
                emoji: '📄'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="p-8 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 hover:border-pink-500/50 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-pink-500/20 group"
              >
                <div className="text-4xl mb-4 transition-all group-hover:scale-110">
                  {feature.emoji}
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="py-16 bg-slate-50">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-2xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Ready to ace your next interview?
          </h3>
          <button
            onClick={handleStart}
            className="bg-gradient-to-r from-pink-600 to-orange-500 hover:from-pink-700 hover:to-orange-600 text-white px-10 py-4 rounded-full text-lg font-semibold shadow-xl hover:scale-105 transition-all"
            style={{ fontFamily: 'Manrope, sans-serif' }}
          >
            Start Interview 🚀
          </button>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, CheckCircle, Briefcase, ArrowRight, Sparkles } from 'lucide-react';

export default function Onboarding() {
  const [resume, setResume] = useState(null);
  const [domain, setDomain] = useState("Frontend");
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

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

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf") {
        setResume(file);
        simulateUpload();
      } else {
        alert("Please upload a PDF file");
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setResume(e.target.files[0]);
      simulateUpload();
    }
  };

  const simulateUpload = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!resume) {
      alert("Please upload your resume");
      return;
    }

    setLoading(true);

    // Simulate processing: extract text, parse, save profile, then navigate
    setTimeout(() => {
      const profile = {
        name: resume.name,
        domain,
        size: resume.size,
        uploadedAt: Date.now()
      };

      // Persist the candidate profile for the interview page to consume
      localStorage.setItem("candidateProfile", JSON.stringify(profile));

      setLoading(false);
      navigate("/interview");
    }, 1500);
  };

  const domains = [
    { value: "Frontend", icon: "💻" },
    { value: "Backend", icon: "⚙️" },
    { value: "Fullstack", icon: "🚀" },
    { value: "Data Science", icon: "📊" }
  ];

  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden">
      {/* Background texture - Same as landing page */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1620555791739-438a95e7ff65?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMHRlY2hub2xvZ3klMjBtZXNoJTIwbmV0d29yayUyMGJsdWV8ZW58MHx8fHwxNzY4MTM4Njc3fDA&ixlib=rb-4.1.0&q=85)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />

      <div className="relative z-10 container mx-auto px-6 lg:px-12 py-16 min-h-screen flex flex-col justify-center">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-600 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Step 1 of 2
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900" style={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.02em' }}>
            Let's Get You
            <span className="block text-indigo-600">
              Interview Ready
            </span>
          </h1>
          
          <p className="text-lg text-slate-600 max-w-2xl mx-auto" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Upload your resume and select your domain. Our AI will analyze your profile and prepare personalized interview questions.
          </p>
        </div>

        <div className="max-w-5xl mx-auto w-full">
          <div className="grid md:grid-cols-2 gap-10">
            
            {/* Resume Upload Section */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-lg font-semibold flex items-center gap-2 text-slate-900" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  <FileText className="w-5 h-5 text-indigo-600" />
                  Upload Resume
                </label>
                <p className="text-sm text-slate-600" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  PDF format only
                </p>
              </div>

              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-2xl p-8 bg-white transition-all shadow-lg ${
                  dragActive 
                    ? 'border-indigo-500 bg-indigo-50' 
                    : resume 
                    ? 'border-teal-500 bg-teal-50' 
                    : 'border-slate-300 hover:border-slate-400'
                }`}
              >
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  id="resume-upload"
                />
                
                <div className="text-center space-y-4">
                  {resume ? (
                    <>
                      <CheckCircle className="w-16 h-16 mx-auto text-teal-500" />
                      <div>
                        <p className="font-semibold text-teal-600" style={{ fontFamily: 'Manrope, sans-serif' }}>
                          {resume.name}
                        </p>
                        <p className="text-sm text-slate-600">
                          {(resume.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                      {uploadProgress < 100 && (
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-indigo-500 to-teal-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <Upload className="w-16 h-16 mx-auto text-slate-400" />
                      <div>
                        <p className="font-semibold text-slate-700" style={{ fontFamily: 'Manrope, sans-serif' }}>
                          Drop your resume here
                        </p>
                        <p className="text-sm text-slate-500">or click to browse</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Domain Selection Section */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-lg font-semibold flex items-center gap-2 text-slate-900" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  <Briefcase className="w-5 h-5 text-indigo-600" />
                  Select Domain
                </label>
                <p className="text-sm text-slate-600" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  Choose your area of expertise
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {domains.map((d) => (
                  <button
                    key={d.value}
                    onClick={() => setDomain(d.value)}
                    className={`relative p-6 rounded-xl border-2 bg-white transition-all shadow-lg ${
                      domain === d.value
                        ? 'border-indigo-500 bg-indigo-50 scale-105 shadow-xl'
                        : 'border-slate-200 hover:border-slate-300 hover:shadow-xl'
                    }`}
                  >
                    <div className="text-4xl mb-2">{d.icon}</div>
                    <p className="font-semibold text-slate-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      {d.value}
                    </p>
                    {domain === d.value && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle className="w-5 h-5 text-indigo-600" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <div className="mt-16 text-center">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`relative px-12 py-5 rounded-full text-lg font-semibold transition-all inline-flex items-center gap-3 shadow-2xl ${
                loading
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-pink-600 to-orange-500 hover:from-pink-700 hover:to-orange-600 hover:scale-105 text-white'
              }`}
              style={{ fontFamily: 'Manrope, sans-serif' }}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Preparing Your Interview...
                </>
              ) : (
                <>
                  Continue to Interview
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>

          {/* Info Cards */}
          <div className="mt-20 grid md:grid-cols-3 gap-6 pb-8">
            {[
              {
                icon: "🎯",
                title: "Personalized",
                description: "Questions tailored to your resume and experience"
              },
              {
                icon: "🤖",
                title: "AI-Powered",
                description: "Smart analysis of your skills and background"
              },
              {
                icon: "⚡",
                title: "Real-time",
                description: "Interactive voice-based interview experience"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="font-semibold text-slate-900 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-600" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
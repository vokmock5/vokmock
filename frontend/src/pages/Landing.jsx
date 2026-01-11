import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-br from-slate-900 to-gray-800 text-white px-6">
      
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
        AI-Powered Virtual Interview
      </h1>

      <p className="text-lg md:text-xl text-gray-300 max-w-2xl text-center mb-8">
        Experience a personalized interview where the AI understands your
        resume, analyzes your answers, and responds like a real interviewer.
      </p>

      <button
        onClick={() => navigate("/onboarding")}
        className="bg-pink-600 hover:bg-pink-700 transition px-8 py-4 rounded-full text-lg font-semibold shadow-lg"
      >
        Start Interview 🚀
      </button>
    </div>
  );
}

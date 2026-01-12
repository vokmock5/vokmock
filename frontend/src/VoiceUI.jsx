import { useState } from "react";
import { useVoiceLoop } from "./hooks/useVoiceLoop";
import { useNavigate } from "react-router-dom";

export default function VoiceUI() {
  const [displayText, setDisplayText] = useState("");
  const navigate = useNavigate();

  // Hooks inside component
  // Conversation logic
  const { startInterview } = useVoiceLoop(setDisplayText);

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 
                    bg-black/50 backdrop-blur-lg p-4 rounded-xl 
                    text-white w-[60%] text-center">

      <button
        onClick={startInterview}
        className="bg-green-600 px-6 py-3 rounded-xl font-semibold"
      >
        Start Interview
      </button>
      
      {/* Give Feedback */}
      <button
        onClick={() => navigate("/feedback")}
        className="bg-indigo-600 px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition"
      >
        Give Feedback
      </button>

      {/* ✅ Subtitles – UNCHANGED */}
      {displayText && (
        <div className="mt-4 text-lg">
          {displayText}
        </div>
      )}
    </div>
  );
}

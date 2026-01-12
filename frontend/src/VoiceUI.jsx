import { useState, useEffect } from "react";
import useVoiceLoop from "./hooks/useVoiceLoop";
import { useNavigate } from "react-router-dom";

export default function VoiceUI({
  handleSubmitAnswer,
  answerSubmitted,
  currentQuestion,
}) {
  const [displayText, setDisplayText] = useState("");
  const [textVisible, setTextVisible] = useState(false);
  const navigate = useNavigate();

  const {
    transcript,
    listening,
    startListening,
    stopListening,
    startInterview,
  } = useVoiceLoop(setDisplayText);

  /* -----------------------------------------
     ✅ TEXT-TO-SPEECH (FIXED – NO STUCK ISSUE)
  ------------------------------------------ */
  useEffect(() => {
    if (!currentQuestion) return;

    setTextVisible(false);
    setTimeout(() => {
      setDisplayText(currentQuestion);
      setTextVisible(true);
    }, 100);

    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(currentQuestion);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    speechSynthesis.speak(utterance);

    return () => {
      speechSynthesis.cancel();
    };
  }, [currentQuestion]);

  return (
    <>
      {/* Listening Indicator - Compact Top */}
      {listening && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
          <div className="bg-red-600/90 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-semibold shadow-lg flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            Listening...
          </div>
        </div>
      )}

      {/* Subtitle Panel - Smaller, Top Corner */}
      {displayText && (
        <div className="fixed top-4 left-4 right-4 z-40 pointer-events-none">
          <div
            className={`
              bg-black/75 backdrop-blur-lg border border-white/20
              rounded-xl px-4 py-2.5 shadow-xl max-w-3xl mx-auto
              transition-opacity duration-500
              ${textVisible ? 'opacity-100' : 'opacity-0'}
            `}
          >
            <p className="text-base md:text-lg text-white/95 leading-snug text-center">
              {displayText}
            </p>
          </div>
        </div>
      )}

      {/* Main Control Panel - Smaller Bottom, Right Aligned */}
      <div className="fixed bottom-4 right-4 z-40 pointer-events-none">
        <div className="pointer-events-auto bg-black/70 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl p-3 w-[380px]">
          
          {/* Top Row: Start Interview + Give Feedback */}
          <div className="flex gap-2 mb-2">
            <button
              onClick={startInterview}
              className="flex-1 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-semibold text-xs transition-all duration-200 hover:scale-105"
            >
              Start Interview
            </button>

            <button
              onClick={async () => {
                const interviewId = await startInterview();
                navigate(`/feedback/${interviewId}`);
              }}
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-semibold text-xs transition-all duration-200 hover:scale-105"
            >
              Give Feedback
            </button>
          </div>

          {/* Middle: Answer Button */}
          <div className="mb-2">
            <button
              onClick={listening ? stopListening : startListening}
              className={`
                w-full py-2.5 rounded-lg font-bold text-sm transition-all duration-200 hover:scale-105
                ${listening 
                  ? 'bg-red-600 hover:bg-red-500 text-white' 
                  : 'bg-green-600 hover:bg-green-500 text-white'
                }
              `}
            >
              {listening ? 'Stop Answer' : 'Answer'}
            </button>
          </div>

          {/* Bottom: Submit Button */}
          <div className="mb-2">
            <button
              onClick={() => handleSubmitAnswer(transcript)}
              disabled={!transcript || answerSubmitted}
              className={`
                w-full py-2.5 rounded-lg font-semibold text-sm transition-all duration-200
                ${!transcript || answerSubmitted
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed opacity-50'
                  : 'bg-blue-600 hover:bg-blue-500 text-white hover:scale-105'
                }
              `}
            >
              {answerSubmitted ? 'Submitting...' : 'Submit Answer'}
            </button>
          </div>

          {/* Transcript Preview - Compact */}
          {transcript && (
            <div className="bg-black/50 border border-white/10 rounded-lg p-2">
              <div className="text-[10px] font-semibold text-cyan-400 mb-1">Your Answer:</div>
              <p className="text-xs text-white/90 leading-snug line-clamp-2">
                {transcript}
              </p>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
import { useState } from "react";
import VoiceUI from "../VoiceUI";
import { processUserAnswer } from "../ai/interviewEngine";

export default function VoiceInterview() {
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState("");

  const handleSubmitAnswer = async (transcript) => {
    if (!transcript || answerSubmitted) return;

    try {
      setAnswerSubmitted(true);
      console.log("Submitting answer:", transcript);

      const response = await processUserAnswer(transcript);
      console.log("AI response:", response);

      if (response && response.nextQuestion) {
        setCurrentQuestion(response.nextQuestion); // 🔥 triggers TTS via VoiceUI useEffect
      } else {
        console.warn("No nextQuestion received from AI");
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
    } finally {
      setAnswerSubmitted(false);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      
      {/* 🌍 VR BACKGROUND */}
      <iframe
        src="/vr/index.html"
        title="VR Interview Room"
        allow="microphone; xr-spatial-tracking; fullscreen"
        className="absolute inset-0 w-full h-full border-none"
      />

      {/* 🎤 VOICE UI OVERLAY */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="pointer-events-auto">
          <VoiceUI
            handleSubmitAnswer={handleSubmitAnswer}
            answerSubmitted={answerSubmitted}
            currentQuestion={currentQuestion}
          />
        </div>
      </div>

    </div>
  );
}

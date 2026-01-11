import { useState } from "react";
import { useSpeechToText } from "./hooks/useSpeechToText";
import { useVoiceLoop } from "./hooks/useVoiceLoop";
import { useTextToSpeech } from "./hooks/useTextToSpeech";

export default function VoiceUI() {
  const [displayText, setDisplayText] = useState("");
  const [listening, setListening] = useState(false);

  // ✅ Hooks MUST be inside component
  const { speak } = useTextToSpeech();

  // Conversation logic
  const { startInterview, onUserAnswer } =
    useVoiceLoop(setDisplayText, setListening);

  // Speech-to-text
  const { startListening } = useSpeechToText((spokenText) => {
    onUserAnswer(spokenText);
  });

  // Optional test (run once)
  const testTTS = () => {
    speak("Text to speech is working");
  };

  return (
    <div className="h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
      <h1 className="text-3xl font-bold mb-6">
        AI Interview 🎤
      </h1>

      {/* Test TTS */}
      <button
        onClick={testTTS}
        className="bg-purple-600 px-6 py-3 rounded-xl font-semibold mb-4"
      >
        Test Voice 🔊
      </button>

      {/* Start Interview */}
      <button
        onClick={startInterview}
        className="bg-green-600 px-6 py-3 rounded-xl font-semibold"
      >
        Start Interview
      </button>

      {/* Answer Button */}
      <button
        onClick={() => {
          setListening(true);
          startListening();
        }}
        className="bg-blue-600 px-6 py-3 rounded-xl font-semibold mt-4"
      >
        {listening ? "Listening..." : "Answer 🎤"}
      </button>

      {/* Conversation Text */}
      {displayText && (
        <div className="mt-6 bg-gray-800 p-4 rounded-lg w-2/3 text-center">
          {displayText}
        </div>
      )}
    </div>
  );
}

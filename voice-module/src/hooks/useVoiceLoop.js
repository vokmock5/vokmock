import { useSpeechToText } from "./useSpeechToText";
import { useTextToSpeech } from "./useTextToSpeech";

export function useVoiceLoop(setDisplayText, setListening) {
  const { speak } = useTextToSpeech();

  const startInterview = () => {
    speak("Welcome to the interview. Tell me about yourself.");
    setDisplayText("AI: Tell me about yourself.");
  };

  const onUserAnswer = (answer) => {
    setDisplayText(`You: ${answer}`);
    setListening(false);

    // Temporary AI logic (backend baad me)
    const reply = "Interesting. Can you tell me about your skills?";
    speak(reply);
    setDisplayText(`AI: ${reply}`);
  };

  return { startInterview, onUserAnswer };
}

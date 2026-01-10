import { useState } from "react";
import { getNextInterviewStep } from "../ai/interviewEngine";
import { useTextToSpeech } from "./useTextToSpeech";

export function useVoiceLoop(setDisplayText, setListening) {
  const { speak } = useTextToSpeech();

  const [interviewState, setInterviewState] = useState({
    round: 1,
    previousQuestions: [],
    previousAnswers: []
  });

  const onUserAnswer = async (answer) => {
    setListening(false);

    const input = {
      candidate: {
        name: "Aman",
        role: "Frontend Developer",
        experience: "Fresher",
        interviewType: "Technical"
      },
      interviewState,
      currentAnswer: answer
    };

    const aiResponse = await getNextInterviewStep(input);

    setInterviewState((prev) => ({
      round: prev.round + 1,
      previousQuestions: [...prev.previousQuestions, aiResponse.question],
      previousAnswers: [...prev.previousAnswers, answer]
    }));

    setDisplayText(aiResponse.question);
    speak(aiResponse.question);
  };

  const startInterview = () => {
    const intro = "Welcome to your interview. Please introduce yourself.";
    setDisplayText(intro);
    speak(intro);
  };

  return { startInterview, onUserAnswer };
}

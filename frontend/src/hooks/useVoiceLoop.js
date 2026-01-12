import { useState } from "react";
import { getNextInterviewStep } from "../ai/interviewEngine";
import { useTextToSpeech } from "./useTextToSpeech";
import { useSpeechToText } from "./useSpeechToText";

export function useVoiceLoop(setDisplayText) {
  const { speak } = useTextToSpeech();

  const { startListening } = useSpeechToText(onUserAnswer);

  const [interviewState, setInterviewState] = useState({
    round: 1,
    previousQuestions: [],
    previousAnswers: []
  });

  function onUserAnswer(answer) {
    handleAnswer(answer);
  }

  const startInterview = () => {
    console.log("🟢 Interview started");

    const intro = "Welcome to your interview. Please introduce yourself.";
    setDisplayText(intro);

    speak(intro);

    // ✅ MUST be called directly from button click
    startListening();
  };

  const handleAnswer = async (answer) => {
    console.log("🗣️ User:", answer);

    const candidateProfile = JSON.parse(
      localStorage.getItem("candidateProfile")
    );

    const input = {
      candidate: candidateProfile,
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

    // ✅ SAFE after first user permission
    setTimeout(() => {
      startListening();
    }, 500);
  };

  return { startInterview };
}

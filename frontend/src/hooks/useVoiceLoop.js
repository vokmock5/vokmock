import { useState } from "react";
import { getNextInterviewStep } from "../ai/interviewEngine";
import { useTextToSpeech } from "./useTextToSpeech";
import { useSpeechToText } from "./useSpeechToText";

export function useVoiceLoop(setDisplayText) {
  const { speak } = useTextToSpeech();

  const { startListening } = useSpeechToText((spokenText) => {
    onUserAnswer(spokenText);
  });

  const [interviewState, setInterviewState] = useState({
    round: 1,
    previousQuestions: [],
    previousAnswers: []
  });

  const startInterview = async () => {
    console.log("🟢 NEW INTERVIEW STARTED");

    const intro = "Welcome to your interview. Please introduce yourself.";
    setDisplayText(intro);

    speak(intro, () => {
      startListening(); // 🎤 auto mic after TTS
    });
  };

  const onUserAnswer = async (answer) => {
    console.log("🗣️ User Answer:", answer);

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

    speak(aiResponse.question, () => {
      startListening(); // 🎤 auto listen again
    });
  };

  return { startInterview };
}

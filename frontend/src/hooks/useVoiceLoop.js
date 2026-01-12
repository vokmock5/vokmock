import { useState, useEffect } from "react";
import { getNextInterviewStep } from "../ai/interviewEngine";
import { useTextToSpeech } from "./useTextToSpeech";
import { useSpeechToText } from "./useSpeechToText";

export function useVoiceLoop(setDisplayText, setListening) {
  const { speak } = useTextToSpeech();

  const { startListening } = useSpeechToText(onUserAnswer);

  const [interviewState, setInterviewState] = useState({
    round: 1,
    previousQuestions: [],
    previousAnswers: []
  });

  const [candidateProfile, setCandidateProfile] = useState(null);

  useEffect(() => {
    const storedProfile = localStorage.getItem("candidateProfile");

    if (!storedProfile) {
      console.error("❌ candidateProfile not found in localStorage");
      return;
    }

    const parsed = JSON.parse(storedProfile);

    console.log("🟢 Loaded candidateProfile:", parsed);

    setCandidateProfile(parsed);
  }, []);

  function onUserAnswer(answer) {
    handleAnswer(answer);
  }

  const startInterview = () => {
    console.log("🟢 Interview started");

    const intro = "Welcome to your interview. Please introduce yourself.";
    setDisplayText(intro);

    if (setListening) setListening(false);
    speak(intro);

    // ✅ MUST be called directly from button click
    if (setListening) setListening(true);
    startListening();
  };

  const handleAnswer = async (answer) => {
    console.log("🗣️ User:", answer);

    let profile = candidateProfile;

    if (!profile) {
      const stored = localStorage.getItem("candidateProfile");
      if (stored) {
        profile = JSON.parse(stored);
        setCandidateProfile(profile);
        console.log("🟢 Loaded candidateProfile from fallback:", profile);
      }
    }

    if (
      !candidateProfile ||
      !candidateProfile.skills ||
      !candidateProfile.projects
    ) {
      console.error("❌ Resume profile missing or incomplete");
      return;
    }

    const input = {
      candidate: profile,
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

    if (setListening) setListening(false);
    speak(aiResponse.question);

    // ✅ SAFE after first user permission
    setTimeout(() => {
      if (setListening) setListening(true);
      startListening();
    }, 500);
  };

  return { startInterview };
}

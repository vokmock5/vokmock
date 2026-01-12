import { useState, useRef } from "react";
import { getNextInterviewStep } from "../ai/interviewEngine";
import { useTextToSpeech } from "./useTextToSpeech";

export function useVoiceLoop(setDisplayText, setListening) {
  const { speak } = useTextToSpeech();

  const getCandidateProfile = () => {
    return JSON.parse(localStorage.getItem("candidateProfile"));
  };

  const isProcessing = useRef(false);

  const [interviewState, setInterviewState] = useState({
    round: 0,
    previousQuestions: [],
    previousAnswers: []
  });

  // ✅ RESET EVERYTHING HERE
  const startInterview = () => {
    console.clear(); // 🔥 clears logs
    isProcessing.current = false;

    setInterviewState({
      round: 1,
      previousQuestions: [],
      previousAnswers: []
    });

    setListening(false);

    const candidateProfile = getCandidateProfile(); // ✅ FRESH DATA

    console.log("🟢 NEW INTERVIEW STARTED");
    console.log("👤 Candidate Profile:", candidateProfile);

    const intro = `Welcome to your ${
      candidateProfile?.domain || "general"
    } interview. Please introduce yourself.`;

    setDisplayText(intro);
    speak(intro);
  }; 

  const onUserAnswer = async (answer) => {
    if (isProcessing.current) return;
    isProcessing.current = true;

    setListening(false);

    try {
      const candidateProfile = getCandidateProfile();

      const input = {
        candidate: {
          name: candidateProfile?.name,
          role: candidateProfile?.domain,
          experience: candidateProfile?.experience,
          skills: candidateProfile?.skills,
          projects: candidateProfile?.projects
        },
        interviewState,
        currentAnswer: answer
      };

      console.log("🗣️ User Answer:", answer);

      const aiResponse = await getNextInterviewStep(input);

      setInterviewState((prev) => ({
        round: prev.round + 1,
        previousQuestions: [...prev.previousQuestions, aiResponse.question],
        previousAnswers: [...prev.previousAnswers, answer]
      }));

      setDisplayText(aiResponse.question);
      speak(aiResponse.question);

    } catch (err) {
      console.error("❌ AI error:", err);
    } finally {
      setTimeout(() => {
        isProcessing.current = false;
      }, 3000);
    }
  };

  return { startInterview, onUserAnswer };
}

import { useState, useEffect, useRef } from "react";
import { getNextInterviewStep } from "../ai/interviewEngine";
import { useTextToSpeech } from "./useTextToSpeech";
import { useSpeechToText } from "./useSpeechToText";

export default function useVoiceLoop(setDisplayText, setListening) {
  const { speak } = useTextToSpeech();

  // eslint-disable-next-line no-unused-vars
  const { startListening: startListeningSTT } = useSpeechToText(onUserAnswer);

  // Simple speech recognition interface
  const recognitionRef = useRef(null);
  const [listening, setListeningState] = useState(false);
  const [transcript, setTranscript] = useState("");

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

  // Simple speech recognition initialization
  const initRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported");
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = "en-US";
    recognitionRef.current.continuous = false;

    recognitionRef.current.onresult = (e) => {
      const text = e.results[0][0].transcript;
      setTranscript(text);
      setListeningState(false);
    };

    recognitionRef.current.onend = () => {
      setListeningState(false);
    };
  };

  // Simple speech recognition controls
  const startListening = () => {
    if (!recognitionRef.current) initRecognition();
    setTranscript("");
    setListeningState(true);
    recognitionRef.current.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListeningState(false);
  };

  function onUserAnswer(answer) {
    handleAnswer(answer);
  }

  const startInterview = () => {
    console.log("🟢 Interview started");

    const intro = "Welcome to your interview. Please introduce yourself.";
    setDisplayText(intro);

    if (setListening) setListening(false);
    speak(intro);

    // ✅ Manual control - user must click to start listening
    // Removed automatic startListening() call
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

    // ✅ AUTO LISTENING REMOVED - user must manually start listening
    // Removed: setTimeout(() => { startListening(); }, 500);
  };

  return {
    transcript,
    listening,
    startListening,
    stopListening,
    startInterview,
  };
}

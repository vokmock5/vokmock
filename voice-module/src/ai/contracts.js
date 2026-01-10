// src/ai/contracts.js

export const inputContract = {
  candidate: {
    name: "",
    role: "",
    experience: "",
    interviewType: ""
  },
  interviewState: {
    round: 1,
    previousQuestions: [],
    previousAnswers: []
  },
  currentAnswer: "" // voice → text comes here
};

export const outputContract = {
  question: "",
  difficulty: "easy", // easy | medium | hard
  tone: "neutral", // friendly | neutral | strict
  feedback: null,
  isInterviewComplete: false
};

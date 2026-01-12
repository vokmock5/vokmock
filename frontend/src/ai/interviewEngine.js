// 






//simi eng
import OpenAI from "openai";
const client = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // acceptable for hackathon
});

// Interview session storage
export const interviewSession = {
  startTime: Date.now(),
  qa: []
};


export async function getNextInterviewStep(input) {
  const systemPrompt = `
You are a professional interviewer conducting a PERSONALIZED interview.

You are given the candidate's RESUME DATA (skills, projects, experience).
You MUST use this data when asking questions.

Your responsibilities:
1. Analyze the candidate's LAST spoken answer.
2. Analyze the candidate's RESUME.
3. Ask the NEXT question by explicitly referencing:
   - at least ONE skill OR
   - ONE project from the resume.

STRICT RULES:
- EVERY question must reference resume data.
- Never ask generic interview questions.
- Ask ONLY ONE question at a time.
- If the answer is weak → ask a clarifying or simpler follow-up.
- If the answer is good → ask a deeper or harder question.
- Increase difficulty gradually.
- Never repeat questions.
- Behave like a real human interviewer.

Respond ONLY in valid JSON with this EXACT structure:
{
  "analysis": {
    "usedResume": true,
    "referencedItem": "skill or project name",
    "answerQuality": "good | partial | poor"
  },
  "question": "resume-specific interview question",
  "difficulty": "easy | medium | hard",
  "tone": "friendly | neutral | strict",
  "isInterviewComplete": false
}
`;

  const userPrompt = `
Candidate Resume:
Skills: ${input.candidate.skills?.length ? input.candidate.skills.join(", ") : "None"}
Projects: ${
    input.candidate.projects?.length
      ? input.candidate.projects.map(p => p.title || p).join(", ")
      : "None"
  }
Experience Level: ${input.candidate.experience}

Interview Domain:
${input.candidate.role}

Previous Questions:
${input.interviewState.previousQuestions.join("\n") || "None"}

Candidate's LAST Answer:
"${
    input.currentAnswer ||
    "This is the start of the interview. Ask the first resume-based question."
  }"

IMPORTANT:
- Your next question MUST explicitly reference the resume.
`;

  const response = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ]
  });

  const content = response.choices[0].message.content;

   const last = interviewSession.qa.length - 1;
  if (last >= 0 && interviewSession.qa[last].answer == null) {
    interviewSession.qa[last].answer = "Answered verbally during interview";
  }
  // try {
  //   return JSON.parse(content);
  // }
  try {
  const parsed = JSON.parse(content);

  // save previous answer
  if (interviewSession.qa.length > 0 && input.currentAnswer) {
    interviewSession.qa[interviewSession.qa.length - 1].answer =
      input.currentAnswer;
  }

  // save current question
  interviewSession.qa.push({
    question: parsed.question,
    answer: null
  });

  return parsed;
}
 
  catch (err) {
    console.error("AI JSON parse error:", err, content);

    // 🔥 fallback so demo NEVER breaks
    return {
      analysis: {
        usedResume: false,
        referencedItem: "fallback",
        answerQuality: "partial"
      },
      question:
        "You mentioned skills in your resume. Can you explain one project where you applied them?",
      difficulty: "easy",
      tone: "neutral",
      isInterviewComplete: false
    };
  }
}

export async function submitAnswer(answer) {
  // send answer to backend / GPT
  console.log("Answer sent:", answer);
  
  // Store answer in session if there's a pending question
  if (interviewSession.qa.length > 0) {
    const lastIndex = interviewSession.qa.length - 1;
    if (interviewSession.qa[lastIndex].answer === null) {
      interviewSession.qa[lastIndex].answer = answer;
    }
  }
}

export async function processUserAnswer(answer) {
  // Process user answer and get next interview step
  console.log("Processing answer:", answer);
  
  // Store answer in session
  await submitAnswer(answer);
  
  // Get candidate profile
  const candidateProfile = JSON.parse(localStorage.getItem("candidateProfile") || "{}");
  
  // Get interview state from session
  const interviewState = {
    round: interviewSession.qa.length,
    previousQuestions: interviewSession.qa.map(q => q.question),
    previousAnswers: interviewSession.qa.map(q => q.answer).filter(a => a !== null)
  };
  
  // Get next interview step
  const input = {
    candidate: candidateProfile,
    interviewState,
    currentAnswer: answer
  };
  
  const aiResponse = await getNextInterviewStep(input);
  
  return {
    nextQuestion: aiResponse.question
  };
}

export async function generateInterviewFeedback() {
  const prompt = `
You are a professional human interviewer conducting a MOCK INTERVIEW.

Here is the interview transcript:
${interviewSession.qa
  .map(
    (q, i) =>
      `Q${i + 1}: ${q.question}\nAnswer: ${q.answer || "No answer"}`
  )
  .join("\n\n")}

Return JSON only:
{
  "overallPerformance": "excellent | good | average | poor",
  "confidenceLevel": "low | medium | high",
  "strengths": ["point 1", "point 2"],
  "weaknesses": ["point 1", "point 2"],
  "improvementTips": ["tip 1", "tip 2"]
}
`;

  const response = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [{ role: "user", content: prompt }]
  });

  const raw = response.choices[0].message.content;

  const cleaned = raw
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    return {
      overallPerformance: "average",
      confidenceLevel: "medium",
      strengths: ["Answered questions clearly"],
      weaknesses: ["Needs more structured answers"],
      improvementTips: ["Practice explaining step by step"]
    };
  }
}
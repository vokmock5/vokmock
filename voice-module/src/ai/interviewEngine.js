import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // acceptable for hackathon
});
// Interview session storage (STEP 1)
export const interviewSession = {
  startTime: Date.now(),
  qa: []
};

export async function getNextInterviewStep(input) {
  const systemPrompt = `
You are a professional human interviewer.

Your job is to:
1. Carefully analyze the candidate's LAST answer
2. Judge understanding, clarity, and confidence
3. Decide the NEXT question based ONLY on that answer

Interview Rules:
- If the answer is weak or vague → ask a clarifying follow-up
- If the answer is good → ask a deeper or harder question
- If the answer is incorrect → gently correct and probe
- Ask ONLY ONE question at a time
- Never repeat questions
- Do NOT rush the interview
- Behave like a real human interviewer

Respond ONLY in valid JSON with this exact structure:
{
  "analysis": {
    "understanding": "good | partial | poor",
    "confidence": "low | medium | high",
    "notes": "short internal reasoning"
  },
  "question": "next interview question",
  "difficulty": "easy | medium | hard",
  "tone": "friendly | neutral | strict",
  "isInterviewComplete": false
}
`;

  const userPrompt = `
Candidate Profile:
Role: ${input.candidate.role}
Experience: ${input.candidate.experience}
Interview Type: ${input.candidate.interviewType}

Previous Questions:
${input.interviewState.previousQuestions.join("\n") || "None"}

Candidate's LAST Answer (MOST IMPORTANT):
"${input.currentAnswer || "This is the start of the interview. Ask the first question."}"

Based on the candidate's answer, decide the next interview question.
`;

  const response = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ]
  });

  const content = response.choices[0].message.content;

  try {
    const parsed = JSON.parse(content);
  // save previous answer
if (interviewSession.qa.length > 0 && input.currentAnswer) {
  interviewSession.qa[interviewSession.qa.length - 1].answer = input.currentAnswer;
}

// save the question
interviewSession.qa.push({
  question: parsed.question,
  answer: null
});

return parsed;

  } catch (err) {
    console.error("AI JSON parse error:", err, content);

    // 🔥 fallback so demo NEVER breaks
    return {
      analysis: {
        understanding: "partial",
        confidence: "medium",
        notes: "Fallback question"
      },
      question: "Can you briefly introduce yourself and your background?",
      difficulty: "easy",
      tone: "neutral",
      isInterviewComplete: false
    };
  }
}
export async function generateInterviewFeedback() {
  const prompt = `
You are a professional human interviewer conducting a MOCK INTERVIEW
for a student or early-career candidate.

Important mindset rules:
- This is a PRACTICE interview, not a real rejection-based interview
- Be realistic, supportive, and encouraging
- Do NOT be overly harsh or academic
- If answers show basic understanding, mark performance as "average" or "good"
- Only mark "poor" if answers are completely irrelevant or missing
- Confidence should be "medium" by default unless the candidate is clearly very unsure
- Focus on effort, clarity, and communication, not perfection
- Use language similar to a real human interviewer giving feedback

Here is the interview transcript:
${interviewSession.qa
  .map(
    (q, i) =>
      `Q${i + 1}: ${q.question}\nAnswer: ${q.answer || "No answer"}`
  )
  .join("\n\n")}

Give structured feedback in JSON only:

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

// remove ```json and ``` if AI adds them
const cleaned = raw
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

try {
  return JSON.parse(cleaned);
} catch (error) {
  console.error("Invalid JSON from AI:", raw);

  // fallback so app never crashes
  return {
    overallPerformance: "average",
    confidenceLevel: "medium",
    strengths: ["Answered questions clearly"],
    weaknesses: ["Needs more structured answers"],
    improvementTips: [
      "Practice explaining concepts step by step",
      "Work on confidence while speaking"
    ]
  };
}

}


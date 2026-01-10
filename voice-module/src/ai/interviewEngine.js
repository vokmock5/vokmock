import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // acceptable for hackathon
});

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
    return JSON.parse(content);
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

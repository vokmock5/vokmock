import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // acceptable for hackathon
});

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

  try {
    return JSON.parse(content);
  } catch (err) {
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

// // 






// //simi eng
// import OpenAI from "openai";
// const client = new OpenAI({
//   apiKey: process.env.REACT_APP_OPENAI_API_KEY,
//   dangerouslyAllowBrowser: true // acceptable for hackathon
// });

// // Interview session storage
// export const interviewSession = {
//   startTime: Date.now(),
//   qa: []
// };


// export async function getNextInterviewStep(input) {
//   const systemPrompt = `
// You are a professional interviewer conducting a PERSONALIZED interview.

// You are given the candidate's RESUME DATA (skills, projects, experience).
// You MUST use this data when asking questions.

// Your responsibilities:
// 1. Analyze the candidate's LAST spoken answer.
// 2. Analyze the candidate's RESUME.
// 3. Ask the NEXT question by explicitly referencing:
//    - at least ONE skill OR
//    - ONE project from the resume.

// STRICT RULES:
// - EVERY question must reference resume data.
// - Never ask generic interview questions.
// - Ask ONLY ONE question at a time.
// - If the answer is weak → ask a clarifying or simpler follow-up.
// - If the answer is good → ask a deeper or harder question.
// - Increase difficulty gradually.
// - Never repeat questions.
// - Behave like a real human interviewer.

// Respond ONLY in valid JSON with this EXACT structure:
// {
//   "analysis": {
//     "usedResume": true,
//     "referencedItem": "skill or project name",
//     "answerQuality": "good | partial | poor"
//   },
//   "question": "resume-specific interview question",
//   "difficulty": "easy | medium | hard",
//   "tone": "friendly | neutral | strict",
//   "isInterviewComplete": false
// }
// `;

//   const userPrompt = `
// Candidate Resume:
// Skills: ${input.candidate.skills?.length ? input.candidate.skills.join(", ") : "None"}
// Projects: ${
//     input.candidate.projects?.length
//       ? input.candidate.projects.map(p => p.title || p).join(", ")
//       : "None"
//   }
// Experience Level: ${input.candidate.experience}

// Interview Domain:
// ${input.candidate.role}

// Previous Questions:
// ${input.interviewState.previousQuestions.join("\n") || "None"}

// Candidate's LAST Answer:
// "${
//     input.currentAnswer ||
//     "This is the start of the interview. Ask the first resume-based question."
//   }"

// IMPORTANT:
// - Your next question MUST explicitly reference the resume.
// `;

//   const response = await client.chat.completions.create({
//     model: "gpt-4.1-mini",
//     messages: [
//       { role: "system", content: systemPrompt },
//       { role: "user", content: userPrompt }
//     ]
//   });

//   const content = response.choices[0].message.content;

//    const last = interviewSession.qa.length - 1;
//   if (last >= 0 && interviewSession.qa[last].answer == null) {
//     interviewSession.qa[last].answer = "Answered verbally during interview";
//   }
//   // try {
//   //   return JSON.parse(content);
//   // }
//   try {
//   const parsed = JSON.parse(content);

//   // save previous answer
//   if (interviewSession.qa.length > 0 && input.currentAnswer) {
//     interviewSession.qa[interviewSession.qa.length - 1].answer =
//       input.currentAnswer;
//   }

//   // save current question
//   interviewSession.qa.push({
//     question: parsed.question,
//     answer: null
//   });

//   return parsed;
// }
 
//   catch (err) {
//     console.error("AI JSON parse error:", err, content);

//     // 🔥 fallback so demo NEVER breaks
//     return {
//       analysis: {
//         usedResume: false,
//         referencedItem: "fallback",
//         answerQuality: "partial"
//       },
//       question:
//         "You mentioned skills in your resume. Can you explain one project where you applied them?",
//       difficulty: "easy",
//       tone: "neutral",
//       isInterviewComplete: false
//     };
//   }
// }

// export async function submitAnswer(answer) {
//   // send answer to backend / GPT
//   console.log("Answer sent:", answer);
  
//   // Store answer in session if there's a pending question
//   if (interviewSession.qa.length > 0) {
//     const lastIndex = interviewSession.qa.length - 1;
//     if (interviewSession.qa[lastIndex].answer === null) {
//       interviewSession.qa[lastIndex].answer = answer;
//     }
//   }
// }

// export async function processUserAnswer(answer) {
//   // Process user answer and get next interview step
//   console.log("Processing answer:", answer);
  
//   // Store answer in session
//   await submitAnswer(answer);
  
//   // Get candidate profile
//   const candidateProfile = JSON.parse(localStorage.getItem("candidateProfile") || "{}");
  
//   // Get interview state from session
//   const interviewState = {
//     round: interviewSession.qa.length,
//     previousQuestions: interviewSession.qa.map(q => q.question),
//     previousAnswers: interviewSession.qa.map(q => q.answer).filter(a => a !== null)
//   };
  
//   // Get next interview step
//   const input = {
//     candidate: candidateProfile,
//     interviewState,
//     currentAnswer: answer
//   };
  
//   const aiResponse = await getNextInterviewStep(input);
  
//   return {
//     nextQuestion: aiResponse.question
//   };
// }

// export async function generateInterviewFeedback() {
//   const prompt = `
// You are a professional human interviewer conducting a MOCK INTERVIEW.

// Here is the interview transcript:
// ${interviewSession.qa
//   .map(
//     (q, i) =>
//       `Q${i + 1}: ${q.question}\nAnswer: ${q.answer || "No answer"}`
//   )
//   .join("\n\n")}

// Return JSON only:
// {
//   "overallPerformance": "excellent | good | average | poor",
//   "confidenceLevel": "low | medium | high",
//   "strengths": ["point 1", "point 2"],
//   "weaknesses": ["point 1", "point 2"],
//   "improvementTips": ["tip 1", "tip 2"]
// }
// `;

//   const response = await client.chat.completions.create({
//     model: "gpt-4.1-mini",
//     messages: [{ role: "user", content: prompt }]
//   });

//   const raw = response.choices[0].message.content;

//   const cleaned = raw
//     .replace(/```json/g, "")
//     .replace(/```/g, "")
//     .trim();

//   try {
//     return JSON.parse(cleaned);
//   } catch {
//     return {
//       overallPerformance: "average",
//       confidenceLevel: "medium",
//       strengths: ["Answered questions clearly"],
//       weaknesses: ["Needs more structured answers"],
//       improvementTips: ["Practice explaining step by step"]
//     };
//   }
// }





import OpenAI from "openai";
const client = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

// Interview session storage
export const interviewSession = {
  startTime: Date.now(),
  qa: []
};

export async function getNextInterviewStep(input) {
  const systemPrompt = `
You are an EXPERT technical interviewer conducting a COMPREHENSIVE resume-based interview.

Your PRIMARY objectives:
1. DEEPLY ANALYZE the candidate's resume (skills, projects, experience)
2. Ask questions that DIRECTLY test their claimed expertise
3. Adapt difficulty based on answer quality
4. Provide HONEST evaluation of each answer

DIFFICULTY LEVELS:
- EASY: Basic concepts, definitions, surface-level understanding
- MEDIUM: Application of concepts, problem-solving, real-world scenarios
- HARD: Deep technical knowledge, edge cases, system design, optimization

ANSWER EVALUATION CRITERIA:
- POOR: Wrong answer, no answer, completely off-topic, demonstrates lack of understanding
- PARTIAL: Partially correct, vague, missing key details, needs clarification
- GOOD: Correct, clear explanation, demonstrates understanding, specific examples

STRICT INTERVIEW RULES:
1. EVERY question MUST reference specific resume items (skills/projects)
2. Start with EASY questions to establish baseline
3. If answer is GOOD → increase difficulty
4. If answer is POOR/PARTIAL → ask simpler follow-up OR move to different topic
5. Ask ONLY ONE question at a time
6. Never ask generic questions - always tie to resume
7. If candidate gives wrong answer 2+ times on same topic → mark as weak area
8. Never repeat questions
9. Be direct and honest in evaluation

RESPONSE FORMAT (STRICT JSON):
{
  "analysis": {
    "usedResume": true,
    "referencedItem": "specific skill or project name from resume",
    "answerQuality": "good | partial | poor",
    "reasoning": "brief explanation of why you rated it this way"
  },
  "question": "next resume-based question",
  "difficulty": "easy | medium | hard",
  "tone": "friendly | neutral | strict",
  "isInterviewComplete": false
}

IMPORTANT:
- Be HONEST in evaluation - don't give good ratings for poor answers
- If candidate doesn't know something → mark as "poor"
- If candidate rambles without answering → mark as "partial" or "poor"
- If candidate gives wrong technical details → mark as "poor"
`;

  const userPrompt = `
=== CANDIDATE RESUME ===
Skills: ${input.candidate.skills?.length ? input.candidate.skills.join(", ") : "No skills listed"}
Projects: ${
    input.candidate.projects?.length
      ? input.candidate.projects.map(p => {
          if (typeof p === 'string') return p;
          return `${p.title || 'Untitled'} - ${p.description || 'No description'}`;
        }).join(" | ")
      : "No projects listed"
  }
Experience Level: ${input.candidate.experience || "Not specified"}
Target Role: ${input.candidate.role || "General interview"}

=== INTERVIEW HISTORY ===
Total Questions Asked: ${input.interviewState.previousQuestions.length}
Previous Questions:
${input.interviewState.previousQuestions.map((q, i) => `${i + 1}. ${q}`).join("\n") || "None - This is the first question"}

Previous Answers Quality:
${input.interviewState.previousAnswers.map((a, i) => `Answer ${i + 1}: ${a || "No answer provided"}`).join("\n") || "None yet"}

=== CANDIDATE'S LATEST ANSWER ===
"${input.currentAnswer || "START OF INTERVIEW - Ask first resume-based question"}"

=== YOUR TASK ===
${input.currentAnswer 
  ? `1. Evaluate the above answer honestly (good/partial/poor)
2. Reference the candidate's resume
3. Ask next question based on:
   - If answer was GOOD → ask harder question on same/different resume topic
   - If answer was POOR → ask easier follow-up OR switch to different resume skill
   - If answer was PARTIAL → ask clarifying question`
  : `1. Start with an EASY question about their FIRST listed skill or project
2. Use their resume to form the question`
}

CRITICAL: Your question MUST explicitly mention a skill/project from their resume.
`;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    temperature: 0.7
  });

  const content = response.choices[0].message.content;

  // Save previous answer if exists
  const last = interviewSession.qa.length - 1;
  if (last >= 0 && interviewSession.qa[last].answer == null && input.currentAnswer) {
    interviewSession.qa[last].answer = input.currentAnswer;
  }

  try {
    const parsed = JSON.parse(content);

    // Validate response structure
    if (!parsed.question || !parsed.difficulty || !parsed.analysis) {
      throw new Error("Invalid AI response structure");
    }

    // Save current question to session
    interviewSession.qa.push({
      question: parsed.question,
      answer: null,
      difficulty: parsed.difficulty,
      expectedQuality: parsed.analysis.answerQuality
    });

    return parsed;
  } catch (err) {
    console.error("AI JSON parse error:", err, content);

    // Fallback question based on resume
    const firstSkill = input.candidate.skills?.[0] || "your technical skills";
    const fallbackQuestion = `Can you explain how you've used ${firstSkill} in a real project?`;

    return {
      analysis: {
        usedResume: true,
        referencedItem: firstSkill,
        answerQuality: "partial",
        reasoning: "Fallback question due to parsing error"
      },
      question: fallbackQuestion,
      difficulty: "easy",
      tone: "neutral",
      isInterviewComplete: false
    };
  }
}

export async function submitAnswer(answer) {
  console.log("Answer submitted:", answer);
  
  // Store answer in session if there's a pending question
  if (interviewSession.qa.length > 0) {
    const lastIndex = interviewSession.qa.length - 1;
    if (interviewSession.qa[lastIndex].answer === null) {
      interviewSession.qa[lastIndex].answer = answer;
    }
  }
}

export async function processUserAnswer(answer) {
  console.log("Processing answer:", answer);
  
  // Store answer in session
  await submitAnswer(answer);
  
  // Get candidate profile from localStorage
  const candidateProfile = JSON.parse(localStorage.getItem("candidateProfile") || "{}");
  
  // Build interview state from session
  const interviewState = {
    round: interviewSession.qa.length,
    previousQuestions: interviewSession.qa.map(q => q.question),
    previousAnswers: interviewSession.qa.map(q => q.answer).filter(a => a !== null)
  };
  
  // Get next interview step with AI evaluation
  const input = {
    candidate: candidateProfile,
    interviewState,
    currentAnswer: answer
  };
  
  const aiResponse = await getNextInterviewStep(input);
  
  return {
    nextQuestion: aiResponse.question,
    evaluation: aiResponse.analysis,
    difficulty: aiResponse.difficulty
  };
}

export async function generateInterviewFeedback() {
  const prompt = `
You are a PROFESSIONAL interviewer providing HONEST, CONSTRUCTIVE feedback after a technical interview.

=== INTERVIEW TRANSCRIPT ===
${interviewSession.qa
  .map((q, i) => 
    `Question ${i + 1} [${q.difficulty || 'unknown'} difficulty]:
${q.question}

Candidate's Answer:
${q.answer || "❌ No answer provided"}
---`
  )
  .join("\n\n")}

=== YOUR TASK ===
Provide HONEST evaluation based on:
1. Answer correctness and depth
2. Technical understanding demonstrated
3. Communication clarity
4. Areas of strength and weakness

EVALUATION CRITERIA:
- EXCELLENT: Answered 80%+ questions correctly with good depth
- GOOD: Answered 60-79% correctly, showed solid understanding
- AVERAGE: Answered 40-59% correctly, some gaps in knowledge
- POOR: Answered <40% correctly, significant knowledge gaps, many unanswered questions

STRICT RULES:
- If candidate gave NO answer or WRONG answers → mark as POOR/AVERAGE
- If candidate struggled with basic questions → mark weaknesses clearly
- Be SPECIFIC in feedback - mention which topics they struggled with
- Don't sugarcoat - this is meant to help them improve

Return ONLY valid JSON:
{
  "overallPerformance": "excellent | good | average | poor",
  "confidenceLevel": "low | medium | high",
  "technicalScore": 0-100,
  "strengths": ["specific strength 1", "specific strength 2", "specific strength 3"],
  "weaknesses": ["specific weakness 1", "specific weakness 2", "specific weakness 3"],
  "improvementTips": ["actionable tip 1", "actionable tip 2", "actionable tip 3"],
  "topicsToStudy": ["topic 1", "topic 2", "topic 3"],
  "summary": "2-3 sentence honest summary of performance"
}
`;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.5
  });

  const raw = response.choices[0].message.content;

  // Clean markdown code blocks if present
  const cleaned = raw
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("Feedback parsing error:", err);
    
    // Fallback feedback
    return {
      overallPerformance: "average",
      confidenceLevel: "medium",
      technicalScore: 50,
      strengths: ["Attempted to answer questions", "Showed willingness to engage"],
      weaknesses: ["Needs more technical depth", "Some answers were unclear"],
      improvementTips: [
        "Practice explaining concepts step-by-step",
        "Review fundamental concepts in your resume skills",
        "Prepare specific examples from your projects"
      ],
      topicsToStudy: ["Core concepts from your resume", "Technical fundamentals"],
      summary: "You participated in the interview but there's room for improvement in technical depth and clarity."
    };
  }
}
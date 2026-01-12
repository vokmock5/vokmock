import OpenAI from "openai";

console.log("ENV KEY:", process.env.REACT_APP_OPENAI_API_KEY);

const client = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function parseResumeWithGPT(resumeText, domain) {
  const systemPrompt = `
You are a professional resume parser.

Extract structured information from the resume.

Return ONLY valid JSON:
{
  "name": "",
  "experienceLevel": "",
  "skills": [],
  "projects": [
    {
      "name": "",
      "description": "",
      "tech": []
    }
  ]
}
`;

  const userPrompt = `
Target Domain: ${domain}

Resume Text:
"""
${resumeText}
"""
`;

  const response = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ]
  });

  return JSON.parse(response.choices[0].message.content);
}

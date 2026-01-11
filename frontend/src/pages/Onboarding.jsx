import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import { parseResumeWithGPT } from "../ai/resumeParser";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  `${window.location.origin}/pdf.worker.min.mjs`;

export default function Onboarding() {
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [domain, setDomain] = useState("Frontend");
  const [loading, setLoading] = useState(false);

  const extractPdfText = async (file) => {
    const buffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;

    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map(i => i.str).join(" ");
    }
    return text;
  };

  const handleSubmit = async () => {
    if (!resume) return alert("Upload resume");

    setLoading(true);
    localStorage.clear();

    const resumeText = await extractPdfText(resume);
    const parsed = await parseResumeWithGPT(resumeText, domain);

    const profile = {
      name: parsed.name || "Candidate",
      experience: parsed.experience || "Student",
      skills: parsed.skills || [],
      projects: parsed.projects || [],
      domain
    };

    localStorage.setItem("candidateProfile", JSON.stringify(profile));
    navigate("/interview");
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-black text-white gap-4">
      <input type="file" accept=".pdf" onChange={e => setResume(e.target.files[0])} />
      <select value={domain} onChange={e => setDomain(e.target.value)}>
        <option>Frontend</option>
        <option>Backend</option>
        <option>Fullstack</option>
        <option>Data Science</option>
      </select>
      <button onClick={handleSubmit} className="bg-cyan-500 px-6 py-3 rounded">
        {loading ? "Preparing..." : "Continue"}
      </button>
    </div>
  );
}

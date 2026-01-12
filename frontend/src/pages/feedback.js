import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

import {
  interviewSession,
  generateInterviewFeedback
} from "../ai/interviewEngine";



function Feedback() {
  const navigate = useNavigate();
  const { id } = useParams();
console.log("Opened interview id:", id);

  console.log("✅ FEEDBACK PAGE RENDERED"); // 👈 YAHAN ADD KARO
  useEffect(() => {
    const vr = document.getElementById("vr-root");
    if (vr) vr.style.display = "none";
  }, []);
  const [loading, setLoading] = useState(false);
  const [aiFeedback, setAiFeedback] = useState(null);
  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden text-slate-900 font-inter">

      {/* Background texture */}
      <div
        className="absolute inset-0 opacity-10 bg-cover bg-center z-0"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1620555791739-438a95e7ff65?crop=entropy&cs=srgb&fm=jpg&q=85)"
        }}
      />

      {/* Foreground Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-16 pb-24">

        <div className="grid grid-cols-[1.2fr_1fr] gap-10 items-center mb-20">
        {/* Left Content */}
        <div>
          <span className="inline-block px-3.5 py-1.5 rounded-full bg-indigo-500/15 text-indigo-300 text-sm mb-4">
          </span>

          <h1 className="text-5xl font-extrabold leading-tight text-slate-900 mb-4">
            Your Interview <br />
            <span className="text-indigo-600">Performance Report</span>
          </h1>

          <p className="text-lg text-slate-600 max-w-xl">
            Get a clear, AI-powered breakdown of your strengths, confidence,
            and areas to improve — just like a real interviewer would.
          </p>
        </div>

        {/* Right Visual Card */}
        {/* <div className="bg-white/4 border border-white/8 rounded-3xl p-7 backdrop-blur-[12px]">
          <h3 className="mb-3">Interview Summary</h3>
          <p className="text-slate-400 text-[15px]">
            Questions Answered: {interviewSession.qa.length}
          </p>
          <p className="text-slate-400 text-[15px]">
            AI Analysis Mode: Enabled
          </p>
        </div>
      </div>  */}

      {/* Right Side Action */}
<div className="flex items-center justify-center">
  <button
    onClick={() => navigate("/dashboard")}
    className="
      px-10 py-4 rounded-full
      text-base font-medium
      text-indigo-600
      bg-white/80
      border border-indigo-200
      backdrop-blur-md
      shadow-md
      hover:bg-white
      hover:shadow-lg
      transition-all
    "
  >
    Go to Dashboard
  </button>
</div>
</div>

       {/* end of header grid */}
      <hr className="my-20 border-slate-300/40" />

      <div className="mt-20 mb-24 flex justify-center">

        <button
          onClick={async () => {
            setLoading(true);
            try {
              const feedback = await generateInterviewFeedback();
              setAiFeedback(feedback);

              const token = localStorage.getItem("token");

await fetch("http://localhost:5000/api/interviews", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  },
  body: JSON.stringify({
    interviewTitle: "Mock Interview",
    qa: interviewSession.qa,
    feedback: {
      ...feedback,
      overallPerformance: "Needs Improvement",
      confidenceLevel: "Medium",
      score: 6
    }
  })
});
            } catch (e) {
              alert("Failed to generate AI feedback");
            }
            setLoading(false);
          }}
          className="
  px-10 py-4 rounded-full
  text-base font-medium
  text-indigo-600
  bg-white/80
  border border-indigo-200
  backdrop-blur-md
  shadow-md
  hover:bg-white
  hover:shadow-lg
  transition-all
"

        >
          {loading ? "Generating Feedback..." : "Generate AI Feedback"}
        </button>
      </div>

      {/* Performance Summary Cards */}
      
        {aiFeedback && (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-24">

    {/* Overall Performance */}
    <div className="rounded-2xl p-6 bg-indigo-50/70 border border-indigo-100 shadow-sm">
  <p className="text-xs font-semibold tracking-wider text-indigo-500 uppercase">
    Overall Performance
  </p>

  <h2 className="text-3xl font-semibold text-slate-900 mt-3">
    Needs Improvement
  </h2>

  <p className="text-sm text-slate-500 mt-2">
    Based on clarity, accuracy, and structure
  </p>
</div>



    {/* Confidence Level */}
    <div className="rounded-2xl p-6 bg-indigo-50/70 border border-indigo-100 shadow-sm">
  <p className="text-xs font-semibold tracking-wider text-indigo-500 uppercase">
    Confidence Level
  </p>

  <h2 className="text-3xl font-semibold text-slate-900 mt-3">
    Medium
  </h2>

  <p className="text-sm text-slate-500 mt-2">
    Based on tone and response certainty
  </p>
</div>



    {/* Questions Answered */}
    <div className="rounded-2xl p-6 bg-teal-50/70 border border-teal-100 shadow-sm">
  <p className="text-xs font-semibold tracking-wider text-teal-600 uppercase">
    Questions Answered
  </p>

  <h2 className="text-4xl font-semibold text-slate-900 mt-3">
    {interviewSession.qa.length}
  </h2>

  <p className="text-sm text-slate-500 mt-2">
    Total interview questions attempted
  </p>
</div>



  </div>
)}


      <div className="mt-24">
        <h2 className="text-3xl font-bold text-slate-900 mb-8">
  Interview Questions & Answers
</h2>
<p className="text-slate-500 mb-12 max-w-2xl">
  Review how you responded to each interview question and identify areas for improvement.
</p>

        {interviewSession.qa.length === 0 ? (
          <p>No interview data available.</p>
        ) : (
          interviewSession.qa.map((item, index) => (
            <div
  key={index}
  className="bg-white/70 backdrop-blur-md border border-slate-200
             rounded-2xl p-6 mb-6 shadow-sm hover:shadow-md transition-shadow
"
>
  {/* Question */}
  <p className="text-sm font-semibold text-indigo-600 mb-2">
    Question {index + 1}
  </p>

  <p className="text-slate-800 leading-relaxed mb-4">
    {item.question}
  </p>

  {/* Answer */}
  <p className="text-sm font-semibold text-teal-600 mb-1">
    Your Answer
  </p>

  <p className="text-slate-700 leading-relaxed">
    {item.answer || "Not answered"}
  </p>
</div>

          ))
        )}

        {aiFeedback && (
          <div className="mt-20">
            {/* Section Header */}
            <div className="mb-8">
              <h2 className="text-4xl font-extrabold mb-3 text-slate-900">
  AI Interview Evaluation
</h2>

<p className="text-lg text-slate-600 max-w-2xl">
  A structured, interviewer-style evaluation of your performance,
  communication clarity, and technical understanding.
</p>

            </div>

            {/* Evaluation Cards */}
            <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
              {/* Strengths */}
              <div className="relative rounded-3xl p-7
                bg-gradient-to-br from-green-500/15 to-emerald-500/5
                border border-green-500/30
                shadow-lg shadow-green-500/10">

  <h3 className="text-xl font-bold text-green-600 mb-4 flex items-center gap-2">
     Strengths
  </h3>

  <ul className="space-y-3 list-disc pl-5">
    {aiFeedback.strengths.map((item, index) => (
      <li
        key={index}
        className="text-green-900 text-base leading-relaxed"
      >
        {item}
      </li>
    ))}
  </ul>
</div>


              {/* Weaknesses */}
              <div className="relative rounded-3xl p-7
                bg-gradient-to-br from-red-500/15 to-rose-500/5
                border border-red-500/30
                shadow-lg shadow-red-500/10">

  <h3 className="text-xl font-bold text-red-500 mb-4 flex items-center gap-2">
     Areas to Improve
  </h3>

  <ul className="space-y-3 list-disc pl-5">
    {aiFeedback.weaknesses.map((item, index) => (
      <li
        key={index}
        className="text-red-900 text-base leading-relaxed"
      >
        {item}
      </li>
    ))}
  </ul>
</div>


              {/* Improvement Tips */}
              <div className="relative rounded-3xl p-7
                bg-gradient-to-br from-sky-500/15 to-indigo-500/5
                border border-sky-500/30
                shadow-lg shadow-sky-500/10">

  <h3 className="text-xl font-bold text-sky-600 mb-4 flex items-center gap-2">
     Improvement Tips
  </h3>

  <ul className="space-y-3 list-disc pl-5">
    {aiFeedback.improvementTips.map((item, index) => (
      <li
        key={index}
        className="text-sky-900 text-base leading-relaxed"
      >
        {item}
      </li>
    ))}
  </ul>
</div>

            </div>
          </div>
        )}
      </div>
    </div>
    </div>
  );
}

export default Feedback;
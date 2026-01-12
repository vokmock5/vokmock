import React, { useState } from "react";
import {
  interviewSession,
  generateInterviewFeedback
} from "../ai/interviewEngine";



function Feedback() {
  const [loading, setLoading] = useState(false);
  const [aiFeedback, setAiFeedback] = useState(null);
  return (
    <div
      style={{
        minHeight: "100vh",
       backgroundColor: "#F8FAFC",
        position: "relative",
        overflow: "hidden",

        color: "#020617",

        padding: "40px",
        fontFamily: "Inter, sans-serif"
      }}
    >
      {/* Background texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.10,
          backgroundImage:
            "url(https://images.unsplash.com/photo-1620555791739-438a95e7ff65?crop=entropy&cs=srgb&fm=jpg&q=85)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: 0
        }}
      />
      {/* Foreground Content */}
<div
  style={{
    maxWidth: "1200px",
    margin: "auto",
    position: "relative",
    zIndex: 1,
    paddingTop: "40px",
    paddingBottom: "80px"
  }}
>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr",
          gap: "40px",
          alignItems: "center",
          marginBottom: "80px"
        }}
      >
        {/* Left Content */}
        <div>
    <span
      style={{
        display: "inline-block",
        padding: "6px 14px",
        borderRadius: "999px",
        background: "rgba(99,102,241,0.15)",
        color: "#a5b4fc",
        fontSize: "14px",
        marginBottom: "16px"
      }}
    >
      
    </span>

    <h1
      style={{
        fontSize: "48px",
        fontWeight: "800",
        lineHeight: "1.1",
        marginBottom: "16px"
      }}
    >
      Your Interview <br />
      <span style={{ color: "#6366f1" }}>Performance Report</span>
    </h1>

    <p
      style={{
        fontSize: "18px",
        color: "#9ca3af",
        maxWidth: "520px"
      }}
    >
      Get a clear, AI-powered breakdown of your strengths, confidence,
      and areas to improve — just like a real interviewer would.
    </p>
  </div>

  {/* Right Visual Card */}
  <div
    style={{
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "20px",
      padding: "28px",
      backdropFilter: "blur(12px)"
    }}
  >
    <h3 style={{ marginBottom: "12px" }}>Interview Summary</h3>
    <p style={{ color: "#9ca3af", fontSize: "15px" }}>
      Questions Answered: {interviewSession.qa.length}
    </p>
    <p style={{ color: "#9ca3af", fontSize: "15px" }}>
      AI Analysis Mode: Enabled
    </p>
    </div>
  </div>
</div>
{/* Performance Summary Cards */}
{aiFeedback && (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
      gap: "24px",
      marginBottom: "80px"
    }}
  >
    {/* Overall Performance */}
    <div
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "20px",
        padding: "24px",
        backdropFilter: "blur(12px)"
        
      }}
    >
      <p
  style={{
    color: "#9ca3af",
    fontSize: "16px",
    letterSpacing: "0.05em",
    textTransform: "uppercase"
  }}
>
  Overall Performance
</p>

<h2
  style={{
    fontSize: "42px",
    fontWeight: "800",
    marginTop: "12px",
    color: "#f87171"
  }}
>
  {aiFeedback.overallPerformance.toUpperCase()}
</h2>
    </div>

    {/* Confidence Level */}
    <div
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "20px",
        padding: "24px",
        backdropFilter: "blur(12px)"
      }}
    >
      <p
  style={{
    color: "#9ca3af",
    fontSize: "14px",
    letterSpacing: "0.05em",
    textTransform: "uppercase"
  }}
>
  Confidence Level
</p>

<h2
  style={{
    fontSize: "42px",
    fontWeight: "800",
    marginTop: "12px",
    color: "#60a5fa"
  }}
>
  {aiFeedback.confidenceLevel.toUpperCase()}
</h2>

    </div>

    {/* Questions Answered */}
    <div
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "20px",
        padding: "24px",
        backdropFilter: "blur(12px)"
      }}
    >
      <p
  style={{
    color: "#9ca3af",
    fontSize: "14px",
    letterSpacing: "0.05em",
    textTransform: "uppercase"
  }}
>
  Questions Answered
</p>

<h2
  style={{
    fontSize: "44px",
    fontWeight: "800",
    marginTop: "12px",
    color: "#22c55e"
  }}
>
  {interviewSession.qa.length}
</h2>

    </div>
  </div>
)}

<div>
        {interviewSession.qa.length === 0 ? (
          <p>No interview data available.</p>
        ) : (
          interviewSession.qa.map((item, index) => (
            <div
              key={index}
              style={{
                backgroundColor: "#020617",
                border: "1px solid #1e293b",
                borderRadius: "12px",
                padding: "20px",
                marginBottom: "20px"
              }}
            >
              <p
                style={{
                  fontWeight: "600",
                  marginBottom: "8px",
                  color: "#38bdf8"
                }}
              >
                Question {index + 1}
              </p>
              <p style={{ marginBottom: "12px" }}>{item.question}</p>

              <p
                style={{
                  fontWeight: "600",
                  marginBottom: "6px",
                  color: "#22c55e"
                }}
              >
                Your Answer
              </p>
              <p style={{ color: "#d1d5db" }}>
                {item.answer || "Not answered"}
              </p>
            </div>
          ))
        )}

        
{aiFeedback && (
  <div style={{ marginTop: "80px" }}>
    {/* Section Header */}
    <div style={{ marginBottom: "32px" }}>
      <h2
        style={{
          fontSize: "32px",
          fontWeight: "700",
          marginBottom: "8px"
        }}
      >
         AI Interview Evaluation
      </h2>
      <p style={{ color: "#9ca3af", fontSize: "16px" }}>
        Detailed analysis based on your answers, confidence, and clarity
      </p>
    </div>

    {/* Evaluation Cards */}
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "24px"
      }}
    >
      {/* Strengths */}
      <div
        style={{
          background: "rgba(34,197,94,0.08)",
          border: "1px solid rgba(34,197,94,0.25)",
          borderRadius: "20px",
          padding: "24px"
        }}
      >
        <h3 style={{ color: "#22c55e", marginBottom: "12px" }}>
           Strengths
        </h3>
        <ul
  style={{
    paddingLeft: "20px",
    marginTop: "12px",
    listStyleType: "disc",
    textAlign: "left"
  }}
>
  {aiFeedback.strengths.map((item, index) => (
    <li
      key={index}
      style={{
        marginBottom: "10px",
        lineHeight: "1.6",
        color: "#d1fae5"
      }}
    >
      {item}
    </li>
  ))}
</ul>

      </div>

      {/* Weaknesses */}
      <div
        style={{
          background: "rgba(248,113,113,0.08)",
          border: "1px solid rgba(248,113,113,0.25)",
          borderRadius: "20px",
          padding: "24px"
        }}
      >
        <h3 style={{ color: "#f87171", marginBottom: "12px" }}>
           Areas to Improve
        </h3>
        <ul
  style={{
    paddingLeft: "20px",
    marginTop: "12px",
    listStyleType: "disc",
    textAlign: "left"
  }}
>
  {aiFeedback.weaknesses.map((item, index) => (
    <li
      key={index}
      style={{
        marginBottom: "10px",
        lineHeight: "1.6",
        color: "#fecaca"
      }}
    >
      {item}
    </li>
  ))}
</ul>

      </div>

      {/* Improvement Tips */}
      <div
        style={{
          background: "rgba(56,189,248,0.08)",
          border: "1px solid rgba(56,189,248,0.25)",
          borderRadius: "20px",
          padding: "24px"
        }}
      >
        <h3 style={{ color: "#38bdf8", marginBottom: "12px" }}>
           Improvement Tips
        </h3>
        <ul
  style={{
    paddingLeft: "20px",
    marginTop: "12px",
    listStyleType: "disc",
    textAlign: "left"
  }}
>
  {aiFeedback.improvementTips.map((item, index) => (
    <li
      key={index}
      style={{
        marginBottom: "10px",
        lineHeight: "1.6",
        color: "#bae6fd"
      }}
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
    
  );
}

export default Feedback;

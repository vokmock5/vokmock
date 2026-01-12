import React, { useState } from "react";
import VoiceUI from "./components/VoiceUI";
import Feedback from "./pages/Feedback";

function App() {
  const [showFeedback, setShowFeedback] = useState(false);

  if (showFeedback) {
    return <Feedback />;
  }

  return (
    <div>
      {/* Interview UI */}
      <VoiceUI />

      {/* TEMP End Interview Button */}
      <button
        onClick={() => setShowFeedback(true)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          padding: "12px 18px",
          backgroundColor: "#dc2626",
          color: "#ffffff",
          border: "none",
          borderRadius: "8px",
          fontSize: "14px",
          cursor: "pointer",
          zIndex: 9999
        }}
      >
        End Interview
      </button>
    </div>
  );
}

export default App;

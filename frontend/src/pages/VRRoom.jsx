import { useEffect } from "react";
import VoiceInterview from "./VoiceInterview";

export default function VRRoom() {
  useEffect(() => {
    console.log("🟢 VR + Voice Interview started");
  }, []);

  return (
    <>
      {/* VR ENVIRONMENT */}
      <iframe
        src="/vr/index.html"
        title="VR Interview Room"
        style={{
          width: "100vw",
          height: "100vh",
          border: "none",
        }}
        allow="xr-spatial-tracking; fullscreen; microphone"
      />

      {/* VOICE INTERVIEW RUNS IN PARALLEL */}
      <VoiceInterview />
    </>
  );
}

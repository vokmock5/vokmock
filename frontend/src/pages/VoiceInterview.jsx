import VoiceUI from "../VoiceUI";

export default function VoiceInterview() {
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      
      {/* 🌍 VR BACKGROUND */}
      <iframe
        src="/vr/index.html"
        title="VR Interview Room"
        allow="microphone; xr-spatial-tracking; fullscreen"
        className="absolute inset-0 w-full h-full border-none"
      />

      {/* 🎤 VOICE UI OVERLAY */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="pointer-events-auto">
          <VoiceUI />
        </div>
      </div>

    </div>
  );
}

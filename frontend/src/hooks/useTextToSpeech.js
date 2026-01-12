export function useTextToSpeech() {
  const speak = (text) => {
    if (!window.speechSynthesis) {
      alert("Text-to-Speech not supported in this browser");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.95;   // natural speed
    utterance.pitch = 1;
    utterance.volume = 1;

    window.speechSynthesis.cancel(); // stop previous speech
    window.speechSynthesis.speak(utterance);
  };

  return { speak };
}

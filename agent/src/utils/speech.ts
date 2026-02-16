import { exec } from "child_process";

export function speak(text: string, voice: string = "Samantha"): void {
  const cleanText = text.replace(/"/g, '\\"');
  exec(`say -v ${voice} "${cleanText}"`, (error) => {
    if (error) {
      console.error("Speech error:", error);
    }
  });
}

// Usage example
// speak("Hello, I am Jimmy, your AI assistant");

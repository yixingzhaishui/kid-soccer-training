export type SpeechEngine = Pick<SpeechSynthesis, 'cancel' | 'speak'>;

export function speakText(text: string, enabled: boolean, engine?: SpeechEngine): void {
  if (!enabled || typeof SpeechSynthesisUtterance === 'undefined') return;
  const speech = engine ?? window.speechSynthesis;
  speech.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.8;
  utterance.lang = 'en-US';
  speech.speak(utterance);
}

export function stopSpeech(engine?: Pick<SpeechSynthesis, 'cancel'>): void {
  if (engine) engine.cancel();
  else if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
}

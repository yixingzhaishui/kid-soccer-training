import { afterEach, describe, expect, it, vi } from "vitest";
import { speakText, stopSpeech } from "../src/logic/speech";

class FakeUtterance {
  rate = 1;
  lang = "";
  constructor(public text: string) {}
}

describe("speech", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("cancels previous speech before speaking slowly", () => {
    vi.stubGlobal("SpeechSynthesisUtterance", FakeUtterance);
    const engine = { cancel: vi.fn(), speak: vi.fn() };
    speakText("Find open space.", true, engine as unknown as SpeechSynthesis);
    expect(engine.cancel).toHaveBeenCalledBefore(engine.speak);
    const utterance = engine.speak.mock.calls[0][0] as FakeUtterance;
    expect(utterance.text).toBe("Find open space.");
    expect(utterance.rate).toBe(0.8);
    expect(utterance.lang).toBe("en-US");
  });

  it("does nothing while sound is disabled", () => {
    vi.stubGlobal("SpeechSynthesisUtterance", FakeUtterance);
    const engine = { cancel: vi.fn(), speak: vi.fn() };
    speakText("No audio", false, engine as unknown as SpeechSynthesis);
    expect(engine.cancel).not.toHaveBeenCalled();
  });

  it("can stop active speech", () => {
    const engine = { cancel: vi.fn() };
    stopSpeech(engine);
    expect(engine.cancel).toHaveBeenCalledOnce();
  });
});

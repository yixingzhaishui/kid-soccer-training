import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { animatedScenarios, packById, scenePacks } from "../lessons";
import {
  loadProgress,
  needsPractice,
  recordResult,
  saveProgress,
  totalScore,
} from "../logic/progress";
import {
  DEFAULT_CHILD_NAME,
  cleanChildName,
  personalizeScenario,
} from "../logic/personalize";
import { speakText, stopSpeech } from "../logic/speech";
import { AnimatedSceneScreen } from "../screens/AnimatedSceneScreen";
import { HomeScreen } from "../screens/HomeScreen";
import {
  PackSelectScreen,
  SceneListScreen,
} from "../screens/LessonSelectScreen";
import { ParentModeScreen } from "../screens/ParentModeScreen";
import type {
  ChoiceResult,
  Progress,
  SceneCategory,
  Settings,
} from "../types/soccer";

type Screen = "home" | "packs" | "list" | "scene" | "parent";
const SETTINGS_KEY = "nolan-animation-settings-v1";
const defaultSettings: Settings = {
  speechEnabled: true,
  reducedMotion: false,
  childName: DEFAULT_CHILD_NAME,
  languageLevel: "older",
};
function loadSettings(): Settings {
  try {
    return {
      ...defaultSettings,
      ...JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? "{}"),
    };
  } catch {
    return defaultSettings;
  }
}

export function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [progress, setProgress] = useState<Progress>(() => loadProgress());
  const [settings, setSettings] = useState<Settings>(() => loadSettings());
  const [packId, setPackId] = useState<SceneCategory>("winger");
  const [practiceMode, setPracticeMode] = useState(false);
  const [practiceIds, setPracticeIds] = useState<string[]>([]);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [holding, setHolding] = useState(false);
  const holdTimer = useRef<number | undefined>(undefined);
  const practiceCandidates = useMemo(
    () =>
      animatedScenarios.filter((item) =>
        needsPractice(progress.sceneResults[item.id]),
      ),
    [progress],
  );
  const practiceScenes = useMemo(
    () =>
      practiceIds
        .map((id) => animatedScenarios.find((item) => item.id === id))
        .filter((item): item is NonNullable<typeof item> => Boolean(item)),
    [practiceIds],
  );
  const normalPack = packById(packId) ?? scenePacks[0];
  const pack = practiceMode
    ? {
        ...normalPack,
        name: "Practice Again",
        icon: "🔁",
        description: "Revisit decisions that need another try.",
        scenes: practiceScenes,
      }
    : normalPack;
  const rawScene = pack.scenes[sceneIndex] ?? normalPack.scenes[0];
  const scene = useMemo(
    () => personalizeScenario(rawScene, settings.childName),
    [rawScene, settings.childName],
  );
  useEffect(() => () => stopSpeech(), []);
  useEffect(
    () => localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)),
    [settings],
  );
  useEffect(() => {
    document.documentElement.dataset.reduceMotion = settings.reducedMotion
      ? "true"
      : "false";
  }, [settings.reducedMotion]);
  const speak = useCallback(
    (text: string) => speakText(text, settings.speechEnabled),
    [settings.speechEnabled],
  );
  const updateProgress = (next: Progress) => {
    setProgress(next);
    saveProgress(next);
  };
  const result = (choice: ChoiceResult, awardPoints: number | undefined) =>
    updateProgress(recordResult(progress, scene.id, choice, awardPoints));
  const next = () => {
    if (sceneIndex < pack.scenes.length - 1) {
      setSceneIndex((index) => index + 1);
    } else setScreen("list");
  };
  const startHold = () => {
    setHolding(true);
    holdTimer.current = window.setTimeout(() => {
      setHolding(false);
      setScreen("parent");
    }, 2000);
  };
  const endHold = () => {
    setHolding(false);
    if (holdTimer.current) clearTimeout(holdTimer.current);
  };
  const home = () => {
    stopSpeech();
    setScreen("home");
  };
  if (screen === "home")
    return (
      <HomeScreen
        childName={settings.childName}
        soundEnabled={settings.speechEnabled}
        score={totalScore(progress)}
        completed={
          Object.values(progress.sceneResults).filter((item) => item.completed)
            .length
        }
        total={scenePacks.reduce((sum, item) => sum + item.scenes.length, 0)}
        onChildName={(childName) =>
          setSettings({ ...settings, childName: cleanChildName(childName) })
        }
        onPlay={() => setScreen("packs")}
        onToggleSound={() =>
          setSettings({ ...settings, speechEnabled: !settings.speechEnabled })
        }
        onParentHoldStart={startHold}
        onParentHoldEnd={endHold}
        holdingParent={holding}
      />
    );
  if (screen === "packs")
    return (
      <PackSelectScreen
        progress={progress}
        practiceCount={practiceCandidates.length}
        onHome={home}
        onPractice={() => {
          setPracticeIds(practiceCandidates.map((item) => item.id));
          setPracticeMode(true);
          setSceneIndex(0);
          setScreen("list");
        }}
        onPack={(id) => {
          setPracticeMode(false);
          setPackId(id);
          setSceneIndex(0);
          setScreen("list");
        }}
      />
    );
  if (screen === "list")
    return (
      <SceneListScreen
        pack={pack}
        progress={progress}
        onBack={() => setScreen("packs")}
        onScene={(index) => {
          setSceneIndex(index);
          setScreen("scene");
        }}
      />
    );
  if (screen === "parent")
    return (
      <ParentModeScreen
        progress={progress}
        settings={settings}
        onSettings={setSettings}
        onProgress={updateProgress}
        onClose={home}
      />
    );
  return (
    <AnimatedSceneScreen
      key={scene.id}
      scene={scene}
      sceneIndex={sceneIndex}
      total={pack.scenes.length}
      score={totalScore(progress)}
      sceneScore={progress.sceneResults[scene.id]?.score ?? 0}
      scenePlays={progress.sceneResults[scene.id]?.plays ?? 0}
      languageLevel={settings.languageLevel}
      onHome={home}
      onBack={() => setScreen("list")}
      onSpeak={speak}
      onResult={result}
      onNext={next}
    />
  );
}

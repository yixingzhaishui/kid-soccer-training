const replacements: Array<[RegExp, string]> = [
  [/counterpress(?: now)?/gi, "win it back fast"],
  [/underlap/gi, "run inside"],
  [/overlap/gi, "run around outside"],
  [/recycle/gi, "play back and try again"],
  [/holding midfielder/gi, "deep midfielder"],
  [/half[- ]space/gi, "inside channel"],
  [/half turn/gi, "turn toward the open side"],
  [/switch (?:the )?play/gi, "move the ball to the open side"],
  [/goal-side/gi, "between the player and goal"],
  [/cutback/gi, "pass back from the end line"],
];

export function childFriendlyLabel(label: string, level: "younger" | "older") {
  if (level === "older") return label;
  return replacements.reduce(
    (text, [pattern, replacement]) => text.replace(pattern, replacement),
    label,
  );
}

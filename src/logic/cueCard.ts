import { mapRoles } from "../lessons/roleMap";

/**
 * Renders the sideline cue card as a PNG and triggers a download. One row per
 * 2-2-2 role: the shout word plus the one-line defending job — everything a
 * parent needs mid-game. The child's own position row is highlighted.
 */
export function downloadCueCard(childName: string, positionId?: string) {
  const width = 1080,
    rowHeight = 150,
    top = 250,
    height = top + mapRoles.length * rowHeight + 110;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) return;

  const gradient = context.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, "#0b9355");
  gradient.addColorStop(1, "#065a34");
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);

  context.fillStyle = "rgba(255,255,255,0.94)";
  context.font = "900 64px 'Fredoka', 'Nunito', system-ui, sans-serif";
  context.textBaseline = "middle";
  context.fillText(`⚽ ${childName}'s Sideline Card`, 48, 90);
  context.font = "700 34px 'Nunito', system-ui, sans-serif";
  context.fillStyle = "rgba(255,255,255,0.8)";
  context.fillText("Point and shout one word — that is enough.", 48, 170);

  mapRoles.forEach((role, index) => {
    const y = top + index * rowHeight;
    const mine = role.id === positionId;
    context.fillStyle = mine
      ? "rgba(255,225,77,0.28)"
      : "rgba(255,255,255,0.1)";
    roundRect(context, 36, y, width - 72, rowHeight - 18, 26);
    context.fill();
    if (mine) {
      context.strokeStyle = "#ffe14d";
      context.lineWidth = 5;
      roundRect(context, 36, y, width - 72, rowHeight - 18, 26);
      context.stroke();
    }
    context.fillStyle = "white";
    context.font = "64px 'Nunito', system-ui, sans-serif";
    context.fillText(role.emoji, 64, y + (rowHeight - 18) / 2);
    context.font = "900 40px 'Fredoka', 'Nunito', system-ui, sans-serif";
    context.fillText(
      `${role.name}${mine ? ` — ${childName}!` : ""}`,
      170,
      y + 42,
    );
    context.font = "900 44px 'Fredoka', 'Nunito', system-ui, sans-serif";
    context.fillStyle = "#ffe14d";
    context.fillText(`📣 ${role.cue}`, 170, y + 96);
    context.fillStyle = "rgba(255,255,255,0.85)";
    context.font = "600 27px 'Nunito', system-ui, sans-serif";
    const duty = role.duty.defend;
    context.fillText(
      duty.length > 52 ? `${duty.slice(0, 52)}…` : duty,
      440,
      y + 96,
    );
  });

  context.fillStyle = "rgba(255,255,255,0.55)";
  context.font = "700 26px 'Nunito', system-ui, sans-serif";
  context.fillText(
    "2-2-2 · attack together, defend together, slide with the ball",
    48,
    height - 52,
  );

  const link = document.createElement("a");
  link.download = `${childName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-sideline-card.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

function roundRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.arcTo(x + width, y, x + width, y + height, radius);
  context.arcTo(x + width, y + height, x, y + height, radius);
  context.arcTo(x, y + height, x, y, radius);
  context.arcTo(x, y, x + width, y, radius);
  context.closePath();
}

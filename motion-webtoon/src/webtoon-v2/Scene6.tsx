import { interpolate, useCurrentFrame } from "remotion";
import { Character, Frame, Sprite } from "./Shared";

export const Scene6 = () => {
  const frame = Math.min(useCurrentFrame(), 59);
  const result = interpolate(frame, [8, 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <Frame background="laboratory" number={6} chapter="" subtitle="우주 기술, 지구에서 먼저!">
    <Sprite path="props/monitor" x={760} y={75} width={500} />
    <div style={{ position: "absolute", left: 810, top: 127, width: 393, height: 262, overflow: "hidden", opacity: result }}>
      <Sprite path="props/water-drop-round" x={20} y={80} width={110} />
      <Sprite path="props/water-tank" x={231} y={10} width={160} />
      <svg width="393" height="262" style={{ position: "absolute", inset: 0 }}><path d="M 143 133 L 220 133 M 199 115 L 220 133 L 199 151" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </div>
    <Character kind="capsule" expression="happy" x={370} y={880} width={630} />
    <Character kind="drop-tower" expression="happy" x={1590} y={880} width={740} />
    <Character kind="plate" expression="smile" x={960} y={820} width={850} />
  </Frame>;
};

import { interpolate, useCurrentFrame } from "remotion";
import { Character, Frame, Sprite } from "./Shared";

export const Scene1 = () => {
  const frame = useCurrentFrame();
  const bubble = interpolate(frame, [8, 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <Frame background="laboratory" number={1} chapter="작은 물방울, 큰 질문" subtitle="우주에선 물이 어떻게 움직일까?">
    <Character kind="capsule" expression="thinking" x={390} y={850} width={430} emphasis={1 + 0.025 * Math.sin(Math.min(frame, 30) / 30 * Math.PI)} />
    <Sprite path="props/pipette" x={1355} y={218} width={410} />
    <Sprite path="props/thought-bubble" x={720} y={160} width={530} style={{ opacity: bubble, scale: 0.85 + 0.15 * bubble, transformOrigin: "20% 90%" }} />
  </Frame>;
};

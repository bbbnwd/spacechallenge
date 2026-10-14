import { interpolate, useCurrentFrame } from "remotion";
import { Frame, Sprite } from "./Shared";

export const Scene1 = () => {
  const frame = useCurrentFrame();
  const bubble = interpolate(frame, [8, 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <Frame background="laboratory" number={1} chapter="" subtitle="우주에선 물이 어떻게 움직일까?">
    {/* Intentional comic close-up; lower body continues beyond the panel. */}
    <div style={{ position: "absolute", left: 0, top: 0, width: 1000, height: 910, overflow: "hidden" }}>
      <Sprite path="characters/capsule/thinking" x={-190} y={-40} width={1180} />
    </div>
    <Sprite path="props/pipette" x={1320} y={85} width={430} />
    <Sprite path="props/thought-bubble" x={745} y={5} width={455} style={{ opacity: bubble, scale: 0.9 + 0.1 * bubble, transformOrigin: "20% 90%" }} />
    <div style={{ position: "absolute", left: 1080, top: 748, width: 660, height: 115, border: "3px dashed #f29e28", borderRadius: 28, backgroundColor: "#fff9edee", color: "#8e5114", fontSize: 32, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>물그릇 소재 대기 · 미리보기 전용</div>
  </Frame>;
};

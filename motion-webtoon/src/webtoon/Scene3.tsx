import { useCurrentFrame } from "remotion";
import { Character, Frame, Label, Sprite } from "./Shared";

export const Scene3 = () => {
  const frame = useCurrentFrame();
  const t = Math.max(0, (frame - 12) / 62);
  const fall = 340 * t * t;
  return <Frame background="vertical-shaft" number={3} chapter="캡슐과 장비가 함께 자유낙하" subtitle="함께 떨어지면…">
    <Character kind="capsule" expression={frame < 12 ? "worried" : "surprised"} x={570} y={460 + fall} width={300} />
    <div style={{ position: "absolute", left: 950, top: 165 + fall, width: 650, height: 330, borderRadius: 25, border: "5px solid #79efd3", overflow: "hidden", backgroundColor: "#13263f" }}>
      <Sprite path="backgrounds/capsule-interior" x={0} y={0} width={650} />
      <Character kind="plate" expression="thinking" x={275} y={290} width={290} />
      <Sprite path="props/water-drop-round" x={245} y={100} width={55} />
      <Sprite path="props/chamber" x={198} y={15} width={150} />
      <Sprite path="props/camera" x={440} y={155} width={112} />
    </div>
    <Label x={960} y={95 + fall}>캡슐 내부 확대 · 모두 함께 낙하</Label>
    <Label x={80} y={150}>{frame < 12 ? "잠깐 멈춤" : "중력에 의해 아래로 가속"}</Label>
    <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}><path d="M 815 430 L 815 680 M 788 650 L 815 680 L 842 650" stroke="#ffcf65" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
  </Frame>;
};

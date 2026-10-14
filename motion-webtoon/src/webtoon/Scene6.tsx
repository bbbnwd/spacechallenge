import { interpolate, useCurrentFrame } from "remotion";
import { Character, Frame, Label, Sprite } from "./Shared";

export const Scene6 = () => {
  const frame = Math.min(useCurrentFrame(), 59);
  const result = interpolate(frame, [8, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <Frame background="laboratory" number={6} chapter="지구의 실험에서 우주 기술로" subtitle="우주 기술, 지구에서 먼저!">
    <Character kind="capsule" expression="happy" x={225} y={850} width={290} />
    <Character kind="drop-tower" expression="happy" x={565} y={850} width={360} />
    <Character kind="plate" expression="smile" x={920} y={825} width={430} />
    <div style={{ position: "absolute", left: 1100, top: 180, width: 750, height: 650, backgroundColor: "rgba(238,249,255,.94)", border: "4px solid #11243d", borderRadius: 35, opacity: result }}>
      <Label x={155} y={32}>관측 결과 → 우주용 물탱크</Label>
      <Sprite path="props/water-drop-round" x={40} y={245} width={205} />
      <Sprite path="props/water-tank" x={425} y={155} width={280} />
      <svg width="750" height="650" style={{ position: "absolute", inset: 0 }}><path d="M 273 350 L 387 350 M 356 321 L 387 350 L 356 379" stroke="#11243d" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>
      <div style={{ position: "absolute", left: 36, top: 540, fontSize: 28, color: "#11243d", fontWeight: 700 }}>물의 움직임을 이해하고 설계에 활용해요</div>
    </div>
  </Frame>;
};

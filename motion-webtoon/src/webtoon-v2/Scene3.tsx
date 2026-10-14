import { interpolate, useCurrentFrame } from "remotion";
import { Character, Frame, Sprite } from "./Shared";

export const Scene3 = () => {
  const frame = useCurrentFrame();
  const t = Math.max(0, (frame - 12) / 62);
  const fall = 190 * t * t;
  const interior = interpolate(frame, [64, 74], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <Frame background="vertical-shaft" number={3} chapter="" subtitle="함께 떨어지면…">
    <Character kind="capsule" expression={frame < 12 ? "worried" : "surprised"} x={965} y={665 + fall} width={530} />
    {/* Brief full-panel push into the interior, no diagram or inset window. */}
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 914, overflow: "hidden", opacity: interior, scale: 1.15 - interior * 0.15 }}>
      <Sprite path="backgrounds/capsule-interior" x={0} y={0} width={1920} />
      <Character kind="plate" expression="thinking" x={1000} y={810} width={900} />
      <Sprite path="props/water-drop-round" x={913} y={180} width={174} />
      <Sprite path="props/chamber" x={817} y={0} width={365} />
      <Sprite path="props/camera" x={1560} y={590} width={275} style={{ scale: "-1 1" }} />
      <Sprite path="props/monitor" x={1420} y={175} width={470} />
    </div>
  </Frame>;
};

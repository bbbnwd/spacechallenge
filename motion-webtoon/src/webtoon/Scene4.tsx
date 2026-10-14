import { interpolate, useCurrentFrame } from "remotion";
import { ExperimentRig, Frame } from "./Shared";

export const Scene4 = () => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, 74], [1, 1.08], { extrapolateRight: "clamp" });
  return <Frame background="capsule-interior" number={4} chapter="함께 떨어질 때 보이는 현상" subtitle="어? 물방울이 떠 있네!" secondary="함께 자유낙하 → 미세중력" worldScale={zoom}>
    <ExperimentRig time={frame} />
  </Frame>;
};

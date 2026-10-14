import { useCurrentFrame } from "remotion";
import { ExperimentRig, Frame } from "./Shared";

export const Scene5 = () => {
  const frame = useCurrentFrame();
  return <Frame background="capsule-interior" number={5} chapter="관측하고, 기록하고" subtitle="이 움직임을 기록하자!" worldScale={1.08}>
    <ExperimentRig time={75 + frame} confident={frame >= 10} record />
  </Frame>;
};

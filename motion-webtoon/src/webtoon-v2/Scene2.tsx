import { useCurrentFrame } from "remotion";
import { Character, Frame } from "./Shared";

export const Scene2 = () => {
  const frame = useCurrentFrame();
  return <Frame background="campus-plaza" number={2} chapter="" subtitle="여기서 먼저 알아보자!">
    <Character kind="capsule" expression="thinking" x={430} y={865} width={530} />
    <Character kind="drop-tower" expression={frame < 10 ? "happy" : "pointing-wink"} x={1345} y={875} width={780} />
  </Frame>;
};

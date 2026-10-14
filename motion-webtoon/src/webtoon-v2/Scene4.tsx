import { useCurrentFrame } from "remotion";
import { ExperimentRig, Frame, Sprite } from "./Shared";

export const Scene4 = () => {
  const frame = useCurrentFrame();
  return <Frame background="capsule-interior" number={4} chapter="" subtitle="어? 물방울이 떠 있네!" secondary="함께 자유낙하 → 미세중력">
    <ExperimentRig time={frame} />
    {/* A comic reaction insert, not a capsule physically inside itself. */}
    <div style={{ position: "absolute", left: 0, top: 65, width: 570, height: 800, overflow: "hidden", borderRadius: "0 45% 45% 0", background: "linear-gradient(90deg,#e6fafff2,#e6faff88,transparent)" }}>
      <Sprite path="characters/capsule/surprised" x={-230} y={-20} width={1020} />
    </div>
  </Frame>;
};

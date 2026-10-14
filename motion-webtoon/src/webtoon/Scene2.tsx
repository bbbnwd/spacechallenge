import { useCurrentFrame } from "remotion";
import { Character, Frame, Label } from "./Shared";

export const Scene2 = () => {
  const frame = useCurrentFrame();
  return <Frame background="campus-plaza" number={2} chapter="지구에서 만나는 우주 실험" subtitle="여기서 먼저 알아보자!">
    <Character kind="capsule" expression="happy" x={420} y={853} width={390} />
    <Character kind="drop-tower" expression={frame < 10 ? "happy" : "pointing-wink"} x={1370} y={850} width={620} emphasis={1 + 0.028 * Math.sin(Math.min(Math.max(frame - 10, 0), 30) / 30 * Math.PI)} />
    <Label x={950} y={150}>드롭타워로 출발!</Label>
    <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}><path d="M 690 650 Q 850 555 1040 635" fill="none" stroke="#11243d" strokeWidth="7" strokeDasharray="14 12" /><path d="M 1012 603 L 1040 635 L 998 645" fill="none" stroke="#11243d" strokeWidth="7" strokeLinejoin="round" /></svg>
  </Frame>;
};

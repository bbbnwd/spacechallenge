import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";

export const palette = { ink: "#11243d", mint: "#79efd3", gold: "#ffcf65" };
export const asset = (path: string) => staticFile(`assets/extracted/${path}.png`);
export const Sprite: React.FC<{ path: string; x: number; y: number; width: number; style?: React.CSSProperties }> = ({ path, x, y, width, style }) => (
  <Img src={asset(path)} style={{ position: "absolute", left: x, top: y, width, height: "auto", ...style }} />
);

export const Character: React.FC<{ kind: "capsule" | "drop-tower" | "plate"; expression: string; x: number; y: number; width: number; emphasis?: number }> = ({ kind, expression, x, y, width, emphasis = 1 }) => {
  const config = { capsule: [560, 768, 280, 716], "drop-tower": [640, 768, 320, 720], plate: [720, 520, 330, 418] }[kind];
  const ratio = width / config[0];
  return <Sprite path={`characters/${kind}/${expression}`} x={x - config[2] * ratio} y={y - config[3] * ratio} width={width} style={{ scale: emphasis, transformOrigin: `${config[2] / config[0] * 100}% ${config[3] / config[1] * 100}%` }} />;
};

export const Frame: React.FC<{ background: string; number: number; chapter: string; children: React.ReactNode; subtitle: string; secondary?: string; worldScale?: number }> = ({ background, number, chapter, children, subtitle, secondary, worldScale = 1 }) => (
  <AbsoluteFill style={{ fontFamily: '"Noto Sans CJK KR", sans-serif', backgroundColor: palette.ink }}>
    <AbsoluteFill style={{ scale: worldScale, transformOrigin: "1000px 450px" }}>
      <Img src={asset(`backgrounds/${background}`)} style={{ width: 1920, height: 1080, objectFit: "cover", position: "absolute" }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg,rgba(8,22,43,.45),transparent 25%,transparent 76%,rgba(8,22,43,.3))" }} />
      {children}
    </AbsoluteFill>
    <div style={{ position: "absolute", top: 36, left: 48, display: "flex", alignItems: "center", gap: 18, color: "white", backgroundColor: "rgba(12,31,53,.92)", padding: "14px 24px", borderRadius: 18 }}>
      <span style={{ fontSize: 27, fontWeight: 800, color: palette.mint }}>0{number} / 06</span>
      <span style={{ width: 2, height: 28, backgroundColor: "#708092" }} />
      <span style={{ fontSize: 30, fontWeight: 700 }}>{chapter}</span>
    </div>
    <div style={{ position: "absolute", top: 45, right: 52, color: "white", fontSize: 25, letterSpacing: 3, textShadow: "0 2px 6px #11243d" }}>DROP TOWER LAB</div>
    {/* Authored Korean text layer, separate from all artwork. */}
    <div data-subtitle style={{ position: "absolute", left: 80, right: 80, top: 914, height: 118, borderRadius: 26, backgroundColor: "rgba(10,29,50,.96)", border: "2px solid rgba(121,239,211,.45)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 62, fontWeight: 800, whiteSpace: "nowrap", boxShadow: "0 12px 40px #0003" }}>{subtitle}</div>
    {secondary ? <div data-secondary style={{ position: "absolute", left: 580, right: 580, top: 838, height: 56, borderRadius: 16, backgroundColor: palette.ink, color: palette.mint, fontWeight: 700, fontSize: 30, display: "flex", justifyContent: "center", alignItems: "center" }}>{secondary}</div> : null}
    <div style={{ position: "absolute", inset: 14, border: "3px solid rgba(255,255,255,.55)", borderRadius: 22, pointerEvents: "none" }} />
  </AbsoluteFill>
);

export const Label: React.FC<{ x: number; y: number; children: React.ReactNode }> = ({ x, y, children }) => <div style={{ position: "absolute", left: x, top: y, padding: "10px 20px", color: "white", backgroundColor: "rgba(13,36,58,.94)", fontSize: 28, fontWeight: 700, borderRadius: 14 }}>{children}</div>;

// Fixed equipment layout reused verbatim across scenes 4 and 5.
export const ExperimentRig: React.FC<{ time: number; confident?: boolean; record?: boolean }> = ({ time, confident = false, record = false }) => (
  <>
    <Character kind="plate" expression={confident ? "confident-wink" : "thinking"} x={1010} y={790} width={650} />
    {/* Droplet is behind the preserved translucent chamber front. */}
    <Sprite path="props/water-drop-round" x={942} y={275 + Math.sin(time / 35) * 4} width={136} />
    <Sprite path="props/chamber" x={840} y={116} width={340} />
    <Sprite path="props/camera" x={360} y={490} width={280} />
    <Sprite path="props/monitor" x={1380} y={460} width={350} />
    {record ? <>
      <div style={{ position: "absolute", left: 1415, top: 495, width: 278, height: 185, overflow: "hidden", borderRadius: 5 }}>
        <Sprite path="props/water-drop-round" x={81} y={30 + Math.sin(time / 35) * 3} width={116} />
        <div style={{ position: "absolute", left: 12, top: 8, color: "white", fontSize: 19, fontWeight: 800 }}>● REC</div>
      </div>
      <svg width="1920" height="1080" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <path d="M 612 600 L 820 340" stroke="#79efd3" strokeWidth="5" strokeDasharray="12 12" fill="none" />
        <path d="M 1188 335 Q 1300 250 1425 453" stroke="#79efd3" strokeWidth="5" strokeDasharray="12 12" fill="none" />
      </svg>
      <Label x={359} y={792}>관측 카메라 · 고정</Label>
      <Label x={1400} y={792}>물방울 관측 화면</Label>
    </> : <>
      <Label x={230} y={260}>플레이트와 장비는 바닥에 고정</Label>
      <Label x={1320} y={260}>함께 떨어지는 실험실</Label>
    </>}
  </>
);

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

export const Frame: React.FC<{ background: string; number: number; chapter: string; children: React.ReactNode; subtitle: string; secondary?: string; worldScale?: number }> = ({ background, children, subtitle, secondary, worldScale = 1 }) => (
  <AbsoluteFill style={{ fontFamily: '"Noto Sans CJK KR", sans-serif', backgroundColor: palette.ink }}>
    <AbsoluteFill style={{ scale: worldScale, transformOrigin: "1000px 450px" }}>
      <Img src={asset(`backgrounds/${background}`)} style={{ width: 1920, height: 1080, objectFit: "cover", position: "absolute" }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg,rgba(8,22,43,.45),transparent 25%,transparent 76%,rgba(8,22,43,.3))" }} />
      {children}
    </AbsoluteFill>
    {/* Authored Korean text layer, separate from all artwork. */}
    <div data-subtitle style={{ position: "absolute", left: 80, right: 80, top: 914, height: 118, borderRadius: 26, backgroundColor: "rgba(10,29,50,.96)", border: "2px solid rgba(121,239,211,.45)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 62, fontWeight: 800, whiteSpace: "nowrap", boxShadow: "0 12px 40px #0003" }}>{subtitle}</div>
    {secondary ? <div data-secondary style={{ position: "absolute", left: 580, right: 580, top: 1040, height: 32, borderRadius: 16, backgroundColor: palette.ink, color: palette.mint, fontWeight: 700, fontSize: 25, display: "flex", justifyContent: "center", alignItems: "center" }}>{secondary}</div> : null}

  </AbsoluteFill>
);

// Keep both observation cuts on one anchored equipment layout.
export const ExperimentRig: React.FC<{ time: number; confident?: boolean; record?: boolean }> = ({ time, confident = false, record = false }) => (
  <>
    <Sprite path="props/monitor" x={1420} y={175} width={470} />
    {record ? <div style={{ position: "absolute", left: 1467, top: 224, width: 371, height: 248, overflow: "hidden", borderRadius: 7 }}>
      <Sprite path="props/water-drop-round" x={104} y={48 + Math.sin(time / 35) * 3} width={164} />
    </div> : null}
    <Character kind="plate" expression={confident ? "confident-wink" : "thinking"} x={1000} y={810} width={900} />
    <Sprite path="props/water-drop-round" x={913} y={180 + Math.sin(time / 35) * 3} width={174} />
    <Sprite path="props/chamber" x={817} y={0} width={365} />
    <Sprite path="props/camera" x={1560} y={590} width={275} style={{ scale: "-1 1" }} />
  </>
);

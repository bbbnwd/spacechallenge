import { useEffect, useState } from "react";
import { AbsoluteFill, Img, Sequence, cancelRender, continueRender, delayRender, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import type { Caption as CaptionCue } from "@remotion/captions";
import assets from "../public/assets/motion-v4/manifest.json";
import captionData from "../public/assets/motion-v4/captions.json";

const captions: CaptionCue[] = captionData.captions;
const notes: CaptionCue[] = captionData.notes;

const originalPath = "assets/keyframes-v3/generated-originals/";
const assetPath = "assets/motion-v4/";
type LayerBox = { x: number; y: number; width: number; height: number };
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const fade = (f: number, start: number, end: number) => interpolate(f, [start, end], [0, 1], clamp);
const ease = (t: number) => t*t*(3-2*t);
let fontPromise: Promise<FontFace> | undefined;

const useCaptionFont = () => {
  const [handle] = useState(() => delayRender("Load bundled Korean caption font"));
  useEffect(() => {
    if (!fontPromise) {
      fontPromise = new FontFace("WebtoonCaptions", `url("${staticFile(`${assetPath}fonts/captions.otf`)}")`).load();
    }
    fontPromise.then((font) => { document.fonts.add(font); continueRender(handle); }).catch(cancelRender);
  }, [handle]);
};

const Layer = ({ scene, name, transform = "", opacity = 1, origin = "50% 50%" }: { scene: string; name: string; transform?: string; opacity?: number; origin?: string }) => {
  const data = assets as Record<string, { layers: Record<string, LayerBox> }>;
  const box = data[scene].layers[name];
  return <Img src={staticFile(`${assetPath}${scene}-${name}.png`)} style={{ position: "absolute", left: box.x, top: box.y, width: box.width, height: box.height, transform, transformOrigin: origin, opacity }} />;
};

const Caption = ({ text, top = false, right = false, note }: { text: string; top?: boolean; right?: boolean; note?: string }) => {
  const frame = useCurrentFrame();
  useCaptionFont();
  return <div style={{ position: "absolute", ...(top ? { top: 34 } : { bottom: 28 }), ...(right ? { right: 54 } : { left: 54 }), opacity: fade(frame, 3, 11), transform: `translateY(${8*(1-fade(frame,3,11))}px)`, fontFamily: '"WebtoonCaptions", "Noto Sans CJK KR", sans-serif', color: "white", fontWeight: 700 }}>
    {note && <div style={{ fontSize: 27, background: "rgba(7,22,36,.87)", padding: "8px 18px", borderRadius: 12, width: "fit-content", marginBottom: 8 }}>{note}</div>}
    <div style={{ fontSize: 43, lineHeight: 1.35, padding: "13px 24px", background: "rgba(7,22,36,.88)", border: "1px solid rgba(255,255,255,.28)", borderRadius: 18, boxShadow: "0 4px 18px rgba(0,0,0,.18)" }}>{text}</div>
  </div>;
};

export const Scene1V4 = () => {
  const f = useCurrentFrame();
  const pop = ease(fade(f, 5, 19));
  const dropPhase = Math.sin(Math.PI * fade(f, 18, 48));
  return <AbsoluteFill style={{ background: "#132536", overflow: "hidden" }}>
    <AbsoluteFill style={{ transform: `scale(${1 + .008*ease(fade(f,0,59))})`, transformOrigin: "55% 50%" }}>
      <Img src={staticFile(`${assetPath}s1-plate.png`)} style={{ width: "100%", height: "100%" }} />
      <Layer scene="s1" name="thought" opacity={pop} transform={`scale(${.86+.14*pop})`} origin="10% 90%" />
      <Layer scene="s1" name="drop" transform={`scale(${1-.024*dropPhase},${1+.035*dropPhase})`} origin="52% 0%" />
    </AbsoluteFill>
    <Caption top text={captions[0].text} />
  </AbsoluteFill>;
};

const Plate = ({ scene }: { scene: string }) => <Img src={staticFile(`${assetPath}${scene}-plate.png`)} style={{ width: "100%", height: "100%" }} />;
const Original = ({ file }: { file: string }) => <Img src={staticFile(`${originalPath}${file}`)} style={{ width: "100%", height: "100%" }} />;

export const Scene2V4 = () => {
  const f = useCurrentFrame();
  const gesture = Math.sin(Math.PI*2*fade(f,6,48)) * fade(f,6,12) * (1-fade(f,46,57));
  const response = Math.sin(Math.PI*fade(f,16,46));
  return <AbsoluteFill style={{ overflow: "hidden" }}>
    <Plate scene="s2" />
    <Layer scene="s2" name="guide-left" transform={`rotate(${-3*gesture}deg)`} origin="83% 88%" />
    <Layer scene="s2" name="guide-right" transform={`rotate(${2.5*gesture}deg)`} origin="12% 65%" />
    <Layer scene="s2" name="reaction" transform={`translateY(${-4*response}px) rotate(${-2*response}deg)`} origin="30% 94%" />
    <Caption text={captions[1].text} right />
  </AbsoluteFill>;
};

export const Scene3V4 = () => {
  const f = useCurrentFrame();
  // Twelve frames at rest, then acceleration down the shaft. Interior equipment
  // is part of this one original-pixel layer and shares the same displacement.
  const t = fade(f,12,74);
  const y = 1110*t*t;
  return <AbsoluteFill style={{ overflow: "hidden" }}>
    {/* Restored continuous shaft prevents the old capsule silhouette from
        remaining as a seam when the complete original capsule falls away. */}
    <Img src={staticFile(`${assetPath}restored/s3.png`)} style={{ width: "100%", height: "100%" }} />
    <Layer scene="s3" name="capsule" transform={`translateY(${y}px)`} />
    <Caption right text={captions[2].text} />
  </AbsoluteFill>;
};

export const Scene4V4 = () => {
  const f = useCurrentFrame();
  const emphasis = Math.sin(Math.PI*fade(f,12,67));
  return <AbsoluteFill>
    <Original file="scene-4-refined.png" />
    <div style={{ position: "absolute", left: 990, top: 368, width: 240, height: 240, borderRadius: "50%", opacity: .25*emphasis, boxShadow: "0 0 44px 18px #4acfff", border: "3px solid #b7f6ff", pointerEvents: "none" }} />
    <Caption right text={captions[3].text} note={notes[0].text} />
  </AbsoluteFill>;
};

export const Scene5V4 = () => {
  const f = useCurrentFrame();
  const response = Math.sin(Math.PI*fade(f,30,65));
  const signal = .55 + .45*Math.sin(f*Math.PI/15)**2;
  const focus = ease(fade(f,18,35));
  return <AbsoluteFill>
    <Plate scene="s5" />
    <Layer scene="s5" name="reaction" transform={`rotate(${-2.5*response}deg) translateY(${-2*response}px)`} origin="12% 45%" />
    <div style={{ position: "absolute", left: 1356, top: 194, width: 12, height: 12, borderRadius: "50%", background: "#ff5c66", opacity: signal, boxShadow: "0 0 13px #ff6677" }} />
    <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: focus*.75 }}>
      <path d="M1408 392 v-28 h28 M1778 394 v-28 h-28 M1414 676 v28 h28 M1784 670 v28 h-28" fill="none" stroke="#c8f9ff" strokeWidth="4" />
      <circle cx="1592" cy="529" r="198" fill="none" stroke="#70e9ff" strokeWidth="2" opacity=".3" />
    </svg>
    <Caption text={captions[4].text} />
  </AbsoluteFill>;
};

export const Scene6V4 = () => {
  const f = useCurrentFrame();
  const gesture = Math.sin(Math.PI*2*fade(Math.min(f,59),4,49)) * fade(f,4,12) * (1-fade(f,44,59));
  const left = fade(f,9,20) * (1-.65*fade(f,30,40));
  const right = fade(f,32,43) * (1-.65*fade(f,49,59));
  return <AbsoluteFill>
    <Plate scene="s6" />
    <Layer scene="s6" name="capsule-fist" transform={`rotate(${-4*gesture}deg)`} origin="55% 98%" />
    <Layer scene="s6" name="plate-fist" transform={`rotate(${3.5*gesture}deg)`} origin="10% 45%" />
    <Layer scene="s6" name="guide-palm" transform={`rotate(${-3*gesture}deg)`} origin="12% 24%" />
    <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
      <circle cx="600" cy="258" r="102" fill="none" stroke="#d3fcff" strokeWidth="4" opacity={.65*left} />
      <ellipse cx="1065" cy="372" rx="148" ry="112" fill="none" stroke="#d3fcff" strokeWidth="4" opacity={.65*right} />
    </svg>
    <Caption text={captions[5].text} />
  </AbsoluteFill>;
};

export const DropTowerWebtoonV4 = () => {
  const { fps } = useVideoConfig();
  return <AbsoluteFill style={{ background: "#132536" }}>
    <Sequence name="01-Question" durationInFrames={2*fps} premountFor={fps}><Scene1V4 /></Sequence>
    <Sequence name="02-Guide" from={2*fps} durationInFrames={2*fps} premountFor={fps}><Scene2V4 /></Sequence>
    <Sequence name="03-FreeFall" from={4*fps} durationInFrames={2.5*fps} premountFor={fps}><Scene3V4 /></Sequence>
    <Sequence name="04-Microgravity" from={6.5*fps} durationInFrames={2.5*fps} premountFor={fps}><Scene4V4 /></Sequence>
    <Sequence name="05-Record" from={9*fps} durationInFrames={3*fps} premountFor={fps}><Scene5V4 /></Sequence>
    <Sequence name="06-Celebrate" from={12*fps} durationInFrames={3*fps} premountFor={fps}><Scene6V4 /></Sequence>
  </AbsoluteFill>;
};

export const OriginalReferenceV4 = () => <Img src={staticFile(`${originalPath}scene-1.png`)} style={{ width: 1920, height: 1080 }} />;

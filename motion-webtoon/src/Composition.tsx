import { AbsoluteFill, Composition, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

// Asset-free environment check. Replace this screen when production begins.
export const MyComponent: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: "#101827", color: "#f5f7fb", justifyContent: "center", alignItems: "center", fontFamily: "sans-serif" }}>
      <div style={{ fontSize: 28, letterSpacing: 8, color: "#76e2ce", marginBottom: 28 }}>MOTION WEBTOON</div>
      <div style={{ fontSize: 84, fontWeight: 700 }}>Ready to create</div>
      <div style={{ fontSize: 34, color: "#a6b4c8", marginTop: 32 }}>1920 × 1080 · 30 FPS · 15 SECONDS</div>
      <div style={{ position: "absolute", left: 160, right: 160, bottom: 140, height: 12, borderRadius: 6, backgroundColor: "#25344c", overflow: "hidden" }}>
        <div style={{ height: "100%", backgroundColor: "#76e2ce", width: `${interpolate(frame, [0, durationInFrames - 1], [0, 100])}%` }} />
      </div>
    </AbsoluteFill>
  );
};

export const MyComposition = () => (
  <Composition id="MotionWebtoon" component={MyComponent} durationInFrames={450} fps={30} width={1920} height={1080} />
);

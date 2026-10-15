import { AbsoluteFill, Img, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";

export const originalScenes = [
  { file: "scene-1.png", frames: 60, origin: "60% 52%", zoom: 0.024 },
  { file: "scene-2-refined.png", frames: 60, origin: "52% 45%", zoom: 0.018 },
  { file: "scene-3.png", frames: 75, origin: "50% 54%", zoom: 0.032 },
  { file: "scene-4-refined.png", frames: 75, origin: "55% 48%", zoom: 0.024 },
  { file: "scene-5-refined.png", frames: 90, origin: "62% 45%", zoom: 0.028 },
  { file: "scene-6-refined.png", frames: 90, origin: "50% 50%", zoom: -0.025 },
] as const;

const OriginalScene = ({ index }: { index: number }) => {
  const frame = useCurrentFrame();
  const scene = originalScenes[index];
  const progress = interpolate(frame, [0, scene.frames - 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const eased = progress * progress * (3 - 2 * progress);
  const scale = scene.zoom < 0 ? 1 - scene.zoom * (1 - eased) : 1 + scene.zoom * eased;
  const opacity = index === 0 ? 1 : interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity, overflow: "hidden" }}>
    <Img src={staticFile(`assets/keyframes-v3/generated-originals/${scene.file}`)} style={{ width: "100%", height: "100%", objectFit: "contain", transform: `scale(${scale})`, transformOrigin: scene.origin }} />
  </AbsoluteFill>;
};

// Six original illustrations remain intact; only camera motion and dissolves are applied.
export const DropTowerWebtoonV3 = () => {
  let from = 0;
  return <AbsoluteFill style={{ backgroundColor: "#0a1728" }}>
    {originalScenes.map((scene, index) => {
      const start = from;
      from += scene.frames;
      return <Sequence key={scene.file} from={start} durationInFrames={scene.frames + (index < 5 ? 8 : 0)} premountFor={30}>
        <OriginalScene index={index} />
      </Sequence>;
    })}
  </AbsoluteFill>;
};

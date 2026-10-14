import { TransitionSeries } from "@remotion/transitions";
import { useVideoConfig } from "remotion";
import { Scene1 } from "./webtoon/Scene1";
import { Scene2 } from "./webtoon/Scene2";
import { Scene3 } from "./webtoon/Scene3";
import { Scene4 } from "./webtoon/Scene4";
import { Scene5 } from "./webtoon/Scene5";
import { Scene6 } from "./webtoon/Scene6";

export const DropTowerWebtoon = () => {
  const { fps } = useVideoConfig();
  return <TransitionSeries>
    <TransitionSeries.Sequence name="01-Question" durationInFrames={60} premountFor={fps}><Scene1 /></TransitionSeries.Sequence>
    <TransitionSeries.Sequence name="02-Guide" durationInFrames={60} premountFor={fps}><Scene2 /></TransitionSeries.Sequence>
    <TransitionSeries.Sequence name="03-FreeFall" durationInFrames={75} premountFor={fps}><Scene3 /></TransitionSeries.Sequence>
    <TransitionSeries.Sequence name="04-Microgravity" durationInFrames={75} premountFor={fps}><Scene4 /></TransitionSeries.Sequence>
    <TransitionSeries.Sequence name="05-Observe" durationInFrames={90} premountFor={fps}><Scene5 /></TransitionSeries.Sequence>
    <TransitionSeries.Sequence name="06-SpaceTechnology" durationInFrames={90} premountFor={fps}><Scene6 /></TransitionSeries.Sequence>
  </TransitionSeries>;
};

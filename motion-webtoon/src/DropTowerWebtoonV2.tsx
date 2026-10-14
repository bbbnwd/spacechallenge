import { TransitionSeries } from "@remotion/transitions";
import { useVideoConfig } from "remotion";
import { Scene1 } from "./webtoon-v2/Scene1";
import { Scene2 } from "./webtoon-v2/Scene2";
import { Scene3 } from "./webtoon-v2/Scene3";
import { Scene4 } from "./webtoon-v2/Scene4";
import { Scene5 } from "./webtoon-v2/Scene5";
import { Scene6 } from "./webtoon-v2/Scene6";

export const DropTowerWebtoonV2 = () => {
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

import { MyComposition } from "./Composition";
import { Composition, Folder } from "remotion";
import { DropTowerWebtoonV2 } from "./DropTowerWebtoonV2";
import { DropTowerWebtoonV3 } from "./DropTowerWebtoonV3";
import { DropTowerWebtoonV4, Scene1V4, Scene2V4, Scene3V4, Scene4V4, Scene5V4, Scene6V4 } from "./DropTowerWebtoonV4";
import { DropTowerWebtoon } from "./DropTowerWebtoon";
import { Scene1 } from "./webtoon/Scene1";
import { Scene2 } from "./webtoon/Scene2";
import { Scene3 } from "./webtoon/Scene3";
import { Scene4 } from "./webtoon/Scene4";
import { Scene5 } from "./webtoon/Scene5";
import { Scene6 } from "./webtoon/Scene6";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <Composition id="Scene1V4-Test" component={Scene1V4} durationInFrames={60} fps={30} width={1920} height={1080} />
      <Composition id="DropTowerWebtoonV4" component={DropTowerWebtoonV4} durationInFrames={450} fps={30} width={1920} height={1080} />
      <Folder name="DropTower-V4-Scenes">
        <Composition id="Scene2V4-Guide" component={Scene2V4} durationInFrames={60} fps={30} width={1920} height={1080} />
        <Composition id="Scene3V4-FreeFall" component={Scene3V4} durationInFrames={75} fps={30} width={1920} height={1080} />
        <Composition id="Scene4V4-Microgravity" component={Scene4V4} durationInFrames={75} fps={30} width={1920} height={1080} />
        <Composition id="Scene5V4-Record" component={Scene5V4} durationInFrames={90} fps={30} width={1920} height={1080} />
        <Composition id="Scene6V4-Celebrate" component={Scene6V4} durationInFrames={90} fps={30} width={1920} height={1080} />
      </Folder>
      <Composition id="DropTowerWebtoonV3" component={DropTowerWebtoonV3} durationInFrames={450} fps={30} width={1920} height={1080} />
      <Composition id="DropTowerWebtoonV2" component={DropTowerWebtoonV2} durationInFrames={450} fps={30} width={1920} height={1080} />
      <Composition id="DropTowerWebtoon" component={DropTowerWebtoon} durationInFrames={450} fps={30} width={1920} height={1080} />
      <Folder name="DropTower-Scenes">
        <Composition id="Scene1-Question" component={Scene1} durationInFrames={60} fps={30} width={1920} height={1080} />
        <Composition id="Scene2-Guide" component={Scene2} durationInFrames={60} fps={30} width={1920} height={1080} />
        <Composition id="Scene3-FreeFall" component={Scene3} durationInFrames={75} fps={30} width={1920} height={1080} />
        <Composition id="Scene4-Microgravity" component={Scene4} durationInFrames={75} fps={30} width={1920} height={1080} />
        <Composition id="Scene5-Observe" component={Scene5} durationInFrames={90} fps={30} width={1920} height={1080} />
        <Composition id="Scene6-SpaceTechnology" component={Scene6} durationInFrames={90} fps={30} width={1920} height={1080} />
      </Folder>
    </>
  );
};

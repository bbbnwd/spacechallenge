import { MyComposition } from "./Composition";
import { Composition, Folder } from "remotion";
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

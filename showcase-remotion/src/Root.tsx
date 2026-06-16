import "./index.css";
import { Composition } from "remotion";
import { ShowcaseComposition, showcaseDuration, showcaseFps } from "./Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Showcase"
        component={ShowcaseComposition}
        durationInFrames={showcaseDuration}
        fps={showcaseFps}
        width={1280}
        height={720}
      />
    </>
  );
};

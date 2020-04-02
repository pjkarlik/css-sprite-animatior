import React, { useContext } from "react";
import { Store } from "../Store";
import CanvasWindow from "./CanvasWindow";
import AnimationWindow from "./AnimationWindow";
import FramesWindow from "./FramesWindow";
import ColorPalette from "./ColorPalette";
import Controlls from "./Controlls";
import ClassStyles from "../styles/styles.less";
import { size } from '../styles/tokens.less';

const SpriteAnimator = props => {
  const { state } = useContext(Store);
  const { width, height } = state;
  // size of pixels of editible canvas
  // add two for borders
  const pixelSize = parseInt(size, 10) + 2;
  // size for preview container
  // cause when doing css box-shadow 
  // sprites the div is only as big 
  // as the pixel size
  const previewContainer = size => {
    return {
      width: size * width,
      height: size * height
    };
  };
  // preview animation pixel size 
  const pvSize = 4;
  return (
    <div className={ClassStyles.appcontainer}>
      <div className={ClassStyles.container}>
        <Controlls />
        <ColorPalette />
        <CanvasWindow size={pixelSize} />

        <div className={ClassStyles.preview} style={previewContainer(pvSize)}>
          <AnimationWindow size={pvSize} />
        </div>
        <FramesWindow size={2} />
      </div>
    </div>
  );
};

export default SpriteAnimator;

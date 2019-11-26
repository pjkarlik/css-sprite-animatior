import React, { useContext } from 'react';
import { Store } from '../Store';
import { updateCurrent } from '../Actions';
import CssFrame from './CssFrame';
import ClassStyles from '../styles/styles.less';
/**
 * Generate the list of frames including states for over/active
 * @param {object} props 
 */
const FramesWindow = (props) => {
  const { state, dispatch } = useContext(Store);
  const { frames, width, height, currentFrame } = state;
  const { size = 2 } = props;

  const frameStyle = (size) => {
    return {
      width: (size * width),
      height: (size * height)
    };
  };

  return (
    <ul className={ClassStyles.framescontainer}>
      {frames.map((frame, index) => {
        return (
          <li
            className={`${ClassStyles.frame} ${currentFrame === index ? ClassStyles.active : null}`}
            style={frameStyle(size)}
            key={`frame-${index}`}
            onClick={() => { updateCurrent(index, dispatch); }}
          >
            <CssFrame frame={frame} width={width} height={height} size={size} />
          </li>
        );
      })}
    </ul>
  );
};

export default FramesWindow;
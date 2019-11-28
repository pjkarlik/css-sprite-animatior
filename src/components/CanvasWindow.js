import React, { useContext } from 'react';
import { Store } from '../Store';
import { updatePixel } from '../Actions';
import ClassStyles from '../styles/styles.less';

const CanvasWindow = (props) => {
  const { size } = props;
  const { state, dispatch } = useContext(Store);
  const { canvasArray, width, height } = state;

  const generateFrame = () => {
    if (canvasArray === undefined) return;

    let pixelRow = [];
    const pixelSet = canvasArray.map((cell, index) => {
      const x = index % width;
      const y = (index - x) / height;
      let object;
      object = (
        <a
          key={`pixelButton-${x}-${y}`}
          className={ClassStyles.box}
          style={{ background: cell.color }}
          onClick={() => { updatePixel(index, dispatch); }}>
          &nbsp;
        </a>
      );

      pixelRow.push(object);
      console.log(size);
      if (x === width - 1) {
        const rowStyle = size > 0 ? `${size}px` : 'auto';
        const row = (
          <div className={size > 0 ?
            ClassStyles.pixelrow : ClassStyles.row} style={{ height: size }} key={`row${y}`}>
            {pixelRow}
          </div>
        );
        pixelRow = [];
        return row;
      }
    });
    return pixelSet;
  };

  return (
    <div className={ClassStyles.canvas}
      style={{ width: `${size * width}px`, height: `${size * height}px` }}>
      {generateFrame()}
    </div>
  );
};

export default CanvasWindow;
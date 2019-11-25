import React, { Component } from 'react';
import PropTypes from 'prop-types';

import AppStyles from '../styles/styles.less';


class Frames extends Component {
  render() {
    const { frames, loadFrame, generateFrame, deleteFrame, currentFrame = 0 } = this.props;

    const frameObject = frames.map((frame, index) => {
      const frameStyle = currentFrame === index ?
        `${AppStyles.framebox} ${AppStyles.active}` : AppStyles.framebox;
      return (
        <div className={frameStyle} key={`framebox${index}`}>
          { index > 0 ?
            <a 
              className={AppStyles.delete}
              role="button"
              tabIndex="0"
              onClick={() => {deleteFrame(index);}}
            >x</a> : null }
          <a 
            className={AppStyles.frame}
            role="button"
            tabIndex="0"
            onClick={() => {loadFrame(index);}}
          >
            {generateFrame(frame,4)}
          </a>
        </div>
      );
    });
    return (
      <div className={AppStyles.framescontainer} >
        <h5>Animation Frames</h5>
        <div className={frames.length > 0 ? null : AppStyles.hidden}>
          {frameObject}
        </div>
      </div>
    );
  }
}

Frames.displayName = 'Frames';
Frames.propTypes = {
  generateFrame: PropTypes.func.isRequired,
  loadFrame: PropTypes.func.isRequired,
  frames: PropTypes.array.isRequired,
  currentFrame: PropTypes.number,
  connectDragSource: PropTypes.func,
  isDragging: PropTypes.bool
};

export default Frames;
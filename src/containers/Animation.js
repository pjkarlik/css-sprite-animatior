import React, { Component } from 'react';
import PropTypes from 'prop-types';

import AppStyles from '../styles/styles.less';

class Animation extends Component {
  constructor(props){
    super(props);
  }

  render() {
    const { generateFrame, frames, size, index, generatePacket, isPlaying } = this.props;
    // for FadeCandy development - empty function otherwise // 
    generatePacket(frames[index]);
    return (
      <div className={AppStyles.animationcontainer}>
        <h5>Preview</h5>
        {generateFrame(frames[index], size)}
        <div className={AppStyles.display}>
          frame {index} of {frames.length || 0}
        </div>
      </div>
    );
  }
}

Animation.displayName = 'Animation';
Animation.propTypes = {
  generateFrame: PropTypes.func.isRequired,
  isPlaying: PropTypes.bool,
  frames: PropTypes.array.isRequired,
  size: PropTypes.number,
  index: PropTypes.number
};
Animation.defaultProps = {
  size: 4,
  index: 0,
  isPlaying: true
};

export default Animation;

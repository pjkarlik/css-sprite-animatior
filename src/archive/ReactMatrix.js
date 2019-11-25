import React, { Component, useContext } from 'react';
import PropTypes from 'prop-types';

import Frames from '../containers/Frames';
import Animation from '../containers/Animation';
import ClassStyles from '../styles/styles.less';
import ColorPallet from '../containers/Colors';

// uncomment to see premade animation - change grid to 8 x 8 width x height
// import frames from '../animations/Bird';
// import frames from '../animations/RunningMan';

/* eslint no-console:0 */
class App extends Component {

  static displayName = 'App';
  static propTypes = {
    width: PropTypes.number,          // width of pixel grid
    height: PropTypes.number,         // height of pixel grid
    size: PropTypes.number,           // size of pixels for display animation
    colors: PropTypes.array           // array of palette colors
  };

  static defaultProps = {
    width: 12,
    height: 12,
    size: 5
  };

  constructor(props) {
    super(props);
    const { width, height } = props;

    /*
      define how many cells required for the display
      and create a blank array with every cell set
      to transparent.
    */

    const cellLength = width * height;
    let blankArray = [];
    for (let i = 0; i < cellLength; i++) {
      blankArray.push({
        color: 'transparent'
      });
    }

    /*
      Set state with current values and configurations 
      for the application.
    */

    this.state = {
      /*
        4 arrays are used in this program
        Blank/Temp/Canvas Arrays = one single frame width x height;
        Frames is an array of canvasArray's that when cycled though
        display the animation.

        [blankArray]      Template for a new frame.
        [tempArray]       State for copy / paste functions.
        [canvasArray]       Current array displayed on the canvas.
        [frames]          All arrays in the animation.
      */
      blankArray,
      tempArray: blankArray,
      canvasArray: props.canvasArray || this.clone(blankArray),
      /*
        Check length to check for existing frames, 
        if not check props or 
        just set it to one blank frame.
      */
      frames: frames.length > 0 ? frames : props.frames || [props.canvasArray || blankArray],
      currentFrame: 0,
      isPlaying: true,
      width: props.width,
      height: props.height,
      size: props.size,
      speed: 100,
      counter: 0,
      currentColor: ColorPallet[5],
      colors: ColorPallet
    };
  }

  componentDidMount() {
    /*
      Start counter for animation, 
      add eventListender and 
      load the first frame.
    */
    this.countdown = setInterval(this.timer, this.state.speed);
    document.addEventListener('keydown', (event) => {
      this.checkKey(event);
    });
    this.loadFrame(0);
  }

  componentWillUnmount() {
    clearInterval(this.countdown);
  }
  
  timer = () => {
    const { frames, counter } = this.state;
    const ct = counter + 1;
    this.setState({ counter: ct > frames.length - 1 ? 0 : ct });
  };

  /*
    Function for a deep clone arrays.
  */

  clone = (array) =>{
    return JSON.parse(JSON.stringify(array));
  };

  /*
    Check key events for functionality.
  */

  checkKey = (event) => {
    const { currentFrame } = this.state;

    const code = event.keyCode;
    const metaKey = event.metaKey;
    // TODO functionality - CTRL/ALT keys
    // const altKey = event.altKey;
    // const ctrlKey = event.ctrlKey;

    switch(code) {
    case 83:
      this.saveFrame(currentFrame);
      break;
    case 67:
      if ( metaKey ) this.copyFrame(currentFrame);
      break;
    case 86:
      if ( metaKey ) this.pasteFrame(currentFrame);
      break;
    case 78:
      this.newFrame();
      break;
    case 8:
      this.deleteFrame(currentFrame);
      break;
    case 38:
      this.shiftFrame('up');
      break;
    case 40:
      this.shiftFrame('down');
      break;
    case 39:
      this.shiftFrame('right');
      break;
    case 37:
      this.shiftFrame('left');
      break;
    default:
    }
  };

  /*
    Reset grid and all arrays
  */

  resetGrid = (width = this.state.width, height = this.state.height) => {
    const cellLength = width * height;
    let blankArray = [];
    for (let i = 0; i < cellLength; i++) {
      blankArray.push({
        color: 'transparent'
      });
    }
    this.setState({
      width,
      height,
      blankArray,
      canvasArray: blankArray,
      frames: []
    });
  };

  /*
    Return a given id based on x / y.
  */

  matrixExpand = (x, y) => {
    const { height } = this.state;
    return x + (height * y);
  };

  loadFrame = (index) => {
    const { frames } = this.state;
    const tempArray = this.clone(frames[index]);
    this.setState({
      canvasArray: tempArray,
      currentFrame: index
    });
  };

  newFrame = () => {
    const { width, height, frames} = this.state;
    let cleanArray = [];
    let tempFrames = frames;

    const cellLength = width * height;
    for (let i = 0; i < cellLength; i++) {
      cleanArray.push({
        color: 'transparent'
      });
    }

    tempFrames.push(this.clone(cleanArray));
    const currentFrame = tempFrames.length - 1;
    this.setState({
      canvasArray: this.clone(cleanArray),
      frames: tempFrames,
      currentFrame
    });
  };

  copyFrame = (index) => {
    const { canvasArray } = this.state;
    const tempArray = this.clone(canvasArray);
    this.setState({
      tempArray
    });
  };

  pasteFrame = (index) => {
    const { frames, tempArray } = this.state;
    let tempFrames = frames;

    tempFrames[index] = this.clone(tempArray);

    this.setState({
      canvasArray: this.clone(tempArray),
      frames: tempFrames
    });
  };

  saveFrame = (index) => {
    const { frames, canvasArray } = this.state;
    let tempFrames = frames;

    tempFrames[index] = this.clone(canvasArray);

    this.setState({
      frames: tempFrames
    });
  };

  deleteFrame = (index) => {
    const endFrame = this.state.currentFrame - 1;
    const tempFrames = this.clone(this.state.frames);
    const tempArray = this.clone(tempFrames[endFrame]);

    tempFrames.splice(index, 1);
    this.setState({
      canvasArray: tempArray,
      frames: tempFrames,
      currentFrame: endFrame
    });
  };

  exportFrames = () => {
    const { width, height } = this.state;
    const frames = this.clone(this.state.frames);

    let dataSet = frames.map((frame)=>{
      return frame.map((still, index)=>{
        const x = index % width;
        const y = (index - x) / height;
        return {
          x,
          y,
          color: still.color
        };
      });
    });

    window.open().document.write(JSON.stringify(dataSet));
  };

  rotate = () => {
    const { width, height, canvasArray } = this.state;
    if (width != height) {
      console.log('only works with even sizes');
      return;
    }
    const h = height - 1;
    const matrix = this.clone(canvasArray);
    let k;
    for (let i = 0; i < width; i++) {
      for (let j = i; j < h - i; j++) {
        k = matrix[this.matrixExpand(i, j)];
        matrix[this.matrixExpand(i, j)] = matrix[this.matrixExpand(h - j, i)];
        matrix[this.matrixExpand(h - j, i)] = matrix[this.matrixExpand(h - i, h - j)];
        matrix[this.matrixExpand(h - i, h - j)] = matrix[this.matrixExpand(j, h - i)];
        matrix[this.matrixExpand(j, h - i)] = k;
      }
    }
    this.setState({
      canvasArray: matrix
    });
  };

  shiftFrame = (direction) => {
    const { height, canvasArray, width, frames, currentFrame } = this.state;
    const h = height - 1;
    const w = width - 1;
    const matrix = this.clone(canvasArray);
    const source = this.clone(matrix);

    for (let i = 0; i < matrix.length; i++ ) {
      const x = i % width;
      const y = (i - x) / height;
      let move;
      let head;
      switch(direction) {
      case 'up':
        move = (y + 1);
        head = move > h ? height - move : move;
        matrix[this.matrixExpand(x, y)] = source[this.matrixExpand(x, head)];
        break; 
      case 'down':
        move = (y - 1);
        head = move < 0 ? (move) + height : move;
        matrix[this.matrixExpand(x, y)] = source[this.matrixExpand(x, head)];
        break; 
      case 'left':
        move = (x + 1);
        head = move > w ? width - move : move;
        matrix[this.matrixExpand(x, y)] = source[this.matrixExpand(head, y)];
        break; 
      case 'right':
        move = (x - 1);
        head = move < 0 ? (move) + width : move;
        matrix[this.matrixExpand(x, y)] = source[this.matrixExpand(head, y)];
        break; 
      default:
      }

    }

    let tempFrames = frames;
    tempFrames[currentFrame] = matrix;

    this.setState({
      canvasArray: matrix,
      frames: tempFrames
    });
  };

  setCurrentColor = (color) => {
    this.setState({
      currentColor: color
    });
  };

  setCellColor = (index) => {
    const { canvasArray } = this.state;
    let tempArray = [...canvasArray];
    if (tempArray[index].color !== this.state.currentColor) { 
      tempArray[index].color = this.state.currentColor;
    } else {
      tempArray[index].color = 'transparent';
    }
    this.setState({
      canvasArray: tempArray
    });
  };

  getPalette = () => {
    const { colors, currentColor } = this.state;
    const colorpalette = colors.map((color, index) => {
      const classString = 
      `${ClassStyles.box} ${ClassStyles.plt} ` + 
      `${color == currentColor ? ClassStyles.active : null} ` +
      `${color == 'transparent' ? ClassStyles.transparent : null} `;
      return (
        <a
          role="button"
          tabIndex="0"
          href="#"
          key={`colorCode_${color}`}
          className={classString}
          style={{ background: color }}
          onClick={() => this.setCurrentColor(color)}
        >x</a>
      );
    });
    return (
      <div className={`${ClassStyles.palette}`}>
        <h5>Color Palette</h5>
        {colorpalette}
      </div>
    );
  };

  generateFrame = (data, size) => {
    const { width, height } = this.state;
    let pixelRow = [];
    const pixelSet = data.map((cell, index) => {
      const x = index % width;
      const y = (index - x) / height;
      let object;
      object = (
        <a
          key={`index${index}`}
          role="button"
          tabIndex="0"
          className={ClassStyles.box}
          style={{ background: cell.color }}
          onClick={() => {this.setCellColor(index);}}
        >&nbsp;</a>
      );

      pixelRow.push(object);

      if (x === width - 1) {
        const rowStyle = size > 0 ? `${size}px` : 'auto';
        const row = (
          <div className={size > 0 ?
            ClassStyles.pixelrow : ClassStyles.row} style={{ height: rowStyle }} key={`row${y}`}>
            {pixelRow}
          </div>
        );
        pixelRow = [];
        return row;
      }
    });
    return pixelSet;
  };

  generateCSSFrame = (data, size) => {
    if (data === undefined) return;

    const { width, height } = this.state;
    let cssString = '';

    const pixelSet = data.map((cell, index) => {
      if (cell.color !== 'transparent') {
        const x = index % width;
        const y = (index - x) / height;
        if(index > 0 && cssString !== '') cssString += ',';
        cssString += `${~~(size * (x + 1))}px ${~~(size * (y + 1))}px 0 ${cell.color}`;
      }

    });
    const inlineStyle = {
      width: size,
      height: size,
      // margin: `-${size}px ${size}px ${size}px -${size}px`,
      background: 'transparent',
      boxShadow: cssString

    };
    const containerStyle = {
      margin: `-${size}px 0 0 -${size}px`,
      boxSizing: 'border-box',
      width: (size * width) + 3,
      height: (size  * height) + 3
    };
    return (
      <div style={ containerStyle }> 
        <div style={ inlineStyle }> </div>
      </div>
    );
  };
  
  getControls = () => {
    const { currentFrame } = this.state;
    return(
      <ul className={ClassStyles.controls}> 
        <li>
          <a className={ClassStyles.links}
            href="#" 
            role="button"
            onClick={this.newFrame}
          >new</a>
        </li>
        <li>
          <a className={ClassStyles.links}
            href="#" 
            role="button"
            onClick={()=>this.saveFrame(currentFrame)}
          >save</a>
        </li>
        <li>
          <a className={ClassStyles.links}
            href="#" 
            role="button"
            onClick={()=>this.deleteFrame(currentFrame)}
          >delete</a>
        </li>
        <li>
          <a className={ClassStyles.links}
            href="#" 
            role="button"
            onClick={()=>this.copyFrame(currentFrame)}
          >copy</a>
        </li>
        <li>
          <a className={ClassStyles.links}
            href="#" 
            role="button"
            onClick={()=>this.pasteFrame(currentFrame)}
          >paste</a>
        </li>
        <li>
          <a className={ClassStyles.links}
            href="#" 
            role="button"
            onClick={()=>this.exportFrames()}
          >export</a>
        </li>
        <li>
          <a className={ClassStyles.links}
            href="#" 
            role="button"
            onClick={this.rotate}
          >rotate</a>
        </li>
      </ul> 
    );
  };

  render() {
    const { width, height, canvasArray, frames, size, currentFrame, counter, isPlaying } = this.state;
    const index = isPlaying ? counter : currentFrame;
    const canvasStyle = {width: `${34 * width}px`, height: `${34 * height}px`};
    return (
      <div className={ClassStyles.appcontainer}>
        {this.getControls()}
        <div className={ClassStyles.container}>
          {this.getPalette()}
          <div className={ClassStyles.canvas} style={canvasStyle}>
            <h5>Sprite Canvas</h5>
            {this.generateFrame(canvasArray, 'x')}
          </div>
          <Animation
            generatePacket={() => {}}
            frames={ frames }
            index={ index }
            generateFrame={ this.generateCSSFrame }
            size={size}
          />
        </div>
        <Frames
          frames={ frames } 
          currentFrame={ currentFrame }
          generateFrame={ this.generateCSSFrame }
          loadFrame={ this.loadFrame }
          deleteFrame={ this.deleteFrame }
        />
      </div>
    );
  }
}

export default App;

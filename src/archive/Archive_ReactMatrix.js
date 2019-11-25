import React, { Component } from 'react';
import PropTypes from 'prop-types';
import dat from 'dat.gui';

import Frames from '../containers/Frames';
import Animation from '../containers/Animation';
import ClassStyles from '../styles/styles.less';
import ColorPallet from '../containers/Colors';

// uncomment to see premade animation
// import frames from '../animations/Bird';

/* eslint no-console:0 */
class App extends Component {
  static displayName = 'App';
  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    size: PropTypes.number,
    colors: PropTypes.array
  };
  static defaultProps = {
    width: 12,
    height: 12,
    size: 8
  };
  constructor(props) {
    super(props);
    const { width, height } = props;
    const cellLength = width * height;
    let blankArray = [];
    for (let i = 0; i < cellLength; i++) {
      blankArray.push({
        color: 'transparent'
      });
    }

    this.state = {
      blankArray,
      tempArray: blankArray,
      dataArray: props.dataArray || this.clone(blankArray),
      frames: frames.length > 0 ? frames : props.frames || [props.dataArray || blankArray],
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
    this.countdown = setInterval(this.timer, this.state.speed);
    document.addEventListener('keydown', (event) => {
      this.checkKey(event);
    });
    this.createGui();
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
  
  clone = (array) =>{
    return JSON.parse(JSON.stringify(array));
  };

  createGui = () => {
    const { isPlaying, speed, size } = this.state;
    const options = {
      speed: speed,
      size: size,
      isPlaying: isPlaying
    };

    this.gui = new dat.GUI();

    const folderRender = this.gui.addFolder('Animation Options');
    folderRender.add(options, 'speed', 1, 500).step(1)
      .onFinishChange((value) => { 
        clearInterval(this.countdown);
        this.countdown = setInterval(this.timer, value);
        this.setState({
          speed: value
        });
      });
    folderRender.add(options, 'size', 1, 14).step(1)
      .onFinishChange((value) => { 
        this.setState({
          size: value
        });
      });
    folderRender.add(options, 'isPlaying')
      .onChange((value) => {
        this.setState({
          isPlaying: value
        });
      });
  }

  checkKey = (event) => {
    const { currentFrame } = this.state;

    const code = event.keyCode;
    const metaKey = event.metaKey;
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
      dataArray: blankArray,
      frames: []
    });
  };

  matrixExpand = (x, y) => {
    const { height } = this.state;
    return x + (height * y);
  };

  loadFrame = (index) => {
    const { frames } = this.state;
    const tempArray = this.clone(frames[index]);
    this.setState({
      dataArray: tempArray,
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
      dataArray: this.clone(cleanArray),
      frames: tempFrames,
      currentFrame
    });
  };

  copyFrame = (index) => {
    const { dataArray } = this.state;
    const tempArray = this.clone(dataArray);
    this.setState({
      tempArray
    });
  };

  pasteFrame = (index) => {
    const { frames, tempArray } = this.state;
    let tempFrames = frames;

    tempFrames[index] = this.clone(tempArray);

    this.setState({
      dataArray: this.clone(tempArray),
      frames: tempFrames
    });
  };

  saveFrame = (index) => {
    const { frames, dataArray } = this.state;
    let tempFrames = frames;

    tempFrames[index] = this.clone(dataArray);

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
      dataArray: tempArray,
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
    const { width, height, dataArray } = this.state;
    if (width != height) {
      console.log('only works with even sizes');
      return;
    }
    const h = height - 1;
    const matrix = this.clone(dataArray);
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
      dataArray: matrix
    });
  };

  shiftFrame = (direction) => {
    const { height, dataArray, width, frames, currentFrame } = this.state;
    const h = height - 1;
    const w = width - 1;
    const matrix = this.clone(dataArray);
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
      dataArray: matrix,
      frames: tempFrames
    });
  };

  setCurrentColor = (color) => {
    this.setState({
      currentColor: color
    });
  };

  setCellColor = (index) => {
    const { dataArray } = this.state;
    let tempArray = [...dataArray];
    if (tempArray[index].color !== this.state.currentColor) {
      tempArray[index].color = this.state.currentColor;
    } else {
      tempArray[index].color = 'transparent';
    }
    this.setState({
      dataArray: tempArray
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
    const { width, height, dataArray, frames, size, currentFrame, counter, isPlaying } = this.state;
    const index = isPlaying ? counter : currentFrame;
    const canvasStyle = {width: `${34 * width}px`, height: `${34 * height}px`};
    return (
      <div className={ClassStyles.appcontainer}>
        {this.getControls()}
        <div className={ClassStyles.container}>
          {this.getPalette()}
          <div className={ClassStyles.canvas} style={canvasStyle}>
            {this.generateFrame(dataArray, 'x')}
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

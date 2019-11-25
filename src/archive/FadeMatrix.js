import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Frames from '../containers/Frames';
import Animation from '../containers/Animation';
import ClassStyles from '../styles/styles.less';
import dat from 'dat.gui';

import ColorPallet from '../containers/Colors';

import frames from '../animations/Bird_p';
// import frames from '../animations/RunningMan';
// import frames from '../animations/CircleDemo';

/* eslint no-console:0 */
class App extends Component {
  static displayName = 'App';
  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    colors: PropTypes.array
  };
  static defaultProps = {
    width: 8,
    height: 8
  };
  constructor(props) {
    super(props);
    const { width, height } = props;
    const cellLength = width * height;
    let blankArray = [];
    for (let i = 0; i < cellLength; i++) {
      blankArray.push({
        color: 0
      });
    }
    this.socket = new WebSocket('ws://localhost:7890');
    this.socket.onclose = (event) => console.log('-> Not connected to fcserver');
    this.socket.onopen = (event) => console.log('-> Connected to fcserver');
    this.state = {
      blankArray,
      tempArray: blankArray,
      dataArray: props.dataArray || this.clone(blankArray),
      frames: frames.length > 0 ? frames : props.frames || [props.dataArray || blankArray],
      currentFrame: 0,
      isPlaying: true,
      ledOn: true,
      width: props.width,
      height: props.height,
      size: 8,
      speed: 100,
      counter: 0,
      currentColor: 5,
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
    const { isPlaying, speed, size, ledOn } = this.state;
    const options = {
      speed: speed,
      size: size,
      isPlaying: isPlaying,
      ledOn: ledOn
    };
    this.gui = new dat.GUI();

    const folderRender = this.gui.addFolder('Render Options');
    folderRender.add(options, 'speed', 1, 500).step(1)
      .onFinishChange((value) => { 
        clearInterval(this.countdown);
        this.countdown = setInterval(this.timer, value);
        this.setState({
          speed: value
        });
      });
    folderRender.add(options, 'size', 1, 25).step(1)
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
    folderRender.add(options, 'ledOn')
      .onChange((value) => {
        if(!value) {

        }
        this.setState({
          ledOn: value
        });
      });
  }

  checkKey = (event) => {
    const { currentFrame } = this.state;

    const code = event.keyCode;
    // const altKey = event.altKey;
    // const ctrlKey = event.ctrlKey;
    const metaKey = event.metaKey;

    console.log(code);

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
      if ( metaKey ) this.newFrame();
      break;
    case 8:
      if ( metaKey ) this.deleteFrame(currentFrame);
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
        color: 0
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
        color: 0
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
      currentFrame: endFrame > 0 ? endFrame : 1
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
    console.log(currentFrame);
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
      tempArray[index].color = 0;
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
      `${color == 0 ? ClassStyles.transparent : null} `;
      return (
        <a
          role="button"
          tabIndex="0"
          href="#"
          key={`colorCode_${color}`}
          className={classString}
          style={{ background: color }}
          onClick={() => this.setCurrentColor(index)}
        >x</a>
      );
    });
    return <div className={`${ClassStyles.palette}`}>{colorpalette}</div>;
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

  hexToRgb = (hex) => {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
      return r + r + g + g + b + b;
    });

    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };

  };

  generatePacket = (data) => {
    if (!this.state.ledOn) return;
    if (!data) return;
    const { width, height } = this.state;
    let pixelRow = [];
    let packet = new Uint8ClampedArray(4 + 512 * 3);
    if (this.socket.readyState != 1 /* OPEN */ ||
      this.socket.bufferedAmount > packet.length) {
      return;
    }
    let packet_position = 4;
    const pixelSet = data.map((cell, index) => {
      const x = index % width;
      const y = (index - x) / height;
      if(cell.color === 0) {
        packet[packet_position++] = 0;
        packet[packet_position++] = 0;
        packet[packet_position++] = 0;
      } else {
        const color = this.hexToRgb(ColorPallet[cell.color]);
        packet[packet_position++] = color.r;
        packet[packet_position++] = color.g;
        packet[packet_position++] = color.b;

      }
    });
    this.socket.send(packet.buffer);
  };

  generateCSSFrame = (data, size) => {
    if (data === undefined) return;

    const { width, height } = this.state;
    let cssString = '';

    const pixelSet = data.map((cell, index) => {
      if (cell.color !== 0) {
        const x = index % width;
        const y = (index - x) / height;
        const cssColor = ColorPallet[cell.color];
        if(index > 0 && cssString !== '') cssString += ',';
        cssString += `${size * (x + 1)}px ${size * (y + 1)}px 0 ${cssColor}`;
      }

    });

    const inlineStyle = {
      width: size,
      height: size,
      margin: `-${size}px ${size}px ${size}px -${size}px`,
      background: 'transparent',
      boxShadow: cssString

    };

    const containerStyle = {
      width: size * width,
      height: size * height
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
      <ul className={ClassStyles.minimap}> 
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
    const { dataArray, frames, size, currentFrame, counter, isPlaying } = this.state;
    const index = isPlaying ? counter : currentFrame;
    const palette = this.getPalette();
    return (
      <div className={ClassStyles.appcontainer}>
        <div className={ClassStyles.case}>
          <Animation
            frames={ frames }
            index={ index }
            isPlaying={ isPlaying }
            generateFrame={ this.generateCSSFrame }
            generatePacket={ this.generatePacket }
            size={size}
          />
          {this.getControls()}
          <div className={ClassStyles.container}>
            {this.generateFrame(dataArray, 'x')}
            {palette}
          </div>
          <Frames
            frames={ frames } 
            currentFrame={ currentFrame }
            generateFrame={ this.generateCSSFrame }
            loadFrame={ this.loadFrame }
            deleteFrame={ this.deleteFrame }
          />
        </div>
      </div>
    );
  }
}

export default App;

import React, { createContext, useReducer } from "react";
import { ColorList } from "./components/ColorPalette";

/* Import Animation to Build */

import frames from "./animations/RunningMan";

/* simple deep clone function */
export const clone = array => {
  return JSON.parse(JSON.stringify(array));
};

/**
 * Set up Store with Config for Animation
 * Pixel grid width / height and blank array
 */
const width = 16;
const height = 16;
const cellLength = width * height;
const blankArray = [];
for (let i = 0; i < cellLength; i++) {
  blankArray.push({
    color: ColorList[0]
  });
}

const matrixExpand = (x, y) => {
  return x + height * y;
};

/* if frames are imported load into state else load blank array */
const f = frames.length > 0 ? clone(frames) : [clone(blankArray)];
const initialState = {
  frames: f,
  width,
  height,
  currentFrame: 0,
  currentColor: ColorList[1],
  canvasArray: f[0],
  copyArray: clone(blankArray),
  blankArray
};

export const Store = createContext(initialState);

const exportFrames = (state) => {
  const { height, width, frames } = state;
  const expportFrames = clone(frames);
  console.log('generating frames');
  let dataSet = expportFrames.map((frame) => {
    return frame.map((still, index) => {
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
  return { ...state };
};

const updateCurrent = (state, index) => {
  const { frames } = state;
  const config = {
    currentFrame: index,
    canvasArray: clone(frames[index])
  };
  return { ...state, ...config };
};

const updateColor = (state, color) => {
  return { ...state, currentColor: color };
};

const updatePixel = (state, index) => {
  const { canvasArray, currentColor } = state;
  let tempArray = clone(canvasArray);

  if (tempArray[index].color !== currentColor) {
    tempArray[index].color = currentColor;
  } else {
    tempArray[index].color = "transparent";
  }

  return { ...state, canvasArray: tempArray };
};

const newFrame = state => {
  const config = {
    frames: [clone(blankArray)],
    canvasArray: clone(blankArray),
    currentFrame: 0
  };
  return { ...state, ...config };
};

const addFrame = state => {
  const { frames, blankArray, currentFrame } = state;
  const newFrames = clone(frames);
  newFrames.splice(currentFrame + 1, 0, clone(blankArray));
  const config = {
    frames: newFrames,
    canvasArray: clone(blankArray),
    currentFrame: currentFrame + 1
  };
  return { ...state, ...config };
};

const saveFrame = state => {
  const { frames, currentFrame, canvasArray } = state;
  const saveFrames = clone(frames);
  saveFrames[currentFrame] = clone(canvasArray);
  return { ...state, frames: saveFrames };
};

const deleteFrame = state => {
  const { frames, currentFrame } = state;
  if (currentFrame === 0 && frames.length < 2) return state;
  const saveFrames = clone(frames);
  saveFrames.splice(currentFrame, 1);
  const newFrame = currentFrame > 0 ? currentFrame - 1 : 0;
  const newArray = frames[newFrame];
  return {
    ...state,
    frames: saveFrames,
    currentFrame: newFrame,
    canvasArray: newArray
  };
};

const copyFrame = state => {
  const { canvasArray } = state;
  const tempArray = clone(canvasArray);
  return { ...state, copyArray: tempArray };
};

const pasteFrame = state => {
  const { frames, currentFrame, copyArray } = state;
  const tempCopy = clone(copyArray);
  const tempFrames = clone(frames);
  tempFrames[currentFrame] = tempCopy;
  return { ...state, frames: tempFrames, canvasArray: tempCopy };
};

const shiftFrame = (state, direction) => {
  const { height, width, canvasArray, frames, currentFrame } = state;
  const h = height - 1;
  const w = width - 1;
  const matrix = clone(canvasArray);
  const source = clone(canvasArray);

  for (let i = 0; i < matrix.length; i++) {
    const x = i % width;
    const y = (i - x) / height;
    let move = 0;
    let head = 0;
    switch (direction) {
      case "up":
        move = y + 1;
        head = move > h ? height - move : move;
        matrix[matrixExpand(x, y)] = source[matrixExpand(x, head)];
        break;
      case "down":
        move = y - 1;
        head = move < 0 ? move + height : move;
        matrix[matrixExpand(x, y)] = source[matrixExpand(x, head)];
        break;
      case "left":
        move = x + 1;
        head = move > w ? width - move : move;
        matrix[matrixExpand(x, y)] = source[matrixExpand(head, y)];
        break;
      case "right":
        move = x - 1;
        head = move < 0 ? move + width : move;
        matrix[matrixExpand(x, y)] = source[matrixExpand(head, y)];
        break;
      default:
    }
  }

  let tempFrames = frames;
  tempFrames[currentFrame] = matrix;
  return {
    ...state,
    frames: tempFrames,
    canvasArray: matrix
  };
};
/**
 * Mocking Context to work like Redux
 */

const reducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_CURRENT":
      return updateCurrent(state, action.index);
    case "UPDATE_COLOR":
      return updateColor(state, action.color);
    case "UPDATE_PIXEL":
      return updatePixel(state, action.index);
    case "SHIFT_FRAME":
      return shiftFrame(state, action.direction);
    case "SAVE_FRAME":
      return saveFrame(state);
    case "NEW_FRAME":
      return newFrame(state);
    case "ADD_FRAME":
      return addFrame(state);
    case "DELETE_FRAME":
      return deleteFrame(state);
    case "COPY_FRAME":
      return copyFrame(state);
    case "PASTE_FRAME":
      return pasteFrame(state);
    case "EXPORT_FRAMES":
      return exportFrames(state);
    default:
      return state;
  }
};

export const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <Store.Provider value={{ state, dispatch }}>{children}</Store.Provider>
  );
};

export const updateCurrent = (value, dispatch) => {
  dispatch({
    type: "UPDATE_CURRENT",
    index: value
  });
};

export const updateColor = (value, dispatch) => {
  dispatch({
    type: "UPDATE_COLOR",
    color: value
  });
};

export const updatePixel = (value, dispatch) => {
  dispatch({
    type: "UPDATE_PIXEL",
    index: value
  });
};

export const shiftFrame = (value, dispatch) => {
  dispatch({
    type: "SHIFT_FRAME",
    direction: value
  });
};

export const saveFrame = dispatch => {
  dispatch({
    type: "SAVE_FRAME"
  });
};

export const addFrame = dispatch => {
  dispatch({
    type: "ADD_FRAME"
  });
};

export const newFrame = dispatch => {
  dispatch({
    type: "NEW_FRAME"
  });
};

export const copyFrame = dispatch => {
  dispatch({
    type: "COPY_FRAME"
  });
};

export const deleteFrame = dispatch => {
  dispatch({
    type: "DELETE_FRAME"
  });
};

export const exportFrames = dispatch => {
  dispatch({
    type: "EXPORT_FRAMES"
  });
};


export const pasteFrame = dispatch => {
  dispatch({
    type: "PASTE_FRAME"
  });
};

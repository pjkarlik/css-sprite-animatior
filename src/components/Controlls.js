import React, { useContext, useEffect } from "react";
import { Store } from "../Store";
import {
  addFrame,
  saveFrame,
  newFrame,
  copyFrame,
  pasteFrame,
  deleteFrame,
  shiftFrame,
  exportFrames
} from "../Actions";
import ClassStyles from "../styles/styles.less";

const Controlls = () => {
  const { dispatch } = useContext(Store);
  useEffect(() => {
    document.addEventListener("keyup", event => {
      checkKey(event);
    });
  }, []);

  const checkKey = event => {
    const code = event.keyCode;
    const metaKey = event.metaKey;
    // TODO functionality - CTRL/ALT keys
    // const altKey = event.altKey;
    // const ctrlKey = event.ctrlKey;

    switch (code) {
      case 83:
        saveFrame(dispatch);
        break;
      case 67:
        copyFrame(dispatch);
        break;
      case 86:
        pasteFrame(dispatch);
        break;
      case 78:
        newFrame(dispatch);
        break;
      case 8:
        deleteFrame(dispatch);
        break;
      case 38:
        shiftFrame("up", dispatch);
        break;
      case 40:
        shiftFrame("down", dispatch);
        break;
      case 39:
        shiftFrame("right", dispatch);
        break;
      case 37:
        shiftFrame("left", dispatch);
        break;
      default:
    }
  };
  /**
   * Need to clean up but for now basic ui
   * more features to come, maybe subnavs
   */
  return (
    <ul className={ClassStyles.controls}>
      <li>
        <a
          className={ClassStyles.links}
          href="#"
          role="button"
          onClick={() => {
            newFrame(dispatch);
          }}
        >
          new
        </a>
      </li>
      <li>
        <a
          className={ClassStyles.links}
          href="#"
          role="button"
          onClick={() => {
            addFrame(dispatch);
          }}
        >
          add
        </a>
      </li>
      <li>
        <a
          className={ClassStyles.links}
          href="#"
          role="button"
          onClick={() => {
            saveFrame(dispatch);
          }}
        >
          save
        </a>
      </li>
      <li>
        <a
          className={ClassStyles.links}
          href="#"
          role="button"
          onClick={() => {
            deleteFrame(dispatch);
          }}
        >
          delete
        </a>
      </li>
      <li>
        <a
          className={ClassStyles.links}
          href="#"
          role="button"
          onClick={() => {
            copyFrame(dispatch);
          }}
        >
          copy
        </a>
      </li>
      <li>
        <a
          className={ClassStyles.links}
          href="#"
          role="button"
          onClick={() => {
            pasteFrame(dispatch);
          }}
        >
          paste
        </a>
      </li>
      <li>
        <a
          className={ClassStyles.links}
          href="#"
          role="button"
          onClick={(e) => {
            e.preventDefault();
            exportFrames(dispatch);
          }}
        >
          export
        </a>
      </li>
    </ul>
  );
};

export default Controlls;

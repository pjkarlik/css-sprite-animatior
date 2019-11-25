import React, { useContext } from "react";
import { Store } from "../Store";
import { updateColor } from "../Actions";
import ClassStyles from "../styles/styles.less";

export const ColorList = [
  "transparent",
  "#FFFFFF",
  "#E7C09D",
  "#8B5C33",
  "#5E2C00",
  "#FD7FFF",
  "#EF0033",
  "#FF6633",
  "#FFB500",
  "#EEFF00",
  "#99EE00",
  "#33CC00",
  "#00CFFC",
  "#006FCF",
  "#001FDE",
  "#4F00DF",
  "#A900DA",
  "#000000",
  "#222222",
  "#666666",
  "#AAAAAA"
];

const ColorPalette = props => {
  const { state, dispatch } = useContext(Store);
  const { currentColor } = state;

  const colorpalette = ColorList.map(color => {
    const classString =
      `${ClassStyles.box} ${ClassStyles.plt} ` +
      `${color == currentColor ? ClassStyles.active : null} ` +
      `${color == "transparent" ? ClassStyles.transparent : null} `;
    return (
      <a
        role="button"
        tabIndex="0"
        href="#"
        key={`colorCode_${color}`}
        className={classString}
        style={{ background: color }}
        onClick={() => {
          updateColor(color, dispatch);
        }}
      >{`${color}`}</a>
    );
  });

  return <div className={ClassStyles.palette}>{colorpalette}</div>;
};

export default ColorPalette;

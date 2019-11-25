![travis ci build](https://travis-ci.org/pjkarlik/react-matrix.svg?branch=master&style=flat-square)

![splash](./splash.gif)

![react](https://img.shields.io/badge/react-16.4.1-green.svg?style=flat-square)
![webpack](https://img.shields.io/badge/webpack-4.10.2-51b1c5.svg?style=flat-square)
![stage-0](https://img.shields.io/badge/ECMAScript-6-c55197.svg?style=flat-square)

# CSS Sprite Animator

CSS `box-shadow` pixel animation editor using React. Using state to edit, design and create pixel animations. I created this tool to model animations for Arduino/LED matrix displays. Props allow you to change dimentions, pixel size and palettes.

Each frame is saves as an 1D array, with each pixel in a continous _(x/y/color)_ object. That data is then turned into an inline CSS style which is applied to a DIV or other DOM element.

_example of a frame of animation_

```css
inlineStyle = {
  box-shadow: #e7c09d 40px 8px 0px, #e7c09d 48px 8px 0px, #e7c09d 40px 16px 0px,
    #e7c09d 48px 16px 0px, #e7c09d 32px 24px 0px, #e7c09d 40px 24px 0px,
    #ee0033 32px 32px 0px, #ee0033 40px 32px 0px, #ee0033 32px 40px 0px, #ee0033
      40px 40px 0px, #0033ff 32px 48px 0px, #0033ff 40px 48px 0px,
    #999999 24px 56px 0px, #0033ff 32px 56px 0px, #0033ff 40px 56px 0px, #0033ff
      32px 64px 0px, #999999 40px 64px 0px;
  background: transparent;
  margin: -8px 8px 8px -8px;
  width: 8px;
  height: 8px;
}
```

## Use

Click anywhere on the grid to add a color, click again to erase or use a new color. Save takes the current dataArray to a single fame. You can also add a new frame and continue. The animation will start to play as soon as a second frame is created.

##### Keyboard Shortcuts

- [arrow keys] position on grid
- [n]ew frame
- [s]ave frame
- [backspace] delete frame
- [os + c]opy frame
- [os + v] paste frame

## Features

- Save, Copy, Detele, Paste frames to create timeline animation.
- Generates box-shadow CSS and animates them using an array.
- React/CSS based, easily modify grid, display and component size.

## Run the example

Requires Node v10.15.3 or greater.

```bash
$ yarn
$ yarn start
```

open http://localhost:2020

### Set-up of Application

The set up is pretty simple, index.js loads ReactMatrix.js in Components.

`src/index.js --> components/ReactMatrix.js`

I tried to break out the UI from the main framework to make it easier to play with the UX of and editor like this. Future plans include saving to db and export to gif.

More to come as this is a work in progress.

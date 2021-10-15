import { SCREEN_HEIGHT, SCREEN_WIDTH, doc } from "./screen";

import { math } from "./math";

export let inputContext = {
  _cursor: [0, 0],
  _mouseDown: false,
  _dragging: false,
  _hot: 0,
  _active: 0,
  _fire: 0,
  _isTouch: false
};

export let clearInput = (): void =>
{
  inputContext._hot = 0;
  inputContext._active = 0;
  inputContext._mouseDown = false;
};

let canvasRef: HTMLCanvasElement;

let isTouch = (e: Event | PointerEvent | TouchEvent): e is TouchEvent =>
{
  return (e.type[0] === `t`);
};

let pointerMove = (e: PointerEvent | TouchEvent) =>
{
  let canvasBounds = canvasRef.getBoundingClientRect();
  let x: number, y: number;
  inputContext._isTouch = isTouch(e);
  if (isTouch(e))
  {
    e.preventDefault();
    let touch: Touch = e.touches[0];
    x = math.floor((touch.clientX - canvasBounds.left) / (canvasBounds.width / SCREEN_WIDTH));
    y = math.floor((touch.clientY - canvasBounds.top) / (canvasBounds.height / SCREEN_HEIGHT));
    return;
  }
  e = e as PointerEvent;
  x = math.floor((e.clientX - canvasBounds.left) / (canvasBounds.width / SCREEN_WIDTH));
  y = math.floor((e.clientY - canvasBounds.top) / (canvasBounds.height / SCREEN_HEIGHT));
  moveCursor(x, y);
};

let pointerDown = (e: PointerEvent | TouchEvent) =>
{
  inputContext._isTouch = isTouch(e);
  if (isTouch(e))
  {
    let canvasBounds = canvasRef.getBoundingClientRect();
    e.preventDefault();
    let touch: Touch = e.touches[0];
    const x = math.floor((touch.clientX - canvasBounds.left) / (canvasBounds.width / SCREEN_WIDTH));
    const y = math.floor((touch.clientY - canvasBounds.top) / (canvasBounds.height / SCREEN_HEIGHT));
    moveCursor(x, y);
  }

  inputContext._mouseDown = true;
};

export let moveCursor = (x: number, y: number): void =>
{
  inputContext._cursor[0] = x;
  inputContext._cursor[1] = y;
};

let pointerUp = (e: PointerEvent | TouchEvent) =>
{
  inputContext._mouseDown = false;
};

export let initializeInput = (canvas: HTMLCanvasElement) =>
{
  canvasRef = canvas;

  doc.addEventListener(`pointermove`, pointerMove);
  doc.addEventListener(`touchmove`, pointerMove);

  canvas.addEventListener(`pointerdown`, pointerDown);
  canvas.addEventListener(`touchstart`, pointerDown);

  canvas.addEventListener(`pointerup`, pointerUp);
  canvas.addEventListener(`touchend`, pointerUp);
};
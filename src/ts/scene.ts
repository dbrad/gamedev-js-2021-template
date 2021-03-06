import { Interpolators, createInterpolationData } from "./interpolate";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "./screen";
import { colourToHex, hexToColour } from "./colour";
import { cursorNode, nodeInput, performNodeMovement, renderNode, setParentNode } from "./scene-node";

import { assert } from "./debug";
import { clearInput } from "./input";
import { pushQuad } from "./draw";

type Scene =
  {
    _rootId: number,
    _updateFn: (now: number, delta: number) => void;
  };
let TRANSITION_KEY = `xsit`;
let transitionColour = 0;
let bgr: number[] = [0, 0, 0];

let Scenes: Map<number, Scene> = new Map();
let CurrentScene: Scene;
let PreviousScene: Scene;
export let registerScene = (sceneId: number, setupFn: () => number, updateFn: (now: number, delta: number) => void): void =>
{
  let rootId = setupFn();
  let scene: Scene = { _rootId: rootId, _updateFn: updateFn };
  Scenes.set(sceneId, scene);

  if (!CurrentScene)
  {
    CurrentScene = scene;
    setParentNode(cursorNode, scene._rootId);
  }
};

export let pushScene = (sceneId: number, speed: number = 250, fadeColor: number = 0xFF000000): void =>
{
  let [_, b, g, r] = hexToColour(fadeColor);
  bgr = [b, g, r];
  let scene = Scenes.get(sceneId);
  assert(scene !== undefined, `Unable to find scene #"${ sceneId }"`);
  setParentNode(cursorNode, scene._rootId);
  transitionToScene(scene, speed);
};

let transitionToScene = (scene: Scene, speed: number = 250): void =>
{
  if (CurrentScene)
  {
    PreviousScene = CurrentScene;
  }
  let transition = createInterpolationData(speed, [0], [255], () =>
  {
    CurrentScene = scene;
    clearInput();

    let transition = createInterpolationData(speed, [255], [0], () =>
    {
    });
    Interpolators.set(TRANSITION_KEY, transition);
  });
  Interpolators.set(TRANSITION_KEY, transition);
  clearInput();
};

export let popScene = (): void =>
{
  if (PreviousScene)
  {
    transitionToScene(PreviousScene);
  }
};

export let updateScene = (now: number, delta: number): void =>
{
  let rootId = CurrentScene._rootId;

  if (!Interpolators.has(TRANSITION_KEY))
  {
    nodeInput(rootId);
  }
  performNodeMovement(rootId);
  CurrentScene._updateFn(now, delta);
};

export let renderScene = (now: number, delta: number): void =>
{
  let rootId = CurrentScene._rootId;
  renderNode(rootId, now, delta);

  if (Interpolators.has(TRANSITION_KEY))
  {
    let transition = Interpolators.get(TRANSITION_KEY);
    if (transition?._lastResult)
    {
      let i = transition._lastResult;
      let colour = colourToHex(i._values[0], bgr[0], bgr[1], bgr[2]);
      transitionColour = colour;
    }
    pushQuad(0, 0, SCREEN_WIDTH + 2, SCREEN_HEIGHT + 2, transitionColour);
  }
};
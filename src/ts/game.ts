import { Align_Center, createTextNode, updateTextNode } from "./nodes/text-node";
import { Interpolators, interpolate } from "./interpolate";
import { SCREEN_CENTER_X, SCREEN_CENTER_Y, doc, setupScreen } from "./screen";
import { cursorNode, moveNode, renderNode, setupCursorNode } from "./scene-node";
import { gl_clear, gl_flush, gl_getContext, gl_init, gl_setClear } from "./gl";
import { initStats, tickStats } from "./stats";
import { initializeInput, inputContext, moveCursor } from "./input";
import { registerScene, renderScene, updateScene } from "./scene";

import { MainMenu } from "./scenes/main-menu";
import { assert } from "./debug";
import { initGameState } from "./game-state";
import { loadSpriteSheet } from "./texture";
import { setupAudio } from "./zzfx";

window.addEventListener("load", async () =>
{
  let canvas = setupScreen();
  let context = gl_getContext(canvas);
  gl_init(context);
  await loadSpriteSheet();
  initStats();

  let delta: number;
  let then: number;

  let playing: boolean = false;
  let loadGame = () =>
  {
    assert(canvas !== null, "Unable to find canvas element on index.html");
    canvas.removeEventListener("pointerdown", loadGame);
    canvas.removeEventListener("touchstart", loadGame);
    updateTextNode(preGameMessage, "loading...");

    setTimeout(() =>
    {
      playing = true;
      initializeInput(canvas);
      setupCursorNode();
      initGameState();

      setupAudio();
      registerScene(MainMenu._sceneId, MainMenu._setup, MainMenu._update);

      updateTextNode(preGameMessage, "paused");
      doc.addEventListener("visibilitychange", () => { playing = !doc.hidden; });
    }, 16);
  };

  canvas.addEventListener("pointerdown", loadGame);
  canvas.addEventListener("touchstart", loadGame);
  let preGameMessage = createTextNode(0, "touch to start", SCREEN_CENTER_X, SCREEN_CENTER_Y - 10, { _scale: 2, _textAlign: Align_Center });

  let loop = (now: number): void =>
  {
    delta = now - then;
    if (delta > 33.33)
    {
      delta = 16.66;
    }
    then = now;
    gl_clear();

    if (playing)
    {
      moveNode(cursorNode, inputContext._cursor[0], inputContext._cursor[1], 75);

      // Step all active interpolators forwards
      for (let [_, interpolator] of Interpolators)
      {
        interpolate(now, interpolator);
      }

      updateScene(now, delta);
      renderScene(now, delta);

      // Clean up any completed interpolators
      for (let [id, interpolator] of Interpolators)
      {
        if (interpolator._lastResult?._done)
        {
          Interpolators.delete(id);
        }
      }
    }
    else
    {
      renderNode(preGameMessage, now, delta);
    }
    gl_flush();
    tickStats(now, delta);

    // Prevent the 'cursor' from hovering an element after touching it
    if (inputContext._fire > 0 && inputContext._isTouch)
    {
      moveCursor(0, 0);
    }
    inputContext._fire = 0;

    requestAnimationFrame(loop);
  };
  gl_setClear(0, 0, 0);
  then = performance.now();
  requestAnimationFrame(loop);
});
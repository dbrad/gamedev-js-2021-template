import { Align_Center, createTextNode, updateTextNode } from "./nodes/text-node";
import { initGameState } from "./game-state";
import { Interpolators, interpolate } from "./interpolate";
import { SCREEN_CENTER_X, SCREEN_CENTER_Y, doc, setupScreen } from "./screen";
import { gl_clear, gl_flush, gl_getContext, gl_init, gl_setClear } from "./gl";
import { initStats, tickStats } from "./stats";
import { initializeInput, inputContext } from "./input";
import { registerScene, renderScene, updateScene } from "./scene";
import { setupAudio, startMusic } from "./zzfx";

import { MainMenu } from "./scenes/main-menu";
import { assert } from "./debug";
import { loadSpriteSheet } from "./texture";
import { renderNode } from "./scene-node";

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
      initGameState();

      setupAudio();
      registerScene(MainMenu._sceneId, MainMenu._setup, MainMenu._update);

      startMusic();

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
    if (inputContext._fire > -1 && inputContext._isTouch)
    {
      inputContext._cursor[0] = 0;
      inputContext._cursor[1] = 0;
    }
    inputContext._fire = -1;

    requestAnimationFrame(loop);
  };
  gl_setClear(0, 0, 0);
  then = performance.now();
  requestAnimationFrame(loop);
});
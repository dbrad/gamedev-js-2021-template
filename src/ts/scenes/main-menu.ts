import { Align_Center, Align_Right, createTextNode } from "../nodes/text-node";
import { CARD_TYPE, getCardNode } from "../nodes/card-node";
import { SCREEN_CENTER_X, SCREEN_CENTER_Y, SCREEN_HEIGHT, SCREEN_WIDTH, requestFullscreen } from "../screen";
import { createNode, moveNode, nodeSize, setParentNode } from "../scene-node";

import { VERSION } from "../version";
import { createButtonNode } from "../nodes/button-node";
import { inputContext } from "../input";

export namespace MainMenu
{
  export const _sceneId = 0;

  let fullscreenButton: number;

  export let _setup = (): number =>
  {
    let rootId = createNode();
    nodeSize(rootId, SCREEN_WIDTH, SCREEN_HEIGHT);

    createTextNode(rootId, "gamedev js 2021 template", SCREEN_CENTER_X, 40, { _scale: 2, _textAlign: Align_Center });

    fullscreenButton = createButtonNode(rootId, "fullscreen", 288, 40, SCREEN_CENTER_X - 144, SCREEN_CENTER_Y + 100);

    createTextNode(rootId, VERSION, SCREEN_WIDTH - 2, SCREEN_HEIGHT - 10, { _textAlign: Align_Right });

    const card = getCardNode({ cardId: 0, cardType: CARD_TYPE.PLAYER_HAND, draggable: true });
    moveNode(card, 50, 50);
    setParentNode(card, rootId);

    return rootId;
  };

  export let _update = (now: number, delta: number): void =>
  {
    if (inputContext._fire === fullscreenButton)
    {
      requestFullscreen();
    }
  };
}
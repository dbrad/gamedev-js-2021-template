import { createNode, nodeSize, node_draggable } from "../scene-node";

import { createSpriteNode } from "./sprite-node";

export const enum CARD_TYPE
{
    NONE,
    PLAYER_HAND,
    PLAYER_INPLAY,
    ENEMY
}

let card_pool: number[] = [];

let node_card_id: number[] = [];
let node_card_type: CARD_TYPE[] = [];
let node_card_background: number[] = [];
let node_card_foreground: number[] = [];

function createCardNode(): number
{
    const nodeId = createNode();

    const cardBackground = createSpriteNode(nodeId, "a", 0, 0, { _scale: 2 });
    node_card_background[nodeId] = cardBackground;

    const cardForground = createSpriteNode(nodeId, "a", 0, 0, { _scale: 2 });
    node_card_foreground[nodeId] = cardForground;

    node_card_type[nodeId] = CARD_TYPE.NONE;

    nodeSize(nodeId, 16, 16);

    return nodeId;
}

type CardProps = {
    cardId: number;
    cardType: CARD_TYPE;
    draggable: boolean;
};

export function getCardNode(cardProperties?: CardProps): number
{
    const cardId = cardProperties?.cardId || -1;
    const draggable = cardProperties?.draggable || false;

    let card = card_pool.pop();
    if (!card)
    {
        card = createCardNode();
    }
    node_card_id[card] = cardId;
    node_draggable[card] = draggable;
    return card;
}

export function retireCardNode(cardNodeId: number): void
{
    node_card_id[cardNodeId] = -1;
    node_draggable[cardNodeId] = false;
    node_card_type[cardNodeId] = CARD_TYPE.NONE;
    card_pool.push(cardNodeId);
}

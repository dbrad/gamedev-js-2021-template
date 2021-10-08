import { createNode } from "../scene-node";

let node_card_pool: number[] = [];

function createCardNode(): number
{
    const nodeId = createNode();
    return nodeId;
}

type CardProps = {
    draggable?: boolean;

};

export function getCardNode(): number
{
    const card = node_card_pool.pop();
    if (!card)
    {
        return createCardNode();
    }
    return card;
}

export function retireCardNode(cardNodeId: number): void
{
    node_card_pool.push(cardNodeId);
}

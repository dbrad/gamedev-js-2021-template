import { Interpolators, createInterpolationData } from "./interpolate";
import { addV2, subV2, v2 } from "./v2";
import { gl_restore, gl_save, gl_translate } from "./gl";

import { inputContext } from "./input";
import { pushQuad } from "./draw";

let nextNodeId = 0;

export let node_render_function: ((nodeId: number, now: number, delta: number) => void)[] = [];
export let node_position: v2[] = [];
export let node_size: v2[] = [];
export let node_enabled: boolean[] = [];
export let node_interactive: boolean[] = [];
export let node_cursor_relative_position: v2[] = [];
export let node_draggable: boolean[] = [];
export let node_draggable_parent: number[] = [];
export let node_parent: number[] = [];
export let node_children: number[][] = [[]];

export let cursorNode: number;

export let setupCursorNode = (): void =>
{
  cursorNode = createNode();
  node_interactive[cursorNode] = false;
};

export let createNode = (parentId: number = 0): number =>
{
  let nodeId = ++nextNodeId;

  moveNode(nodeId, 0, 0);
  nodeSize(nodeId, 1, 1);

  node_enabled[nodeId] = true;
  node_interactive[nodeId] = true;

  setParentNode(nodeId, parentId);
  node_children[nodeId] = [];

  return nodeId;
};

export let setParentNode = (childNodeId: number, parentNodeId: number): void =>
{
  // If the node already has a parent, we need to remove this node's id from it's children list
  const previousParent = node_parent[childNodeId];
  if (previousParent)
  {
    const previousParentsChildren = node_children[previousParent];
    let index = -1;
    for (let i = 0; i < previousParentsChildren.length; i++)
    {
      if (previousParentsChildren[i] === childNodeId)
      {
        index = i;
        break;
      }
    }
    if (index > -1)
    {
      previousParentsChildren.splice(index, 1);
    }
  };

  node_parent[childNodeId] = parentNodeId;
  node_children[parentNodeId].push(childNodeId);
};

export let moveNode = (nodeId: number, x: number, y: number, duration: number = 0): Promise<void> =>
{
  if (node_position[nodeId] && node_position[nodeId][0] === x && node_position[nodeId][1] === y)
  {
    return Promise.resolve();
  }

  if (duration > 0)
  {
    let interpKey = `node-mv-${ nodeId }`;
    if (Interpolators.has(interpKey)) return Promise.resolve();
    return new Promise((resolve, _) =>
    {
      Interpolators.set(interpKey, createInterpolationData(duration, node_position[nodeId], [x, y], resolve));
    });
  }

  node_position[nodeId] = [x, y];
  return Promise.resolve();
};

export let performNodeMovement = (nodeId: number): void =>
{
  let interpKey = `node-mv-${ nodeId }`;
  if (Interpolators.has(interpKey))
  {
    let interp = Interpolators.get(interpKey);
    if (interp?._lastResult)
    {
      moveNode(nodeId, interp._lastResult._values[0], interp._lastResult._values[1]);
    }
  }

  let children = node_children[nodeId];
  for (let childId of children)
  {
    performNodeMovement(childId);
  }
};

export let nodeSize = (nodeId: number, w: number, h: number): void =>
{
  node_size[nodeId] = [w, h];
};

export let nodeInput = (nodeId: number, cursorPosition: number[] = inputContext._cursor, rootId?: number): void =>
{
  rootId = rootId || nodeId;
  if (!node_enabled[nodeId] || !node_interactive[nodeId]) return;
  let [cx, cy] = cursorPosition;
  let [px, py] = node_position[nodeId];
  let [w, h] = node_size[nodeId];
  let relativePosition: v2 = [cx - px, cy - py];
  node_cursor_relative_position[nodeId] = relativePosition;

  if (cx >= px && cy >= py && cx < px + w && cy < py + h)
  {
    inputContext._hot = nodeId;
    if (inputContext._active === nodeId)
    {
      if (!inputContext._mouseDown)
      {
        if (inputContext._hot === nodeId)
        {
          if (inputContext._dragging)
          {
            // TODO(dbrad): attempt to drop
          }
          else
          {
            inputContext._fire = nodeId;
          }
        }
        inputContext._active = 0;
      }
    }
    else if (inputContext._hot === nodeId && inputContext._mouseDown)
    {
      inputContext._active = nodeId;
    }

    let children = node_children[nodeId];
    for (let childId of children)
    {
      nodeInput(childId, relativePosition, rootId);
    }
  }

  // Drag and Drop System
  if (nodeId === rootId)
  {
    const activeNodeId = inputContext._active;
    if (!activeNodeId)
    {
      for (const childNodeId of node_children[cursorNode])
      {
        let childPositionRelativeToCursor = node_position[childNodeId];
        let cursorPositionRelativeToTargetParent = node_cursor_relative_position[node_draggable_parent[childNodeId]];
        let childPositionRelativeToTargetParent = addV2(childPositionRelativeToCursor, cursorPositionRelativeToTargetParent);

        setParentNode(childNodeId, node_draggable_parent[childNodeId]);
        moveNode(childNodeId, childPositionRelativeToTargetParent[0], childPositionRelativeToTargetParent[1]);
        moveNode(childNodeId, 0, 0, 250);
        node_draggable_parent[childNodeId] = 0;
      }
      inputContext._dragging = false;
    }
    else if (!inputContext._dragging && node_draggable[activeNodeId] && node_parent[activeNodeId] !== cursorNode)
    {
      let nodePositionRelativeToParent = node_position[activeNodeId];
      let cursorPositionRelativeToParent = node_cursor_relative_position[node_parent[activeNodeId]];
      let childPositionRelativeToCursor = subV2(nodePositionRelativeToParent, cursorPositionRelativeToParent);

      inputContext._dragging = true;
      node_draggable_parent[activeNodeId] = node_parent[activeNodeId];
      setParentNode(activeNodeId, cursorNode);
      moveNode(activeNodeId, childPositionRelativeToCursor[0], childPositionRelativeToCursor[1]);
    }
  }
};

export let renderNode = (nodeId: number, now: number, delta: number): void =>
{
  if (node_enabled[nodeId])
  {
    let [x, y] = node_position[nodeId];
    gl_save();
    gl_translate(x, y);

    if (node_render_function[nodeId])
    {
      node_render_function[nodeId](nodeId, now, delta);
    }
    // @ifdef DEBUG
    if (nodeId === cursorNode || node_draggable[nodeId])
    {
      let size = node_size[nodeId];
      pushQuad(0, 0, 1, size[1], 0xFF00ff00);
      pushQuad(0, 0, size[0], 1, 0xFF00ff00);
      pushQuad(size[0] - 1, 0, 1, size[1], 0xFF00ff00);
      pushQuad(0, size[1] - 1, size[0], 1, 0xFF00ff00);
    }
    // @endif

    for (let childId of node_children[nodeId])
    {
      renderNode(childId, now, delta);
    }
    gl_restore();
  }
};
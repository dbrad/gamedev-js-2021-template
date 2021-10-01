type GameState = {};
export let gameState: GameState;

export let initGameState = (): void =>
{
  gameState = {};
};

let saveName = `gamesavenamehere`;
let storage = window.localStorage;
export let saveGame = (): void =>
{
  let json = JSON.stringify(gameState);
  let b64 = btoa(json);
  storage.setItem(saveName, b64);
};
export let loadGame = (): void =>
{
  let b64 = storage.getItem(saveName);
  if (!b64)
  {
    initGameState();
    saveGame();
    return;
  }
  gameState = JSON.parse(atob(b64)) as GameState;
};

export let hasSaveFile = (): boolean =>
{
  return storage.getItem(saveName) !== null;
};
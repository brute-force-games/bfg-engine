import { GameTableActionSource, HostActionSources, PlayerActionSources } from "./game-table-action";


export const isHostActionSource = (source: GameTableActionSource | undefined): source is typeof HostActionSources[number] => { 
  return HostActionSources.includes(source as any);
}

export const isPlayerActionSource = (source: GameTableActionSource | undefined): source is typeof PlayerActionSources[number] => { 
  return PlayerActionSources.includes(source as any);
}

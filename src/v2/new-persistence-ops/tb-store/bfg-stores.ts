import { createStore } from "tinybase";
import { createLocalPersister } from "tinybase/persisters/persister-browser";

import {
  BFG_GAME_ROOMS_TABLE_NAME,
  BFG_GAME_INSTANCES_TABLE_NAME,
  BFG_GAME_STEPS_TABLE_NAME,
  GameInstanceMappingsTinybaseTableColumnsSchema,
  GameRoomSnapshotTinybaseTableColumnsSchema,
  GameStepTinybaseTableColumnsSchema,
} from "./bfg-store-constants";


export const bfgArchivesStore = createStore();
const gameRoomsPersister = createLocalPersister(bfgArchivesStore, BFG_GAME_ROOMS_TABLE_NAME);
const gameStepsPersister = createLocalPersister(bfgArchivesStore, BFG_GAME_STEPS_TABLE_NAME);
const gameInstancesPersister = createLocalPersister(bfgArchivesStore, BFG_GAME_INSTANCES_TABLE_NAME);


bfgArchivesStore.setTablesSchema({
  [BFG_GAME_INSTANCES_TABLE_NAME]: GameInstanceMappingsTinybaseTableColumnsSchema,
  [BFG_GAME_ROOMS_TABLE_NAME]: GameRoomSnapshotTinybaseTableColumnsSchema,
  [BFG_GAME_STEPS_TABLE_NAME]: GameStepTinybaseTableColumnsSchema,
});

gameRoomsPersister.startAutoLoad();
gameRoomsPersister.startAutoSave();

gameStepsPersister.startAutoLoad();
gameStepsPersister.startAutoSave();

gameInstancesPersister.startAutoLoad();
gameInstancesPersister.startAutoSave();

// import { createStore } from "tinybase";
// import { createSqliteWasmPersister } from "tinybase/persisters/persister-sqlite-wasm";
// import { getSqliteWasm } from "tinybase/persisters/persister-sqlite-wasm";

// import {
//   BFG_GAME_ROOMS_TABLE_NAME,
//   BFG_GAME_INSTANCES_TABLE_NAME,
//   BFG_GAME_STEPS_TABLE_NAME,
//   GameInstanceMappingsTinybaseTableColumnsSchema,
//   GameRoomSnapshotTinybaseTableColumnsSchema,
//   GameStepTinybaseTableColumnsSchema,
// } from "./bfg-store-constants";


// export const bfgSqliteArchivesStore = createStore();

// // Initialize SQLite persisters for browser
// let gameRoomsSqlitePersister: ReturnType<typeof createSqliteWasmPersister> | null = null;
// let gameStepsSqlitePersister: ReturnType<typeof createSqliteWasmPersister> | null = null;
// let gameInstancesSqlitePersister: ReturnType<typeof createSqliteWasmPersister> | null = null;

// // Initialize SQLite persisters asynchronously
// export const initSqlitePersisters = async () => {
//   if (gameRoomsSqlitePersister) {
//     return; // Already initialized
//   }

//   const sqliteWasm = await getSqliteWasm();
  
//   gameRoomsSqlitePersister = createSqliteWasmPersister(
//     bfgSqliteArchivesStore,
//     sqliteWasm,
//     BFG_GAME_ROOMS_TABLE_NAME,
//     `${BFG_GAME_ROOMS_TABLE_NAME}.db`
//   );
  
//   gameStepsSqlitePersister = createSqliteWasmPersister(
//     bfgSqliteArchivesStore,
//     sqliteWasm,
//     BFG_GAME_STEPS_TABLE_NAME,
//     `${BFG_GAME_STEPS_TABLE_NAME}.db`
//   );
  
//   gameInstancesSqlitePersister = createSqliteWasmPersister(
//     bfgSqliteArchivesStore,
//     sqliteWasm,
//     BFG_GAME_INSTANCES_TABLE_NAME,
//     `${BFG_GAME_INSTANCES_TABLE_NAME}.db`
//   );

//   bfgSqliteArchivesStore.setTablesSchema({
//     [BFG_GAME_INSTANCES_TABLE_NAME]: GameInstanceMappingsTinybaseTableColumnsSchema,
//     [BFG_GAME_ROOMS_TABLE_NAME]: GameRoomSnapshotTinybaseTableColumnsSchema,
//     [BFG_GAME_STEPS_TABLE_NAME]: GameStepTinybaseTableColumnsSchema,
//   });

//   gameRoomsSqlitePersister.startAutoLoad();
//   gameRoomsSqlitePersister.startAutoSave();

//   gameStepsSqlitePersister.startAutoLoad();
//   gameStepsSqlitePersister.startAutoSave();

//   gameInstancesSqlitePersister.startAutoLoad();
//   gameInstancesSqlitePersister.startAutoSave();
// };


import { createFilePersister } from "tinybase/persisters/persister-file";
import { BfgMyUserArchivesStore } from "./bfg-my-user-archives-store";


export const BfgMyUserArchivesFilePersister = createFilePersister(BfgMyUserArchivesStore, "bfg-my-user-archives.db");

BfgMyUserArchivesFilePersister.startAutoLoad();
BfgMyUserArchivesFilePersister.startAutoSave();

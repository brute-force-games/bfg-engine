import { createStore } from "tinybase";
import {createZodSchematizer} from 'tinybase/schematizers/schematizer-zod';
import { BfgGameHostArchivesTbSchema } from "./bfg-gamehost-archives-tb-schemas";


const schematizer = createZodSchematizer();


export const BfgGameHostArchivesStore = createStore().setTablesSchema(
  schematizer.toTablesSchema(BfgGameHostArchivesTbSchema),
);

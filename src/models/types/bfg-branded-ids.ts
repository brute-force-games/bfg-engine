import { z } from "zod";
import { createBfgBrandedNumberIndexToolbox } from "./branded-ids";
import { 
  PlayerSeatPrefix,
  type BfgIdBrand,  
} from "./bfg-id-prefixes";


export const BfgGameTableSeatIdToolbox = createBfgBrandedNumberIndexToolbox(PlayerSeatPrefix as BfgIdBrand);
export type GameTableSeatId = z.infer<typeof BfgGameTableSeatIdToolbox.idSchema>;

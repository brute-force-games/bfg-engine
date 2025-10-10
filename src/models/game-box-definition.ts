import { z } from "zod";


export const BfgSupportedGameTitleBrandKey = 'BfgSupportedGameTitle' as const;
export const BfgSupportedGameTitleSchema = z.string().brand(BfgSupportedGameTitleBrandKey);
export type BfgSupportedGameTitle = z.infer<typeof BfgSupportedGameTitleSchema>;


const GameDefinitionSchema = z.object({
  title: BfgSupportedGameTitleSchema,
  minNumPlayersForGame: z.number().int().positive(),
  maxNumPlayersForGame: z.number().int().positive(),
});

export type GameDefinition = z.infer<typeof GameDefinitionSchema>;

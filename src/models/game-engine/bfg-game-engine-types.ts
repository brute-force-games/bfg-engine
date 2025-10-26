import z from "zod";
import { PlayerProfileId } from "~/index";
import { GameTableSeat } from "../game-table/game-table";


export const BfgPrivateGameImplStateSchema = z.object({});
export type BfgPrivateGameImplState = z.infer<typeof BfgPrivateGameImplStateSchema>;

export const BfgPlayerGameImplStateSchema = z.object({});
export type BfgPlayerGameImplState = z.infer<typeof BfgPlayerGameImplStateSchema>;

export const BfgPublicGameImplStateSchema = z.object({});
export type BfgPublicGameImplState = z.infer<typeof BfgPublicGameImplStateSchema>;


export const BfgPrivateActionSchema = z.object({});
export type BfgPrivateAction = z.infer<typeof BfgPrivateActionSchema>;



// export const BfgDataEncodingSchema = z.object({
//   format: BfgDataEncodingFormatSchema,
//   data: z.string(),
// });
// export type BfgDataEncoding = z.infer<typeof BfgDataEncodingSchema>;


// export const BfgDataCustomRepresentationSchema = z.object({
//   repr: z.literal('custom'),
//   data: z.string(),
// });

// export const BfgDataJsonStringRepresentationSchema = z.object({
//   repr: z.literal('json-str'),
//   data: z.string(),
// });

// export const BfgDataJsonObjectRepresentationSchema = z.object({
//   repr: z.literal('json-obj'),
//   data: z.object({}),
// });

// export const BfgDataJsonZodRepresentationSchema = z.object({
//   repr: z.literal('json-zod'),
//   data: z.object({}),
// });

// export const BfgDataEncodingSchema = z.discriminatedUnion('repr', [
//   BfgDataCustomRepresentationSchema,
//   BfgDataJsonStringRepresentationSchema,
//   BfgDataJsonObjectRepresentationSchema,
//   BfgDataJsonZodRepresentationSchema,
// ]);

// export type BfgDataEncoding = z.infer<typeof BfgDataEncodingSchema>;




export const BfgGameImplPlayerActionSchema = z.object({
  source: z.literal('player'),
  playerActionType: z.string(),
  // action: actionSchema,
});

export type BfgGameImplPlayerAction = z.infer<typeof BfgGameImplPlayerActionSchema>;


export const BfgGameImplHostActionSchema = z.object({
  source: z.literal('host'),
  hostActionType: z.enum([
    'game-table-action-host-initialize-game',
    'game-table-action-host-update-configuration',
    'game-table-action-host-starts-game',
  ]),
  // action: actionSchema,
});

export type BfgGameImplHostAction = z.infer<typeof BfgGameImplHostActionSchema>;


export const BfgGameImplActionSchema = z.discriminatedUnion('source', [
  BfgGameImplPlayerActionSchema,
  BfgGameImplHostActionSchema,
]);

export type BfgGameImplAction = z.infer<typeof BfgGameImplActionSchema>;



// export const createBfgPlayerActionSchema = <T extends z.ZodTypeAny>(actionSchema: T): z.ZodTypeAny => BfgGameImplPlayerActionSchema.extend({
//   action: actionSchema,
// });
// export type BfgPlayerAction<T extends z.ZodTypeAny> = z.infer<ReturnType<typeof createBfgPlayerActionSchema<T>>>;

// export const createBfgHostActionSchema = <T extends z.ZodTypeAny>(actionSchema: T): z.ZodTypeAny => BfgGameImplHostActionSchema.extend({
//   hostActionType: z.string(),
//   action: actionSchema,
// });
// export type BfgHostAction<T extends z.ZodTypeAny> = z.infer<ReturnType<typeof createBfgHostActionSchema<T>>>;

export const BfgGameImplPublicHistoryActionSchema = z.object({});
export type BfgGameImplPublicHistoryAction = z.infer<typeof BfgGameImplPublicHistoryActionSchema>;


export type GameAccessRole = 'observer-role' | 'host-role' | 'player-role';
export type ViewLevel = 'observer-level' | 'host-level' | 'player-level';


export interface ObserverComponentProps<GIS extends BfgPublicGameImplState> {
  gameState: GIS
  hostPlayerProfileId: PlayerProfileId
  
  observedPlayerProfileId: PlayerProfileId | null
  observedPlayerSeat: GameTableSeat | null
}

export interface PlayerComponentProps<
  GIS extends BfgPlayerGameImplState,
  GA extends BfgGameImplPlayerAction
  // GIS extends z.ZodTypeAny,
  // GA extends z.ZodTypeAny
> {
  gameState: GIS
  hostPlayerProfileId: PlayerProfileId

  currentPlayerProfileId: PlayerProfileId
  currentPlayerSeat: GameTableSeat


// export interface IBfgJsonZodObjectDataEncoder<TSchema extends z.ZodTypeAny> extends IBfgDataEncoder<BfgDataEncoderFormat, z.infer<TSchema>> {
//   format: 'json-zod-object';
//   schema: TSchema;
// }


  onPlayerAction: (playerAction: GA) => void
}

export interface GameHostComponentProps<
  GIS extends BfgPrivateGameImplState,
  // GPA extends BfgGameImplPlayerAction,
  GHA extends BfgGameImplHostAction
> {
  gameState: GIS
  hostPlayerProfileId: PlayerProfileId

  actingAsPlayerProfileId: PlayerProfileId | null
  actingAsPlayerSeat: GameTableSeat | null

  // onPlayerAction: (gameState: GS, playerAction: GPA) => void
  onHostAction: (hostAction: GHA) => void
}

export interface GameHistoryComponentProps {
  // playerSeat: GameTableSeat;
  // gameState: z.infer<GS>;
  gameActions: BfgGameImplPublicHistoryAction[];
}


export type BfgAllPublicKnowledgeGameEngineComponents<
  // GIS extends z.ZodTypeAny,
  // GPA extends z.ZodTypeAny,
  // GHA extends z.ZodTypeAny,

  GIS extends BfgPublicGameImplState,
  GPA extends BfgGameImplPlayerAction,
  GHA extends BfgGameImplHostAction,

  // GHistoryA extends BfgGameImplPublicHistoryAction
> = {

  ObserverComponent: (props: ObserverComponentProps<GIS>) => React.ReactNode;
  PlayerComponent: (props: PlayerComponentProps<GIS, GPA>) => React.ReactNode;
  HostComponent: (props: GameHostComponentProps<GIS, GHA>) => React.ReactNode;
  HistoryComponent?: (props: GameHistoryComponentProps) => React.ReactNode;
}

// export const createBfgAllPublicKnowledgeGameEngineComponents(
//   GIS extends BfgPublicGameImplState,
//   GPA extends BfgGameImplPlayerAction,
//   GHA extends BfgGameImplHostAction,
// ): BfgAllPublicKnowledgeGameEngineComponents<GIS, GPA, GHA> => {
//   return {
//     ObserverComponent: (props: ObserverComponentProps<GIS>) => React.ReactNode,
//     PlayerComponent: (props: PlayerComponentProps<GIS, GPA>) => React.ReactNode,
//     HostComponent: (props: GameHostComponentProps<GIS, GHA>) => React.ReactNode,
//     HistoryComponent: (props: GameHistoryComponentProps) => React.ReactNode,
//   };
// }


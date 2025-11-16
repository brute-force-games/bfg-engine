import z from "zod";


export const BfgProtocolDataSourceSchema = z.enum([
  'p2p',
  'http',
  'tb',
  'address-bar',
  'file',
]);
export type BfgProtocolDataSource = z.infer<typeof BfgProtocolDataSourceSchema>;


export const BfgProtocolEncodingFormatSchema = z.enum([
  'json',
  'text',
  'binary',
]);
export type BfgProtocolEncodingFormat = z.infer<typeof BfgProtocolEncodingFormatSchema>;


export const BfgProtocolSemanticTypeSchema = z.enum([
  'json',
  'text',
  'binary',
]);
export type BfgProtocolSemanticType = z.infer<typeof BfgProtocolSemanticTypeSchema>;


export const BfgProtocolTypeSchema = z.object({
  bfgProtocolHandlerPrefix: z.literal('bfg'),
    // claiming the bfg starting namespace
  dataSource: BfgProtocolDataSourceSchema,
    // - this is what cares about technical capabilities of device, user identity, and user roles/permissions for application execution
  encodingFormat: BfgProtocolEncodingFormatSchema,
    // is this necessary at protocol level? it might be more of a data source level concern, although there are serialization implications
  semanticType: BfgProtocolSemanticTypeSchema,
    // - this is what cares about the meaning of the data, e.g. the type system of the application/serialization
  bootstrapString: z.string(),  // is this a program? Or a data structure? Or both?
    // this technically drives application bootstrap and execution
    // - this is what https://bruteforce.games and bfg-starter page will use to bootstrap the game
    // - this is what the user will see in the address bar
});
export type BfgProtocolType = z.infer<typeof BfgProtocolTypeSchema>;


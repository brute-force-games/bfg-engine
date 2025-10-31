import z from "zod";


export const GameTableAccessRoleSchema = z.enum(['host', 'play', 'watch']);
export type GameTableAccessRole = z.infer<typeof GameTableAccessRoleSchema>;

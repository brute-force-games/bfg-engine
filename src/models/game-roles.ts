import z from "zod";


export const GameTableAccessRoleSchema = z.enum(['host', 'play', 'watch', 'none']);
export type GameTableAccessRole = z.infer<typeof GameTableAccessRoleSchema>;

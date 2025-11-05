import { GameTableAccessRole } from "~/models/game-roles";


export const getAllowedRolesForAccessRole = (accessRole: GameTableAccessRole): GameTableAccessRole[] => {
  if (accessRole === 'host') {
    return ['host', 'play', 'watch'];
  }
  if (accessRole === 'play') {
    return ['play', 'watch'];
  }
  if (accessRole === 'watch') {
    return ['watch'];
  }
  return ['none'];
}

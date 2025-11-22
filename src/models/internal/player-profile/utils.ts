import { PrivatePlayerProfile } from "./private-player-profile";
import { PublicPlayerProfile } from "./public-player-profile";


export const convertPrivateToPublicProfile = (privateProfile: PrivatePlayerProfile): PublicPlayerProfile => {
  const retVal: PublicPlayerProfile = {
    id: privateProfile.id,
    handle: privateProfile.handle,
    avatarImageUrl: privateProfile.avatarImageUrl,
    signingPublicKey: privateProfile.signingPublicKey,
    encryptionPublicKey: privateProfile.encryptionPublicKey,
    publicKey: privateProfile.publicKey,
    walletAddress: privateProfile.walletAddress,
    walletPublicKey: privateProfile.walletPublicKey,
    // identityType: privateProfile.identityType,
    createdAt: privateProfile.createdAt,
    updatedAt: privateProfile.updatedAt,
  };

  return retVal;
};
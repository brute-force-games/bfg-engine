import { describe, expect, it, beforeEach } from "vitest";
import {
  addPlayerProfile,
  getPlayerProfile,
  clearAllProfiles,
  TB_PLAYER_PROFILES_TABLE_KEY,
} from "../../../src/v2/new-persistence-ops/tb-store/my-user-archives/bfg-my-user-archives-ops";
import { BfgMyUserArchivesStore } from "../../../src/v2/new-persistence-ops/tb-store/my-user-archives/bfg-my-user-archives-store";

describe("tb-my-user-archives-ops - addPlayerProfile", () => {
  beforeEach(() => {
    // Ensure a clean store before each test run
    clearAllProfiles();
  });

  it("adds a new player profile to the TinyBase store", async () => {
    const handle = "test-user";
    const avatarUrl = "https://example.com/avatar.png";

    const profileId = await addPlayerProfile(handle, avatarUrl);

    // Verify the row exists in the underlying TinyBase store
    const rawRow = BfgMyUserArchivesStore.getRow(
      TB_PLAYER_PROFILES_TABLE_KEY,
      profileId,
    );

    expect(rawRow).toBeDefined();
    expect(rawRow?.handle).toBe(handle);
    expect(rawRow?.avatarImageUrl).toBe(avatarUrl);

    // Verify we can read back a parsed profile via the public API
    const profile = getPlayerProfile(profileId);

    expect(profile).not.toBeNull();
    expect(profile?.id).toBe(profileId);
    expect(profile?.handle).toBe(handle);
    expect(profile?.avatarImageUrl).toBe(avatarUrl);
  });
});

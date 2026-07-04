import type { NPool } from '@nostrify/nostrify';

import {
  KIND_BLOBBONAUT_PROFILE,
  BLOBBONAUT_PROFILE_KINDS,
  getBlobbonautQueryDValues,
  isValidBlobbonautEvent,
  isLegacyBlobbonautKind,
  parseBlobbonautEvent,
  type BlobbonautProfile,
} from '@blobbi-kit/core/blobbi';

/**
 * Fetches the freshest BlobbonautProfile for a given pubkey directly from relays.
 *
 * This is a read-modify-write safety helper used before mutating the
 * Blobbonaut profile (kind 11125) to avoid clobbering stale cache data.
 *
 * Returns the parsed profile or null if none exists on relays.
 */
export async function fetchFreshBlobbonautProfile(
  nostr: NPool,
  pubkey: string,
): Promise<BlobbonautProfile | null> {
  const dValues = getBlobbonautQueryDValues(pubkey);

  const timeout = AbortSignal.timeout(10_000);
  const events = await nostr.query(
    [
      {
        kinds: [...BLOBBONAUT_PROFILE_KINDS],
        authors: [pubkey],
        '#d': dValues,
      },
    ],
    { signal: timeout },
  );

  const validEvents = events.filter(isValidBlobbonautEvent);
  if (validEvents.length === 0) return null;

  // Prefer current kind (11125) over legacy kind (31125)
  const currentKindEvents = validEvents.filter(e => e.kind === KIND_BLOBBONAUT_PROFILE);
  const legacyKindEvents = validEvents.filter(e => isLegacyBlobbonautKind(e));

  if (currentKindEvents.length > 0) {
    const sorted = currentKindEvents.sort((a, b) => b.created_at - a.created_at);
    return parseBlobbonautEvent(sorted[0]) ?? null;
  }

  if (legacyKindEvents.length > 0) {
    const sorted = legacyKindEvents.sort((a, b) => b.created_at - a.created_at);
    return parseBlobbonautEvent(sorted[0]) ?? null;
  }

  return null;
}

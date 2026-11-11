/**
 * Replay cache for DPoP proof `jti` values.
 *
 * A proof `jti` may only be used once within the replay window
 * (`REPLAY_WINDOW_MS`). Implementations must be safe for concurrent use.
 */
export interface ReplayCache {
  /**
   * Record a `jti` as seen. Returns `false` if the `jti` was already seen
   * within the window (a replay), `true` if this is the first sighting.
   */
  checkAndStore(jti: string): Promise<boolean> | boolean;

  /** Remove a `jti` from the cache (used when the window is cut short). */
  delete(jti: string): Promise<void> | void;
}

/**
 * In-memory replay cache backed by a `Map` with lazy TTL sweeping.
 * Suitable for single-instance deployments; use a shared cache (e.g. Redis)
 * when the gateway runs on multiple instances.
 */
export class InMemoryReplayCache implements ReplayCache {
  private readonly entries = new Map<string, number>();

  constructor(private readonly ttlMs: number) {}

  checkAndStore(jti: string): boolean {
    const now = Date.now();
    this.sweep(now);

    const seenAt = this.entries.get(jti);
    if (seenAt !== undefined) {
      return false; // replay
    }

    this.entries.set(jti, now);
    return true;
  }

  delete(jti: string): void {
    this.entries.delete(jti);
  }

  /** Remove entries that have outlived the TTL. */
  private sweep(now: number): void {
    const cutoff = now - this.ttlMs;
    for (const [jti, seenAt] of this.entries) {
      if (seenAt < cutoff) {
        this.entries.delete(jti);
      }
    }
  }
}

import { REPLAY_WINDOW_MS } from "@ironclad/shared";

/**
 * Configuration for the Ironclad gateway middleware.
 */
export interface GatewayConfig {
  /**
   * Path prefixes (or exact paths) that require a DPoP proof.
   * Only these "sensitive operations" demand a proof; every other request
   * is allowed to use the short-lived Bearer access token directly.
   */
  sensitiveOperations: string[];

  /**
   * During the migration window, accept plain Bearer tokens that are not yet
   * bound to a hardware key. Default: true. See docs/adr/003-legacy-fallback.md.
   */
  legacyBearerFallback: boolean;

  /**
   * How long a DPoP proof `jti` is remembered for replay detection.
   * Default: 5 minutes.
   */
  replayWindowMs: number;

  /**
   * Optional Redis connection URL for a distributed replay cache.
   * When omitted, an in-memory cache is used (single instance only).
   */
  redisUrl?: string;
}

/** Default configuration values. */
export const DEFAULT_CONFIG: GatewayConfig = {
  sensitiveOperations: ["/token", "/refresh", "/transfer", "/admin"],
  legacyBearerFallback: true,
  replayWindowMs: REPLAY_WINDOW_MS,
  redisUrl: undefined,
};

/** Merge a partial config over the defaults. */
export function resolveConfig(overrides: Partial<GatewayConfig> = {}): GatewayConfig {
  return { ...DEFAULT_CONFIG, ...overrides };
}

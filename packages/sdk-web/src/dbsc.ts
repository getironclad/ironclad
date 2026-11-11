/**
 * Device Bound Session Credentials (DBSC) — Chrome/Edge only.
 *
 * DBSC lets the browser mint device-bound session credentials that are
 * cryptographically tied to the device, without requiring a user gesture per
 * request. The SDK prefers DBSC when available and falls back to DPoP.
 *
 * TODO:
 * - detect DBSC availability (navigator.credentials / chrome-specific API)
 * - mint a DBSC credential via the W3C credentials API once shipped
 * - cache the credential for the session and rotate as needed
 */

/** Whether the current browser supports DBSC. */
export function isDbscAvailable(): boolean {
  // TODO(dbsc): detect the device-bound session credentials API.
  // Placeholder: not available anywhere yet (W3C draft / origin trial).
  return false;
}

/**
 * Obtain a DBSC credential for the current session.
 * Throws when DBSC is unavailable.
 */
export async function getDbscCredential(): Promise<unknown> {
  // TODO(dbsc): mint and return a device-bound session credential.
  throw new Error("DBSC is not available in this environment yet");
}

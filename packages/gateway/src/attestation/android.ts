/**
 * Android (StrongBox / Play Integrity) attestation verification.
 *
 * TODO:
 * - verify the Play Integrity verdict / StrongBox attestation certificate
 * - verify the signature over the challenge nonce
 * - verify the key is hardware-backed (StrongBox / TEE)
 * - extract the application key and compute `cnf.jkt`
 */
export function verifyAndroidAttestation(
  _attestation: unknown,
): Promise<{ jkt: string }> {
  // TODO(attestation): implement Android attestation verification.
  throw new Error("verifyAndroidAttestation: not implemented yet");
}

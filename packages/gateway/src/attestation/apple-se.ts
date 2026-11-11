/**
 * Apple Secure Enclave attestation verification.
 *
 * TODO:
 * - verify the Secure Enclave attestation object / App Attest key
 * - verify the signature over the challenge nonce
 * - verify the key is non-exportable (hardware-backed)
 * - extract the application key and compute `cnf.jkt`
 */
export function verifyAppleSeAttestation(
  _attestation: unknown,
): Promise<{ jkt: string }> {
  // TODO(attestation): implement Apple Secure Enclave verification.
  throw new Error("verifyAppleSeAttestation: not implemented yet");
}

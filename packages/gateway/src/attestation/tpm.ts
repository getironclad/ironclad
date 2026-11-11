/**
 * TPM 2.0 attestation verification.
 *
 * TODO:
 * - verify the TPM AIK (attestation identity key) certificate chain
 * - verify the PCR quote signature over the current PCR values
 * - verify the quote's fresh nonce matches the challenge
 * - extract the application key and compute `cnf.jkt`
 */
export function verifyTpmAttestation(_quote: unknown): Promise<{ jkt: string }> {
  // TODO(attestation): implement TPM 2.0 PCR quote verification.
  throw new Error("verifyTpmAttestation: not implemented yet");
}

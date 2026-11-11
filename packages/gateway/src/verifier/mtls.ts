/**
 * Verify a client certificate (mutual TLS, RFC 8705).
 *
 * Ironclad can bind sessions to client certificates presented at the TLS
 * layer (or forwarded by a terminating proxy in `X-ironclad-client-cert`).
 *
 * TODO:
 * - parse the PEM / DER client certificate
 * - verify the certificate chain against the trusted CA store
 * - check certificate validity window and revocation status (CRL/OCSP)
 * - extract the public key and compute its JWK thumbprint for `cnf.jkt`
 */
export function verifyClientCert(_cert: string): Promise<{ jkt: string }> {
  // TODO(verifier): implement RFC 8705 client certificate verification.
  throw new Error("verifyClientCert: not implemented yet");
}

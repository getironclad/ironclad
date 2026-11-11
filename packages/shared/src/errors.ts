/**
 * Ironclad error hierarchy.
 */

/** Base class for all Ironclad errors. Carries an HTTP-ish status code. */
export class IroncladError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(message: string, code = "IRONCLAD_ERROR", status = 400) {
    super(message);
    this.name = new.target.name;
    this.code = code;
    this.status = status;
  }
}

/** Raised when a DPoP proof fails validation (RFC 9449 §4). */
export class InvalidProofError extends IroncladError {
  constructor(message: string) {
    super(message, "INVALID_DPOP_PROOF", 401);
  }
}

/** Raised when a DPoP proof `jti` has already been used (replay). */
export class ReplayError extends IroncladError {
  constructor(message: string) {
    super(message, "DPOP_REPLAY", 401);
  }
}

/** Raised when a token's bound key cannot be located (missing key). */
export class MissingKeyError extends IroncladError {
  constructor(message: string) {
    super(message, "MISSING_KEY", 400);
  }
}

/** Raised when a presented proof key does not match the token's binding. */
export class BindingMismatchError extends IroncladError {
  constructor(message: string) {
    super(message, "BINDING_MISMATCH", 401);
  }
}

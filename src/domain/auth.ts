/**
 * Auth domain — the gateway port and value types.
 * No framework, no Supabase. A client-side adapter implements `AuthGateway`.
 */

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
}

export type AuthStatus = "checking" | "authed" | "unauthed";

export interface SignUpInput {
  email: string;
  password: string;
  displayName: string;
  lastName: string;
}

/** A failed call carries a human-readable message; success resolves with no error. */
export interface AuthResult {
  error?: string;
}

/** Port: authentication + the purchase-eligibility check that gates membership. */
export interface AuthGateway {
  /** Current user from the persisted session, or null. */
  getUser(): Promise<AuthUser | null>;
  /** Subscribe to auth changes; returns an unsubscribe function. */
  onAuthChange(cb: (user: AuthUser | null) => void): () => void;
  signInWithPassword(email: string, password: string): Promise<AuthResult>;
  signUp(input: SignUpInput): Promise<AuthResult>;
  signOut(): Promise<void>;
  resetPasswordForEmail(email: string): Promise<AuthResult>;
  updatePassword(password: string): Promise<AuthResult>;
  signInWithGoogle(): Promise<AuthResult>;
  /** Update the user's profile metadata (display name, last name). */
  updateProfile(displayName: string, lastName: string): Promise<AuthResult>;
  /** True if the e-mail is among program purchasers (gates /uye). */
  hasPurchase(email: string): Promise<boolean>;
  /** Current session access token (JWT) for authenticated server calls. */
  getAccessToken(): Promise<string | null>;
}

/** The authenticated member, as the UI needs it. Provided by the session layer. */
export interface CurrentUser {
  id: string;
  displayName: string;
}

/** Port: records a purchase by e-mail (gates member access via email_has_purchase). */
export interface PurchaseRepository {
  record(email: string): Promise<void>;
}

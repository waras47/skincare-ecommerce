export interface PaymentResult {
  status: "success" | "failed";
}

export interface PaymentService {
  process(method: string): Promise<PaymentResult>;
}

// PRD: dummy payment only, no real gateway — kept behind this interface so a
// real gateway (Midtrans/Xendit) can be swapped in later without touching
// checkout business logic.
class DummyPaymentService implements PaymentService {
  async process(method: string): Promise<PaymentResult> {
    const status = method === "dummy-fail" ? "failed" : "success";
    return { status };
  }
}

export const paymentService: PaymentService = new DummyPaymentService();

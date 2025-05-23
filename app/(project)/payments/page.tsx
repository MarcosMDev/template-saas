"use client";

import useMercadoPago from "@/app/hooks/useMercadoPago";
import { useStripe } from "@/app/hooks/useStripe";

export default function Payments() {
  const {
    createPaymentStripeCheckout,
    createSubscriptionStripeCheckout,
    handleCreateStripePortal,
  } = useStripe();

  const { createMercadoPagoCheckout } = useMercadoPago();

  return (
    <div className="flex flex-col gap-10 items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Pagamentos</h1>
      <button
        onClick={() => createPaymentStripeCheckout({ testId: "123" })}
        className="border rounded-md px-1"
      >
        Criar pagamento stripe
      </button>
      <button
        onClick={() => createSubscriptionStripeCheckout({ testId: "123" })}
        className="border rounded-md px-1"
      >
        Criar assinatura stripe
      </button>
      <button
        onClick={handleCreateStripePortal}
        className="border rounded-md px-1"
      >
        Criar portal de pagamento stripe
      </button>
      <button
        onClick={() =>
          createMercadoPagoCheckout({
            testeId: "123",
            userEmail: "marcosmagnopb@gmail.com",
          })
        }
        className="border rounded-md px-1"
      >
        Criar pagamento mercado pago
      </button>
    </div>
  );
}

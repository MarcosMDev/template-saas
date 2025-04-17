import { db } from "@/app/lib/firebase";
import "server-only";

import type Stripe from "stripe";

export async function handleStripePayment(
  event: Stripe.CheckoutSessionCompletedEvent
) {
  if (event.data.object.payment_status === "paid") {
    console.log(
      "Pagamento aprovador, enviar email com o link do produto e liberar acesso"
    );

    const metadata = event.data.object.metadata;

    const userId = metadata?.userId;

    if (!userId) {
      console.error("User ID not found in metadata");
      return;
    }

    await db.collection("users").doc(userId).update({
      stripeSubscriptionId: event.data.object.subscription,
      subscriptionStatus: "active",
    });
  }
}

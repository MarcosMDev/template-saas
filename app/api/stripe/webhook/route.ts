import stripe from "@/app/lib/stripe";
import { handleStripeCancelSubscription } from "@/app/server/stripe/handle-cancel";
import { handleStripePayment } from "@/app/server/stripe/handle-payment";
import { handleStripeSubscription } from "@/app/server/stripe/handle-subscription";
import { headers } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

const secret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature || !secret) {
      return NextResponse.json(
        { error: "Missing Stripe signature or secret" },
        { status: 400 }
      );
    }

    const event = stripe.webhooks.constructEvent(body, signature, secret);

    switch (event.type) {
      case "checkout.session.completed": // Pagamento aprovado se status = paid
        const metadata = event.data.object.metadata;

        if (metadata?.price === process.env.STRIPE_PRODUCT_PRICE_ID) {
          await handleStripePayment(event);
        }

        if (metadata?.price === process.env.STRIPE_SUBSCRIPTION_PRICE_ID) {
          await handleStripeSubscription(event);
        }

        break;
      case "checkout.session.expired": // Expirou o tempo de pagamento
        console.log("Enviar um email dizendo que o pagamento expirou");
        break;
      case "checkout.session.async_payment_succeeded": // Boleto pago
        console.log("Enviar um email dizendo que o pagamento foi confirmado");
        break;
      case "checkout.session.async_payment_failed": // Boleto falhou
        console.log("Enviar um email dizendo que o pagamento falhou");
        break;
      case "customer.subscription.created": // Criou assinatura
        console.log("Criou assinatura");
        break;

      case "customer.subscription.deleted": // Cancelou assinatura
        await handleStripeCancelSubscription(event);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
        break;
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Error processing webhook event:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}

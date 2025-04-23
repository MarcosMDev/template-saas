import { db } from "@/app/lib/firebase";
import resend from "@/app/lib/resend";
import "server-only";
import type Stripe from "stripe";

export async function handleStripeCancelSubscription(
  event: Stripe.CustomerSubscriptionDeletedEvent
) {
  console.log("Cancelou assinatura");

  const customerId = event.data.object.customer;

  const userRef = await db
    .collection("users")
    .where("stripeCustomerId", "==", customerId)
    .get();

  if (userRef.empty) {
    console.error("User not found for customer ID:", customerId);
    return;
  }

  const userId = userRef.docs[0].id;
  const userEmail = userRef.docs[0].data().email;

  await db.collection("users").doc(userId).update({
    subscriptionStatus: "inactive",
  });

  const { data, error } = await resend.emails.send({
    from: "Acme <me@marcosmagno.dev>",
    to: [userEmail],
    subject: "Hello world",
    text: "Subscription canceled",
  });

  if (error) {
    console.error("Error sending email:", error);
  }

  console.log("Email sent successfully:", data);
}

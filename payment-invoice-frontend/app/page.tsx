
"use client";
import { useRouter, useSearchParams  } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "sonner"
import { useEffect, Suspense  } from "react";
import {
  useStripe,
  Elements
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function PaymentStatus() {
  const stripe = useStripe();
  const searchParams = useSearchParams();
  const paymentIntentClientSecret = searchParams.get("payment_intent_client_secret");
  const router = useRouter();

  useEffect(() => {
    if (!paymentIntentClientSecret) {
      router.replace("/invoices");
    }
  }, [paymentIntentClientSecret, router]);

  useEffect(() => {
    if (!stripe || !paymentIntentClientSecret) return;

    const fetchPaymentIntent = async () => {
      const { paymentIntent } = await stripe.retrievePaymentIntent(paymentIntentClientSecret);
      return paymentIntent?.status ?? "unknown";
    };

    fetchPaymentIntent();
    toast.promise(fetchPaymentIntent, {
      loading: "Checking payment status...",
      success: (paymentIntentStatus) => {
         if (paymentIntentStatus === "succeeded") return "Payment succeeded!";
         else if (paymentIntentStatus === "processing") return "Payment is being processed.";
         else if(paymentIntentStatus === "requires_payment_method") return "Payment failed.";
         else return "Payment completed with unknown status";
      },
      error: (err) => `Error: ${err.message}`,
      position: "top-center",
    });

    setTimeout(() => {
      router.push("/invoices");
    }, 1500);
  }, [stripe, router, paymentIntentClientSecret]);

  return null;
}

export default function Home() {
  return (
  <Elements stripe={stripePromise}>
    <Suspense>
      <PaymentStatus/>
    </Suspense>
  </Elements>
);
}
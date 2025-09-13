"use client";

import { useSearchParams } from "next/navigation";
import * as React from 'react';
import { useRef } from "react";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Elements,
  // useStripe,
  // useElements,
  PaymentElement
} from "@stripe/react-stripe-js";
import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { invoiceDetailSchema } from "@/lib/validation/invoice";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {z} from "zod";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export function InputWithButton() {
  return (
    <div className="flex w-full max-w-sm items-center gap-2">
      <Input type="email" placeholder="Email" />
      <Button type="submit" variant="outline">
        Subscribe
      </Button>
    </div>
  )
}

function CheckoutForm({invoiceDetail, amount, setAmount}: {
  invoiceDetail: z.infer<typeof invoiceDetailSchema>,
  amount: number,
  setAmount:  React.Dispatch<React.SetStateAction<number>>
}) {
  // const stripe = useStripe();
  // const elements = useElements();
  //const [loading, setLoading] = React.useState(false);
  //const [clientSecret, setClientSecret] = React.useState<string | null>(null);
  //const [message, setMessage] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const minAmount = 1;
  const maxAmount = Number(invoiceDetail.amount_remaining);


  const handleAmountClick = () => {
    if (inputRef.current) {
      console.log("Email value:", inputRef.current.value);
      let amountNumber = Number(inputRef.current.value);
      if(isNaN(amountNumber))
      {
        setError("The amount must be a valid numerical value");
        return;
      }

      amountNumber = Math.round(amountNumber * 100) / 100
      if(amountNumber < minAmount)
      {
        setError(`The amount must be bigger than ${minAmount}`);
        return;
      }

      if(amountNumber > maxAmount)
      {
        setError(`The amount must be smaller than ${maxAmount}`);
        return;
      }

      if(maxAmount - amountNumber < minAmount)
      {
        setError(`The remaining balance after the charge cannot be smaller than ${minAmount}`);
        return;
      }

      setError(null);
      setAmount(amountNumber);
    }
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!stripe || !elements) return;

  //   //setLoading(true);

  //   const res = await fetch("/api/create-payment-intent", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ amount: Number(amount) }),
  //   });
  //   const data = await res.json();
  //   //setClientSecret(data.clientSecret);

  //   const { error } = await stripe.confirmPayment({
  //     elements,
  //     clientSecret: data.clientSecret,
  //     confirmParams: {
  //       return_url: process.env.NEXT_PAYMENT_RETURN_URL!
  //     }
  //   });

  //   if (error) {
  //     setMessage(error.message ?? "Payment failed");
  //   } else {
  //     setMessage("Payment successful!");
  //   }

  //   //setLoading(false);
  // };

  return (
    <div>
      <div className="flex w-full max-w-sm items-center gap-2">
      <Input type="text" placeholder="Amount" ref={inputRef} className={error ? "border-red-500" : ""}/>
      <Button type="submit" variant="outline" onClick={handleAmountClick}>
        Amount To Charge
      </Button>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <PaymentElement />
      <Button type="submit" variant="outline">
        {`Pay $${amount}`}
      </Button>
      {/* {message && <p>{message}</p>} */}
    </div>
  );
}


export default function Pay() {
  const searchParams = useSearchParams();
  const invoiceData = searchParams.get("data");
  const invoiceDetail = invoiceData ? JSON.parse(decodeURIComponent(invoiceData)) : null;
  const [amount, setAmount] = React.useState(Number(invoiceDetail.amount_remaining));

  const options: StripeElementsOptions = {
    mode: 'payment',
    amount: amount * 100,
    currency: invoiceDetail.currency,
  };

    return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <InvoiceDetailCard invoiceDetail={invoiceDetail}/>
            </div>
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <Elements stripe={stripePromise} options={options}>
                <CheckoutForm invoiceDetail={invoiceDetail} amount={amount} setAmount={setAmount}/>
              </Elements>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

function InvoiceDetailCard({invoiceDetail} : {
  invoiceDetail: z.infer<typeof invoiceDetailSchema>
}) {
  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between md:gap-4">
          <div className="space-y-1">
            <CardTitle>{`Invoice ${invoiceDetail.id}`}</CardTitle>
            <CardDescription>Invoice for services rendered</CardDescription>
          </div>
          <div className="mt-4 md:mt-0 space-y-1 text-sm">
            <div className="flex items-center gap-1">
              <div className="font-medium">Status:</div>
              <div>{`${invoiceDetail.status}`}</div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8">
          <div className="flex flex-col gap-2">
            <div className="font-semibold">Billdr - Pat Division</div>
            <div>support@billdr.com</div>
            <div>1-202-555-0170</div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="font-semibold">{`${invoiceDetail.customer_name}`}</div>
            <div>{`${invoiceDetail.customer_email}`}</div>
            <div>{`${invoiceDetail.customer_phone}`}</div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="font-semibold">1234 Main St</div>
            <div>Anytown, CA 12345</div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="font-semibold">Billing Address</div>
            <div>Same as shipping address</div>
          </div>
        </div>
        <Separator className="my-4" />
      </CardContent>
      <CardFooter>
        <div className="grid gap-1 md:grid-cols-1 md:gap-0">
          <div className="flex items-center gap-2">
            <div className="font-semibold">Invoice Total</div>
            <div className="ml-auto">{`$${invoiceDetail.amount_due}`}</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="font-semibold">Total Paid</div>
            <div className="ml-auto">{`$${invoiceDetail.amount_paid}`}</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="font-semibold">Total Remaining</div>
            <div className="ml-auto">{`$${invoiceDetail.amount_remaining}`}</div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

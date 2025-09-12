import { z } from "zod";

export const invoiceSchema = z.object({
    id: z.string(),
    amount_due: z.string(),
    amount_paid: z.string(),
    amount_remaining: z.string(),
    currency: z.string(),
    customer_name: z.string(),
    status: z.string(),
    public_invoice_link: z.string().nullable()

});

export type Invoice = z.infer<typeof invoiceSchema>;
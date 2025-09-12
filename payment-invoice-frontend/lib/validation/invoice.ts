import { z } from "zod";

export const invoiceItemSchema = z.object({
    quantity: z.number(),
    description: z.string(),
    amount: z.string(),
    id: z.string()
});

export const invoiceSchema = z.object({
    id: z.string(),
    amount_due: z.string(),
    amount_paid: z.string(),
    amount_remaining: z.string(),
    currency: z.string(),
    customer_name: z.string(),
    status: z.string(),
});

export const invoiceDetailSchema = invoiceSchema.extend({
    customer_phone: z.string(),
    customer_email: z.string(),
    line_items: z.array(invoiceItemSchema),
});

export type Invoice = z.infer<typeof invoiceSchema>;
export type InvoiceDetail = z.infer<typeof invoiceDetailSchema>;
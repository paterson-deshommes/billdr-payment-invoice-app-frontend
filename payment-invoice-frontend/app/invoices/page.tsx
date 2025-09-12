import { AppSidebar } from "@/components/app-sidebar"
import { InvoiceTable } from "@/components/invoice-table"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { invoiceSchema, Invoice } from "@/lib/validation/invoice";


export default async function Invoices() {
  const username = process.env.DJANGO_USER!;
  const password = process.env.DJANGO_PASS!;
  const apiUrl = process.env.API_URL!;

  const response = await fetch(`${apiUrl}invoices`, {
    cache: "no-store",
    headers: {
      Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) throw new Error("Failed to fetch invoices");

  const data = await response.json();
  const invoices = data.results.map((inv: Invoice) => invoiceSchema.parse(inv));
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
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <InvoiceTable data={invoices} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
